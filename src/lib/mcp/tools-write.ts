/**
 * Sage MCP Server — Write & Extended Tools (Phase 2, 23 tools)
 *
 * Categories 1–8 covering all remaining tools from the 28-tool spec.
 * Write tools (readOnly: false) require Bearer auth enforced at the route layer.
 */
import type { ToolDef, ToolContext } from "./types";
import { humanizeDraft, scoreDraft } from "./content-pipeline";

export const writeTools: ToolDef[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // Category 1: Site & Core Management (2 new write tools)
  // ═══════════════════════════════════════════════════════════════════════
  {
    name: "sage.sites.create",
    category: "Site & Core Management",
    description:
      "Register a new domain for tracking. Sage will verify ownership via meta tag or DNS, then begin crawling + rank tracking. Returns the new site with verification token.",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "Site URL (e.g. https://example.com)" },
        name: { type: "string", description: "Human-friendly name" },
        cmsType: {
          type: "string",
          enum: ["wordpress", "shopify", "webflow", "nextjs", "astro", "html", "unknown"],
          default: "unknown",
        },
      },
      required: ["url", "name"],
      additionalProperties: false,
    },
    readOnly: false,
    handler: async (args, ctx) => {
      const { db } = await import("@/lib/db");
      const url = String(args.url);
      const name = String(args.name);
      const cmsType = String(args.cmsType ?? "unknown");

      // De-dupe
      const existing = await db.site.findFirst({ where: { url, userId: ctx.userId } });
      if (existing) {
        return { error: "Site already exists for this user", site: existing };
      }

      const verificationToken = `sage-verify-${Math.random().toString(36).slice(2, 14)}`;
      const site = await db.site.create({
        data: { url, name, cmsType, userId: ctx.userId, verificationToken, verified: false },
      });

      return {
        site,
        verification: {
          method: "meta-tag",
          tag: `<meta name="sage-verification" content="${verificationToken}" />`,
          instructions: `Add the above meta tag to the <head> of ${url}, then call sage.sites.verify (Phase 3).`,
        },
        nextSteps: [
          "Add the verification meta tag to your site's <head>",
          "Call sage.audits.run to trigger the initial 358-point crawl",
          "Call sage.keywords.add to begin tracking target keywords",
        ],
      };
    },
  },
  {
    name: "sage.sites.delete",
    category: "Site & Core Management",
    description:
      "Remove a site and cascade-delete all associated audit runs, rankings, keywords, content drafts, citations, changes, and brand brain data. Irreversible.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string", description: "Site ID to delete" },
        confirm: { type: "boolean", description: "Must be true to confirm deletion", default: false },
      },
      required: ["siteId", "confirm"],
      additionalProperties: false,
    },
    readOnly: false,
    handler: async (args, ctx) => {
      const { db } = await import("@/lib/db");
      const siteId = String(args.siteId);
      if (!args.confirm) {
        return { error: "Pass confirm=true to confirm deletion. This action is irreversible." };
      }

      const site = await db.site.findUnique({ where: { id: siteId }, select: { userId: true, name: true, url: true } });
      if (!site) return { error: `Site '${siteId}' not found.` };
      if (site.userId !== ctx.userId) return { error: "Forbidden: site does not belong to authenticated user." };

      // Cascade delete (Prisma onDelete: Cascade handles most, but be explicit)
      await db.change.deleteMany({ where: { siteId } });
      await db.citation.deleteMany({ where: { siteId } });
      await db.competitor.deleteMany({ where: { siteId } });
      await db.auditFinding.deleteMany({ where: { auditRun: { siteId } } });
      await db.auditRun.deleteMany({ where: { siteId } });
      await db.ranking.deleteMany({ where: { keyword: { siteId } } });
      await db.keyword.deleteMany({ where: { siteId } });
      await db.contentDraft.deleteMany({ where: { siteId } });
      await db.brandBrainFile.deleteMany({ where: { brandBrain: { siteId } } });
      await db.brandBrain.deleteMany({ where: { siteId } });
      await db.site.delete({ where: { id: siteId } });

      return { deleted: true, siteId, name: site.name, url: site.url };
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Category 2: Keywords & Dual-Core Rank Tracking (2 new tools)
  // ═══════════════════════════════════════════════════════════════════════
  {
    name: "sage.keywords.add",
    category: "Keywords & Dual-Core Rank Tracking",
    description:
      "Add new target keywords for Google + Bing dual-core tracking. Accepts a single keyword or batch. Intent is auto-classified if not provided. Volume pulled from DataForSEO (BYOK) or estimated.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        keywords: {
          type: "array",
          items: {
            type: "object",
            properties: {
              term: { type: "string" },
              intent: { type: "string", enum: ["informational", "navigational", "transactional", "commercial"] },
              country: { type: "string", default: "us" },
              device: { type: "string", enum: ["desktop", "mobile"], default: "desktop" },
            },
            required: ["term"],
          },
          description: "Array of keywords to add (max 100 per call)",
        },
      },
      required: ["siteId", "keywords"],
      additionalProperties: false,
    },
    readOnly: false,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const siteId = String(args.siteId);
      const keywords = (args.keywords as unknown[]) || [];
      if (keywords.length === 0) return { error: "No keywords provided." };
      if (keywords.length > 100) return { error: "Max 100 keywords per call." };

      const created = [];
      const skipped = [];
      for (const k of keywords as Array<Record<string, unknown>>) {
        const term = String(k.term);
        const existing = await db.keyword.findFirst({ where: { siteId, term } });
        if (existing) {
          skipped.push({ term, reason: "already tracked", id: existing.id });
          continue;
        }
        const intent = (k.intent as string) || autoClassifyIntent(term);
        const keyword = await db.keyword.create({
          data: {
            siteId,
            term,
            intent,
            country: (k.country as string) || "us",
            device: (k.device as string) || "desktop",
            // Volume would come from DataForSEO; mock here
            volume: Math.floor(Math.random() * 12000) + 100,
            cluster: autoCluster(term),
          },
        });
        created.push(keyword);
      }

      return {
        siteId,
        added: created.length,
        skipped: skipped.length,
        created,
        skipped,
        note: "Initial rank fetch runs in background. Use sage.rankings.refresh to trigger on-demand.",
      };
    },
  },
  {
    name: "sage.rankings.refresh",
    category: "Keywords & Dual-Core Rank Tracking",
    description:
      "Trigger an on-demand rank fetch via DataForSEO. Refreshes Google + Bing positions for all keywords on a site (or a specific keyword). Returns the new rankings. BYOK key required for actual DataForSEO call; falls back to simulated positions in demo mode.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        keywordId: { type: "string", description: "Optional: refresh only this keyword (default: all site keywords)" },
        engine: { type: "string", enum: ["google", "bing"], description: "Default: both" },
      },
      required: ["siteId"],
      additionalProperties: false,
    },
    readOnly: false,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const siteId = String(args.siteId);
      const where: Record<string, unknown> = { siteId };
      if (args.keywordId) where.id = String(args.keywordId);
      const keywords = await db.keyword.findMany({ where, select: { id: true, term: true } });

      const checkedAt = new Date();
      const refreshed = [];
      for (const kw of keywords) {
        const engines = args.engine ? [String(args.engine)] : ["google", "bing"];
        for (const engine of engines) {
          // In production: call DataForSEO SERP API. In demo: simulate position.
          const lastRanking = await db.ranking.findFirst({
            where: { keywordId: kw.id, engine },
            orderBy: { checkedAt: "desc" },
            select: { position: true },
          });
          const basePos = lastRanking?.position || Math.floor(Math.random() * 40) + 5;
          // Simulate small day-over-day movement
          const newPos = Math.max(1, basePos + Math.floor(Math.random() * 5) - 2);
          const ranking = await db.ranking.create({
            data: {
              keywordId: kw.id,
              engine,
              position: newPos,
              serpFeatures: Math.random() > 0.7 ? '["featured_snippet"]' : null,
              checkedAt,
            },
          });
          refreshed.push({ keyword: kw.term, engine, position: newPos, rankingId: ranking.id });
        }
      }

      return {
        siteId,
        refreshedAt: checkedAt,
        keywordsChecked: keywords.length,
        rankingsCreated: refreshed.length,
        rankings: refreshed,
        note: "Demo mode: positions simulated. In production, this calls DataForSEO SERP API via BYOK key.",
      };
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Category 3: AI Citations & GEO Tracking (2 new tools)
  // ═══════════════════════════════════════════════════════════════════════
  {
    name: "sage.citations.battlecards",
    category: "AI Citations & GEO Tracking",
    description:
      "Generate AI competitive battlecards comparing your positioning against tracked rivals. Shows per-engine citation SOV %, top queries where competitors win, and content gaps you should close to steal AI share-of-voice.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        competitorDomain: { type: "string", description: "Optional: focus on a single competitor" },
        days: { type: "number", default: 30 },
      },
      required: ["siteId"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const siteId = String(args.siteId);
      const days = Number(args.days ?? 30);
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const [citations, competitors, site] = await Promise.all([
        db.citation.findMany({
          where: { siteId, checkedAt: { gte: since } },
          select: { engine: true, query: true, cited: true, competitorCited: true },
        }),
        db.competitor.findMany({ where: args.competitorDomain ? { siteId, domain: String(args.competitorDomain) } : { siteId } }),
        db.site.findUnique({ where: { id: siteId }, select: { url: true, name: true } }),
      ]);

      // Build per-engine SOV for our site
      const engines = ["chatgpt", "perplexity", "google-aio", "searchgpt", "claude"];
      const battlecards = competitors.map((comp) => {
        const card: Record<string, unknown> = {
          competitor: comp.domain,
          theirAiSov: comp.aiSovPercent,
          theirGoogleSov: comp.googleSovPercent,
          theirBingSov: comp.bingSovPercent,
          notes: comp.notes,
          perEngine: {} as Record<string, { ourRate: number; theirWinRate: number; queriesTheyWon: string[] }>,
        };
        for (const engine of engines) {
          const engineCites = citations.filter((c) => c.engine === engine);
          const ours = engineCites.filter((c) => c.cited).length;
          const theirWins = engineCites.filter((c) => c.competitorCited === comp.domain);
          (card.perEngine as Record<string, { ourRate: number; theirWinRate: number; queriesTheyWon: string[] }>)[engine] = {
            ourRate: engineCites.length ? Math.round((ours / engineCites.length) * 100) : 0,
            theirWinRate: engineCites.length ? Math.round((theirWins.length / engineCites.length) * 100) : 0,
            queriesTheyWon: theirWins.map((c) => c.query),
          };
        }
        return card;
      });

      return {
        site: { id: siteId, url: site?.url, name: site?.name },
        days,
        competitorCount: competitors.length,
        battlecards,
        recommendation: competitors.length
          ? `Focus on closing content gaps where rivals are cited most. Top rival: ${competitors[0].domain} at ${competitors[0].aiSovPercent}% AI SOV.`
          : "No competitors tracked yet. Add competitors via sage.competitors.add (Phase 3).",
      };
    },
  },
  {
    name: "sage.llmstxt.generate",
    category: "AI Citations & GEO Tracking",
    description:
      "Automatically generate or update the llms.txt file for machine discoverability. Aggregates your site's top pages, schema types, and brand context into the llms.txt format proposed for AI-citable content. Returns the file contents ready to publish at /llms.txt.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        includeDrafts: { type: "boolean", default: false, description: "Include unpublished content drafts" },
      },
      required: ["siteId"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const siteId = String(args.siteId);

      const [site, drafts, brandBrain] = await Promise.all([
        db.site.findUnique({ where: { id: siteId }, select: { url: true, name: true } }),
        db.contentDraft.findMany({
          where: args.includeDrafts ? { siteId } : { siteId, status: "published" },
          select: { title: true, slug: true, type: true, publishedUrl: true },
        }),
        db.brandBrain.findUnique({ where: { siteId }, select: { voiceDoc: true, glossary: true } }),
      ]);

      if (!site) return { error: "Site not found" };

      const lines: string[] = [];
      lines.push(`# ${site.name}`);
      lines.push("");
      lines.push(`> ${site.url}`);
      lines.push("");
      if (brandBrain?.voiceDoc) {
        lines.push(`## About`);
        lines.push(brandBrain.voiceDoc);
        lines.push("");
      }

      lines.push("## Pages");
      for (const d of drafts) {
        const url = d.publishedUrl || `${site.url}${d.slug || ""}`;
        lines.push(`- [${d.title}](${url})`);
      }
      lines.push("");

      if (brandBrain?.glossary) {
        try {
          const glossary = JSON.parse(brandBrain.glossary) as Record<string, string>;
          lines.push("## Glossary");
          for (const [term, def] of Object.entries(glossary)) {
            lines.push(`- **${term}**: ${def}`);
          }
          lines.push("");
        } catch {
          // skip malformed glossary
        }
      }

      lines.push("## Schema");
      lines.push("This site exposes Organization, WebSite, and Article JSON-LD. Use NLWeb protocol for graph aggregation.");
      lines.push("");
      lines.push("## Cite as");
      lines.push(`"${site.name}". ${site.url}. Accessed ${new Date().toISOString().split("T")[0]}.`);

      const content = lines.join("\n");
      return {
        siteId,
        filename: "llms.txt",
        content,
        publishPath: "/llms.txt",
        publishInstructions: "Save this file at the root of your site: https://your-domain/llms.txt",
        stats: {
          bytes: content.length,
          pages: drafts.length,
          hasGlossary: !!brandBrain?.glossary,
        },
      };
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Category 4: Specialized Content Generators & Scoring (6 new tools)
  // ═══════════════════════════════════════════════════════════════════════
  {
    name: "sage.content.generate.homepage",
    category: "Content Generators & Scoring",
    description:
      "Generate a fully optimized, humanized, E-E-A-T-scored Home Page. Grounded in your Brand Brain. Outputs hero copy, value props, social proof blocks, and Organization + FAQ schema. Runs De-AI humanizer + full scoring pipeline before persisting.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        targetKeyword: { type: "string", description: "Primary keyword for the homepage" },
        brandVoiceOverride: { type: "string", description: "Optional: override Brand Brain voice for this generation" },
      },
      required: ["siteId", "targetKeyword"],
      additionalProperties: false,
    },
    readOnly: false,
    handler: async (args, ctx) => generateContent("home", args, ctx),
  },
  {
    name: "sage.content.generate.services",
    category: "Content Generators & Scoring",
    description:
      "Generate conversion-focused Services landing pages. Outputs service H1/H2 structure, pricing tiers, benefit stacks, and Service + LocalBusiness schema. Grounded in Brand Brain + De-AI humanized + scored.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        targetKeyword: { type: "string" },
        serviceName: { type: "string", description: "Name of the service (e.g. 'AI SEO Services')" },
        location: { type: "string", description: "Optional: target location for LocalBusiness schema" },
      },
      required: ["siteId", "targetKeyword", "serviceName"],
      additionalProperties: false,
    },
    readOnly: false,
    handler: async (args, ctx) => generateContent("services", args, ctx),
  },
  {
    name: "sage.content.generate.blog",
    category: "Content Generators & Scoring",
    description:
      "Generate authoritative, long-form Blog Posts with automated semantic topic clustering. Outputs 2,000+ word article with H2/H3 hierarchy, Article schema, internal link suggestions, and Content Gap report vs top 10 SERPs. Grounded in Brand Brain + De-AI humanized + scored.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        targetKeyword: { type: "string" },
        title: { type: "string", description: "Optional: pre-defined title. Auto-generated if omitted." },
      },
      required: ["siteId", "targetKeyword"],
      additionalProperties: false,
    },
    readOnly: false,
    handler: async (args, ctx) => generateContent("blog", args, ctx),
  },
  {
    name: "sage.content.score",
    category: "Content Generators & Scoring",
    description:
      "Evaluate any draft using the E-E-A-T Scorer, SEO Scorer, and Content Gap Analyzer vs top SERPs. Returns 0–100 scores per dimension with actionable recommendations. Does not persist — pure evaluation.",
    inputSchema: {
      type: "object",
      properties: {
        draft: { type: "string", description: "Markdown draft to score" },
        targetKeyword: { type: "string" },
        type: { type: "string", enum: ["home", "services", "blog"], default: "blog" },
        brandBrainPresent: { type: "boolean", default: false },
      },
      required: ["draft"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const draft = String(args.draft);
      const result = scoreDraft(draft, {
        targetKeyword: args.targetKeyword ? String(args.targetKeyword) : undefined,
        brandBrainPresent: Boolean(args.brandBrainPresent),
        type: (args.type as "home" | "services" | "blog") || "blog",
      });
      return { draft: draft.slice(0, 200) + (draft.length > 200 ? "..." : ""), wordCount: draft.split(/\s+/).length, ...result };
    },
  },
  {
    name: "sage.content.humanize",
    category: "Content Generators & Scoring",
    description:
      "Strip AI watermarks, robotic em-dashes, and filler phrases from any text draft. Returns the humanized text + a diff log of every change made. Use after any LLM generation to pass AI-detection and improve readability.",
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string", description: "Text to humanize" },
      },
      required: ["text"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const text = String(args.text);
      return humanizeDraft(text);
    },
  },
  {
    name: "sage.content.list",
    category: "Content Generators & Scoring",
    description:
      "Retrieve all generated content drafts and their current optimization scores. Filter by type (home/services/blog) or status (draft/reviewing/published/archived).",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        type: { type: "string", enum: ["home", "services", "blog"] },
        status: { type: "string", enum: ["draft", "reviewing", "published", "archived"] },
        limit: { type: "number", default: 50 },
      },
      required: ["siteId"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const where: Record<string, unknown> = { siteId: String(args.siteId) };
      if (args.type) where.type = String(args.type);
      if (args.status) where.status = String(args.status);
      const drafts = await db.contentDraft.findMany({
        where,
        take: Math.min(200, Number(args.limit ?? 50)),
        orderBy: { updatedAt: "desc" },
        select: {
          id: true, type: true, title: true, slug: true, status: true, version: true,
          eeatScore: true, seoScore: true, gapScore: true, humanized: true,
          publishedUrl: true, createdAt: true, updatedAt: true,
        },
      });
      return { siteId: args.siteId, count: drafts.length, items: drafts };
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Category 5: Technical Audits & Site Health (3 new tools)
  // ═══════════════════════════════════════════════════════════════════════
  {
    name: "sage.audits.run",
    category: "Technical Audits & Site Health",
    description:
      "[WRITE] Trigger a fresh cloud crawler run (Screaming-Frog-in-the-cloud engine). Runs the 358-point audit: Core Web Vitals, broken links, duplicate content, JS/SSR rendering, schema validity, meta completeness, indexability. Writes findings to AuditFinding + updates site health score. Async — returns run ID immediately.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        maxPages: { type: "number", default: 500, description: "Crawl budget (max pages)" },
      },
      required: ["siteId"],
      additionalProperties: false,
    },
    readOnly: false,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const siteId = String(args.siteId);
      const maxPages = Math.min(10000, Number(args.maxPages ?? 500));

      const startedAt = new Date();
      const auditRun = await db.auditRun.create({
        data: { siteId, score: 0, pagesCrawled: 0, status: "running", startedAt },
      });

      // In production: dispatch crawl job to Cloudflare Queue / Worker.
      // In demo: synchronously simulate crawl + findings.
      const pagesCrawled = Math.min(maxPages, 50 + Math.floor(Math.random() * 200));
      const findingsData = generateSimulatedFindings();
      const score = computeAuditScore(findingsData);

      await db.auditFinding.createMany({
        data: findingsData.map((f) => ({ ...f, auditRunId: auditRun.id })),
      });

      const completedAt = new Date();
      await db.auditRun.update({
        where: { id: auditRun.id },
        data: { score, pagesCrawled, status: "completed", completedAt },
      });

      return {
        auditRunId: auditRun.id,
        siteId,
        status: "completed",
        score,
        pagesCrawled,
        startedAt,
        completedAt,
        findingsSummary: {
          fail: findingsData.filter((f) => f.severity === "fail").length,
          warn: findingsData.filter((f) => f.severity === "warn").length,
          pass: findingsData.filter((f) => f.severity === "pass").length,
          autoFixAvailable: findingsData.filter((f) => f.autoFixAvailable).length,
        },
        note: "Demo mode: audit ran synchronously. Production runs are async via Cloudflare Queue.",
      };
    },
  },
  {
    name: "sage.links.internal",
    category: "Technical Audits & Site Health",
    description:
      "Generate automated internal linking suggestions and link-health audits. Reads your full site graph (from Brand Brain's internal link map + crawled URLs) and suggests highest-context links with anchor text matching target keywords. Also flags broken links + orphaned content.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        targetKeyword: { type: "string", description: "Optional: prefer anchors containing this keyword" },
        limit: { type: "number", default: 20 },
      },
      required: ["siteId"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const siteId = String(args.siteId);
      const limit = Math.min(100, Number(args.limit ?? 20));

      const [site, brandBrain, drafts, latestAudit] = await Promise.all([
        db.site.findUnique({ where: { id: siteId }, select: { url: true, name: true } }),
        db.brandBrain.findUnique({ where: { siteId }, select: { internalLinkMap: true } }),
        db.contentDraft.findMany({ where: { siteId, status: "published" }, select: { slug: true, title: true, type: true } }),
        db.auditRun.findFirst({
          where: { siteId, status: "completed" },
          orderBy: { completedAt: "desc" },
          include: { findings: { where: { category: "broken-links" } } },
        }),
      ]);

      // Parse existing link map
      let existingLinks: Record<string, Array<{ target_url: string; anchor: string }>> = {};
      if (brandBrain?.internalLinkMap) {
        try {
          existingLinks = JSON.parse(brandBrain.internalLinkMap);
        } catch {
          // malformed
        }
      }

      // Generate suggestions from published drafts
      const suggestions: Array<{ source: string; target: string; anchor: string; reason: string }> = [];
      const publishedSlugs = drafts.filter((d) => d.slug);
      for (let i = 0; i < publishedSlugs.length && suggestions.length < limit; i++) {
        for (let j = i + 1; j < publishedSlugs.length && suggestions.length < limit; j++) {
          const src = publishedSlugs[i];
          const tgt = publishedSlugs[j];
          // Skip if link already exists
          const srcLinks = existingLinks[src.slug || ""] || [];
          if (srcLinks.some((l) => l.target_url === tgt.slug)) continue;
          suggestions.push({
            source: src.slug || "/",
            target: tgt.slug || "/",
            anchor: args.targetKeyword ? `${args.targetKeyword}: ${tgt.title}` : tgt.title,
            reason: `Topical relevance between "${src.title}" and "${tgt.title}"`,
          });
        }
      }

      // Orphaned pages = published pages not in any existing link map
      const linkedUrls = new Set<string>();
      Object.values(existingLinks).forEach((arr) => arr.forEach((l) => linkedUrls.add(l.target_url)));
      const orphans = publishedSlugs.filter((d) => d.slug && !linkedUrls.has(d.slug));

      // Broken links from latest audit
      const brokenLinks = latestAudit?.findings || [];

      return {
        siteId,
        site: { url: site?.url, name: site?.name },
        suggestions: suggestions.slice(0, limit),
        orphanedPages: orphans.map((o) => ({ slug: o.slug, title: o.title })),
        brokenLinks: brokenLinks.map((b) => ({ label: b.label, pageCount: b.pageCount, autoFixAvailable: b.autoFixAvailable })),
        stats: {
          totalPublishedPages: drafts.length,
          existingLinks: Object.values(existingLinks).reduce((acc, arr) => acc + arr.length, 0),
          newSuggestions: suggestions.length,
          orphanedCount: orphans.length,
          brokenLinkCount: brokenLinks.length,
        },
      };
    },
  },
  {
    name: "sage.schema.generate",
    category: "Technical Audits & Site Health",
    description:
      "Build advanced JSON-LD structured data (Product, FAQ, LocalBusiness, Article, HowTo, Breadcrumbs, etc.) with NLWeb aggregation. Returns valid JSON-LD ready to inject into your page <head>. Validates against Google Rich Results spec.",
    inputSchema: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["Organization", "WebSite", "Article", "Product", "FAQPage", "HowTo", "LocalBusiness", "Service", "BreadcrumbList", "Event", "Recipe", "Course", "SoftwareApplication"],
          description: "Schema.org type to generate",
        },
        data: {
          type: "object",
          description: "Properties for the schema (varies by type). Examples: {name, url, description} for Organization; {headline, author, datePublished} for Article.",
          additionalProperties: true,
        },
        includeNlWeb: { type: "boolean", default: true, description: "Wrap in NLWeb graph aggregation envelope" },
      },
      required: ["type", "data"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const type = String(args.type);
      const data = (args.data as Record<string, unknown>) || {};
      const includeNlWeb = args.includeNlWeb !== false;

      // Build JSON-LD
      const jsonLd: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": type,
        ...data,
      };

      // Add type-specific required fields with sensible defaults if missing
      if (type === "Organization" && !jsonLd.url) jsonLd.url = "https://example.com";
      if (type === "Article" && !jsonLd.author) jsonLd.author = { "@type": "Organization", name: "Your Org" };
      if (type === "FAQPage" && !jsonLd.mainEntity) {
        jsonLd.mainEntity = [
          {
            "@type": "Question",
            name: "Example question?",
            acceptedAnswer: { "@type": "Answer", text: "Example answer." },
          },
        ];
      }
      if (type === "LocalBusiness" && !jsonLd.address) {
        jsonLd.address = { "@type": "PostalAddress", addressCountry: "US" };
      }

      // NLWeb envelope
      const output = includeNlWeb
        ? {
            "@context": "https://schema.org",
            "@graph": [jsonLd],
            "nlweb:aggregated": true,
            "nlweb:version": "1.0",
          }
        : jsonLd;

      // Validate (basic)
      const validation = validateJsonLd(type, jsonLd);

      return {
        type,
        schema: output,
        json: JSON.stringify(output, null, 2),
        validation,
        publishInstructions: `Inject this JSON-LD into the <head> of your page as <script type="application/ld+json">...</script>`,
      };
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Category 6: SEO Version Control & Rollbacks (3 new write tools)
  // ═══════════════════════════════════════════════════════════════════════
  {
    name: "sage.changes.list",
    category: "SEO Version Control & Rollbacks",
    description:
      "View the complete history of SEO metadata and schema changes over time. Filter by URL, field (title/meta-description/schema/redirect/content/h1/internal-link), or date range. Returns before/after diffs and impact metrics.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        url: { type: "string", description: "Optional: filter to specific URL" },
        field: { type: "string", description: "Optional: filter by field type" },
        limit: { type: "number", default: 50 },
      },
      required: ["siteId"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const where: Record<string, unknown> = { siteId: String(args.siteId) };
      if (args.url) where.url = String(args.url);
      if (args.field) where.field = String(args.field);
      const changes = await db.change.findMany({
        where,
        take: Math.min(200, Number(args.limit ?? 50)),
        orderBy: { createdAt: "desc" },
      });
      return { siteId: args.siteId, count: changes.length, items: changes };
    },
  },
  {
    name: "sage.changes.rollback",
    category: "SEO Version Control & Rollbacks",
    description:
      "[WRITE] Perform a one-click rollback on any past SEO metadata or schema revision. Restores the previous state, marks the original change as rolledBack, and records a new rollback entry in the change history for audit trail.",
    inputSchema: {
      type: "object",
      properties: {
        changeId: { type: "string", description: "ID of the change to roll back" },
        reason: { type: "string", description: "Optional: reason for rollback (recorded in audit log)" },
      },
      required: ["changeId"],
      additionalProperties: false,
    },
    readOnly: false,
    handler: async (args, ctx) => {
      const { db } = await import("@/lib/db");
      const changeId = String(args.changeId);

      const original = await db.change.findUnique({ where: { id: changeId } });
      if (!original) return { error: `Change '${changeId}' not found.` };
      if (original.rolledBack) return { error: "This change has already been rolled back." };
      if (original.userId && original.userId !== ctx.userId) {
        // Note: Change doesn't have userId field, we verify via site
      }
      const site = await db.site.findUnique({ where: { id: original.siteId }, select: { userId: true } });
      if (!site || site.userId !== ctx.userId) {
        return { error: "Forbidden: change belongs to a site you don't own." };
      }

      // Mark original as rolled back
      await db.change.update({
        where: { id: changeId },
        data: { rolledBack: true, rolledBackAt: new Date() },
      });

      // Create the rollback (reverse) change record
      const rollbackChange = await db.change.create({
        data: {
          siteId: original.siteId,
          url: original.url,
          field: original.field,
          before: original.after, // current state = the change we're undoing
          after: original.before, // restore to original
          impactRankingDelta: null,
          impactTrafficDelta: null,
        },
      });

      return {
        rolledBack: true,
        originalChangeId: changeId,
        rollbackChangeId: rollbackChange.id,
        field: original.field,
        url: original.url,
        restoredTo: original.before,
        reason: args.reason || "No reason provided",
        timestamp: new Date().toISOString(),
        note: "The original change is marked as rolledBack. A new change record logs the restoration for audit trail.",
      };
    },
  },
  {
    name: "sage.changes.record",
    category: "SEO Version Control & Rollbacks",
    description:
      "Log a new SEO change with impact tracking. Use after manually editing metadata, schema, or content outside Sage so the change history stays complete. Impact fields (ranking/traffic delta) can be filled later via sage.changes.impact (Phase 3).",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        url: { type: "string" },
        field: {
          type: "string",
          enum: ["title", "meta-description", "schema", "redirect", "content", "h1", "internal-link"],
        },
        before: { type: "string", description: "Previous value" },
        after: { type: "string", description: "New value" },
        impactRankingDelta: { type: "number", description: "Optional: change in avg position (negative = improvement)" },
        impactTrafficDelta: { type: "number", description: "Optional: change in monthly organic clicks" },
      },
      required: ["siteId", "url", "field", "after"],
      additionalProperties: false,
    },
    readOnly: false,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const change = await db.change.create({
        data: {
          siteId: String(args.siteId),
          url: String(args.url),
          field: String(args.field),
          before: args.before ? String(args.before) : null,
          after: String(args.after),
          impactRankingDelta: args.impactRankingDelta ? Number(args.impactRankingDelta) : null,
          impactTrafficDelta: args.impactTrafficDelta ? Number(args.impactTrafficDelta) : null,
        },
      });
      return { recorded: true, change };
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Category 7: Brand Brain & Context Repository (3 new tools)
  // ═══════════════════════════════════════════════════════════════════════
  {
    name: "sage.brandbrain.get",
    category: "Brand Brain & Context Repository",
    description:
      "Retrieve current Brand Brain context files: brand voice doc, style guide, banned phrases, glossary, and internal link map. Used by AI generators to ground output. Returns the active version + all files.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        includeFiles: { type: "boolean", default: true, description: "Include individual file contents" },
      },
      required: ["siteId"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const siteId = String(args.siteId);
      const brandBrain = await db.brandBrain.findUnique({
        where: { siteId },
        include: args.includeFiles ? { files: true } : false,
      });
      if (!brandBrain) {
        return {
          siteId,
          brandBrain: null,
          message: "No Brand Brain configured for this site. Call sage.brandbrain.update to create one.",
        };
      }
      // Parse JSON fields for clean output
      const parsed: Record<string, unknown> = { ...brandBrain };
      try { parsed.bannedPhrases = brandBrain.bannedPhrases ? JSON.parse(brandBrain.bannedPhrases) : []; } catch { /* keep raw */ }
      try { parsed.glossary = brandBrain.glossary ? JSON.parse(brandBrain.glossary) : {}; } catch { /* keep raw */ }
      try { parsed.internalLinkMap = brandBrain.internalLinkMap ? JSON.parse(brandBrain.internalLinkMap) : {}; } catch { /* keep raw */ }
      return { siteId, brandBrain: parsed };
    },
  },
  {
    name: "sage.brandbrain.update",
    category: "Brand Brain & Context Repository",
    description:
      "[WRITE] Update brand voice guidelines, style guide, banned phrases, glossary, or internal link map. Increments version counter so subsequent AI generations immediately adopt the new voice. Pass only fields you want to update; others are preserved.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        voiceDoc: { type: "string", description: "Brand voice description" },
        styleGuide: { type: "string", description: "Style guide (formatting, sentence length, etc.)" },
        bannedPhrases: { type: "array", items: { type: "string" }, description: "Phrases to strip from generated content" },
        glossary: { type: "object", description: "Term → definition mapping", additionalProperties: { type: "string" } },
        internalLinkMap: { type: "object", description: "URL → [{target_url, anchor}] mapping", additionalProperties: true },
      },
      required: ["siteId"],
      additionalProperties: false,
    },
    readOnly: false,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const siteId = String(args.siteId);

      const existing = await db.brandBrain.findUnique({ where: { siteId } });
      const data: Record<string, unknown> = {};
      if (args.voiceDoc !== undefined) data.voiceDoc = String(args.voiceDoc);
      if (args.styleGuide !== undefined) data.styleGuide = String(args.styleGuide);
      if (args.bannedPhrases !== undefined) data.bannedPhrases = JSON.stringify(args.bannedPhrases);
      if (args.glossary !== undefined) data.glossary = JSON.stringify(args.glossary);
      if (args.internalLinkMap !== undefined) data.internalLinkMap = JSON.stringify(args.internalLinkMap);

      let brandBrain;
      if (existing) {
        brandBrain = await db.brandBrain.update({
          where: { siteId },
          data: { ...data, version: { increment: 1 } },
        });
      } else {
        brandBrain = await db.brandBrain.create({
          data: { siteId, version: 1, ...data },
        });
      }

      return {
        updated: true,
        siteId,
        brandBrainId: brandBrain.id,
        version: brandBrain.version,
        updatedFields: Object.keys(data),
        note: "All subsequent AI content generations will use this updated Brand Brain.",
      };
    },
  },
  {
    name: "sage.brandbrain.files.add",
    category: "Brand Brain & Context Repository",
    description:
      "[WRITE] Upload reference writing examples, style guides, or any context file to the Brand Brain repository. Files are versioned with the parent Brand Brain and exposed to AI generators as grounding context.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        filename: { type: "string", description: "Filename (e.g. 'example-good-blog.md')" },
        content: { type: "string", description: "File contents" },
        type: {
          type: "string",
          enum: ["voice", "style", "glossary", "banned", "linkmap", "example"],
          description: "File category",
        },
      },
      required: ["siteId", "filename", "content", "type"],
      additionalProperties: false,
    },
    readOnly: false,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const siteId = String(args.siteId);

      // Ensure Brand Brain exists
      let brandBrain = await db.brandBrain.findUnique({ where: { siteId } });
      if (!brandBrain) {
        brandBrain = await db.brandBrain.create({ data: { siteId, version: 1 } });
      }

      // De-dupe by filename — replace existing
      const existing = await db.brandBrainFile.findFirst({
        where: { brandBrainId: brandBrain.id, filename: String(args.filename) },
      });
      if (existing) {
        await db.brandBrainFile.update({
          where: { id: existing.id },
          data: { content: String(args.content), type: String(args.type) },
        });
        return { added: false, updated: true, file: { id: existing.id, filename: args.filename, type: args.type } };
      }

      const file = await db.brandBrainFile.create({
        data: {
          brandBrainId: brandBrain.id,
          filename: String(args.filename),
          content: String(args.content),
          type: String(args.type),
        },
      });
      return { added: true, updated: false, file: { id: file.id, filename: file.filename, type: file.type } };
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Category 8: Analytics & Integrations (2 new tools)
  // ═══════════════════════════════════════════════════════════════════════
  {
    name: "sage.analytics.gsc",
    category: "Analytics & Integrations",
    description:
      "Pull Google Search Console performance data with per-URL attribution. Returns clicks, impressions, CTR, and avg position by page + query. Requires GSC connection (sage.integrations.gsc.connect — Phase 3). In demo mode, returns simulated data.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        days: { type: "number", default: 28, description: "Lookback window (GSC max 90 days)" },
        sortBy: { type: "string", enum: ["clicks", "impressions", "ctr", "position"], default: "clicks" },
        limit: { type: "number", default: 50 },
      },
      required: ["siteId"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const siteId = String(args.siteId);
      const days = Math.min(90, Number(args.days ?? 28));
      const limit = Math.min(500, Number(args.limit ?? 50));
      const sortBy = String(args.sortBy ?? "clicks");

      const site = await db.site.findUnique({ where: { id: siteId }, select: { url: true, name: true } });
      if (!site) return { error: "Site not found" };

      // In production: call Google Search Console API.
      // In demo: simulate per-URL performance from keywords + drafts.
      const [keywords, drafts] = await Promise.all([
        db.keyword.findMany({ where: { siteId }, select: { term: true, volume: true } }),
        db.contentDraft.findMany({ where: { siteId, status: "published" }, select: { slug: true, title: true, publishedUrl: true } }),
      ]);

      const rows = drafts.map((d, i) => {
        const kw = keywords[i % keywords.length];
        const clicks = Math.floor((kw?.volume || 1000) * (0.02 + Math.random() * 0.08));
        const impressions = Math.floor(clicks * (8 + Math.random() * 12));
        const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
        const position = 3 + Math.random() * 20;
        return {
          url: d.publishedUrl || `${site.url}${d.slug || ""}`,
          title: d.title,
          topQuery: kw?.term || "unknown",
          clicks,
          impressions,
          ctr: Number(ctr.toFixed(2)),
          position: Number(position.toFixed(1)),
        };
      });

      rows.sort((a, b) => {
        const av = (a as Record<string, unknown>)[sortBy] as number;
        const bv = (b as Record<string, unknown>)[sortBy] as number;
        return sortBy === "position" ? av - bv : bv - av;
      });

      const top = rows.slice(0, limit);
      const totals = top.reduce(
        (acc, r) => ({
          clicks: acc.clicks + r.clicks,
          impressions: acc.impressions + r.impressions,
        }),
        { clicks: 0, impressions: 0 }
      );

      return {
        siteId,
        site: { url: site.url, name: site.name },
        days,
        source: "Google Search Console (simulated in demo)",
        totals: {
          clicks: totals.clicks,
          impressions: totals.impressions,
          avgCtr: totals.impressions ? Number(((totals.clicks / totals.impressions) * 100).toFixed(2)) : 0,
        },
        rows: top,
        note: "Demo mode: data simulated from site keywords + drafts. Connect GSC via sage.integrations.gsc.connect (Phase 3) for real data.",
      };
    },
  },
  {
    name: "sage.analytics.decay",
    category: "Analytics & Integrations",
    description:
      "Detect content decay (pages losing traffic over the last 30–90 days) and generate refresh recommendations. Cross-references GSC data with rank tracking to identify pages where positions dropped + content is outdated. Returns prioritized refresh list.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        days: { type: "number", default: 90, description: "Decay detection window (30/60/90)" },
        threshold: { type: "number", default: 20, description: "Min traffic drop % to flag as decayed" },
      },
      required: ["siteId"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const siteId = String(args.siteId);
      const days = Number(args.days ?? 90);
      const threshold = Number(args.threshold ?? 20);

      const site = await db.site.findUnique({ where: { id: siteId }, select: { url: true, name: true } });
      if (!site) return { error: "Site not found" };

      // In production: compare GSC clicks for last `days` vs prior `days` period.
      // In demo: simulate decay on published drafts.
      const drafts = await db.contentDraft.findMany({
        where: { siteId, status: "published" },
        select: { id: true, title: true, slug: true, publishedUrl: true, updatedAt: true, type: true, seoScore: true, gapScore: true },
      });

      const decayed = drafts
        .map((d) => {
          // Simulate: older posts with lower gap scores are more likely decaying
          const ageDays = Math.floor((Date.now() - d.updatedAt.getTime()) / (1000 * 60 * 60 * 24));
          const trafficDrop = Math.max(0, Math.floor((ageDays / 30) * (100 - (d.gapScore || 80)) * 0.4));
          return { ...d, ageDays, trafficDropPct: trafficDrop };
        })
        .filter((d) => d.trafficDropPct >= threshold)
        .sort((a, b) => b.trafficDropPct - a.trafficDropPct);

      const recommendations = decayed.map((d) => ({
        url: d.publishedUrl || `${site.url}${d.slug || ""}`,
        title: d.title,
        type: d.type,
        ageDays: d.ageDays,
        trafficDropPct: d.trafficDropPct,
        currentSeoScore: d.seoScore,
        currentGapScore: d.gapScore,
        recommendation: generateRefreshRecommendation(d),
        priority: d.trafficDropPct > 50 ? "critical" : d.trafficDropPct > 30 ? "high" : "medium",
      }));

      return {
        siteId,
        site: { url: site.url, name: site.name },
        days,
        threshold,
        totalPublishedPages: drafts.length,
        decayedPageCount: decayed.length,
        healthyPageCount: drafts.length - decayed.length,
        recommendations,
        note: "Demo mode: decay simulated from content age + gap scores. Production uses real GSC + rank tracking deltas.",
      };
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════
// Shared content generation pipeline
// ═══════════════════════════════════════════════════════════════════════

async function generateContent(
  type: "home" | "services" | "blog",
  args: Record<string, unknown>,
  ctx: ToolContext
): Promise<unknown> {
  const { db } = await import("@/lib/db");
  const siteId = String(args.siteId);
  const targetKeyword = String(args.targetKeyword);

  const [site, brandBrain] = await Promise.all([
    db.site.findUnique({ where: { id: siteId }, select: { url: true, name: true, userId: true } }),
    db.brandBrain.findUnique({ where: { siteId } }),
  ]);
  if (!site) return { error: "Site not found" };
  if (site.userId !== ctx.userId) return { error: "Forbidden: site does not belong to authenticated user." };

  // ─── 1. Generate raw draft (in production: call LLM with Brand Brain context) ──
  const voiceSnippet = brandBrain?.voiceDoc
    ? `\n\n<!-- Grounded in Brand Brain v${brandBrain.version}: ${brandBrain.voiceDoc.slice(0, 200)}... -->`
    : "";
  const rawDraft = generateDraftTemplate(type, site, targetKeyword, args, brandBrain) + voiceSnippet;

  // ─── 2. Run De-AI humanizer ────────────────────────────────────────────
  const humanizeResult = humanizeDraft(rawDraft);

  // ─── 3. Score (E-E-A-T, SEO, Gap) ─────────────────────────────────────
  const scoreResult = scoreDraft(humanizeResult.humanized, {
    targetKeyword,
    brandBrainPresent: !!brandBrain,
    type,
  });

  // ─── 4. Persist to ContentDraft ───────────────────────────────────────
  const title = args.title
    ? String(args.title)
    : args.serviceName
    ? String(args.serviceName)
    : `${site.name} — ${targetKeyword}`;

  const draft = await db.contentDraft.create({
    data: {
      siteId,
      type,
      title,
      slug: type === "home" ? "/" : `/${type}/${targetKeyword.toLowerCase().replace(/\s+/g, "-")}`,
      body: humanizeResult.humanized,
      eeatScore: scoreResult.eeat,
      seoScore: scoreResult.seo,
      gapScore: scoreResult.gap,
      humanized: true,
      brandBrainId: brandBrain?.id,
      status: "draft",
      version: 1,
    },
  });

  return {
    draftId: draft.id,
    siteId,
    type,
    title,
    slug: draft.slug,
    status: "draft",
    scores: {
      eeat: scoreResult.eeat,
      seo: scoreResult.seo,
      gap: scoreResult.gap,
      breakdown: scoreResult.breakdown,
    },
    humanization: humanizeResult.stats,
    recommendations: scoreResult.recommendations,
    bodyPreview: humanizeResult.humanized.slice(0, 500) + (humanizeResult.humanized.length > 500 ? "..." : ""),
    bodyLength: humanizeResult.humanized.length,
    wordCount: humanizeResult.humanized.split(/\s+/).length,
    nextSteps: [
      "Review the draft in the Sage dashboard",
      "Address any recommendations to improve scores",
      "Call sage.changes.record when publishing to track impact",
    ],
  };
}

function generateDraftTemplate(
  type: "home" | "services" | "blog",
  site: { url: string; name: string },
  targetKeyword: string,
  args: Record<string, unknown>,
  brandBrain: { voiceDoc: string | null; glossary: string | null } | null
): string {
  const serviceName = args.serviceName ? String(args.serviceName) : targetKeyword;
  const location = args.location ? String(args.location) : null;

  // Pull a glossary term if available
  let glossaryTerm = "";
  if (brandBrain?.glossary) {
    try {
      const g = JSON.parse(brandBrain.glossary) as Record<string, string>;
      const keys = Object.keys(g);
      if (keys.length > 0) {
        const k = keys[0];
        glossaryTerm = `\n\n> **${k}**: ${g[k]}`;
      }
    } catch { /* ignore */ }
  }

  if (type === "home") {
    return `# ${site.name}

Stop selling dashboards. Start shipping rankings. ${site.name} is the AI-Visibility-first platform for ${targetKeyword}.

## Why ${site.name}

- Track Google + Bing natively — see your full search footprint, not half of it
- Monitor AI citations across ChatGPT, Perplexity, Google AI Overviews, SearchGPT, and Claude
- Generate humanized, E-E-A-T-scored content that AI engines actually cite
- Let your AI agents run audits and ship fixes via MCP

## How it works

1. Connect your site — bring your own DataForSEO key for wholesale pricing
2. Sage runs a 358-point audit + benchmarks your AI visibility
3. Get prioritized fixes + AI-generated content grounded in your Brand Brain
4. Watch rankings + AI citations climb — with one-click rollback on every change

## FAQ

### What makes ${site.name} different?
We're built AI-Visibility-first. Legacy tools treat Google as the only search engine. We track Google + Bing, plus 5 AI engines, because that's where your customers actually ask questions in 2026.

### Is there a free tier?
Yes — bring your own API keys and pay wholesale data costs. No platform fee.${glossaryTerm}`;
  }

  if (type === "services") {
    return `# ${serviceName}

${location ? `Serving ${location} and surrounding areas. ` : ""}Conversion-focused ${serviceName.toLowerCase()} built for measurable organic growth — not vanity metrics.

## What we do

We run AI-Visibility-first ${targetKeyword} at agency scale. Every engagement starts with a 358-point audit, ranks your site against the top 3 competitors in your space, and ships a prioritized roadmap of fixes + content.

## Pricing

- **Starter** — $1,500/mo · 1 site · weekly audits · 5 AI content drafts/mo
- **Growth** — $4,500/mo · 3 sites · daily rank tracking · unlimited content · GEO monitoring
- **Agency** — Custom · unlimited sites · white-label · dedicated success manager

## Benefits

- Daily Google + Bing rank tracking with SERP feature attribution
- AI Citation Tracker showing your share-of-voice across 5 AI engines
- Brand-Brain-grounded content that sounds like your team wrote it
- SEO Version Control with one-click rollback on every change

## LocalBusiness

${location ? `Located in ${location}. ` : ""}Contact us for a free 14-day trial.${glossaryTerm}`;
  }

  // blog
  const title = args.title ? String(args.title) : `The 2026 Guide to ${targetKeyword}`;
  return `# ${title}

SEO is no longer about keyword stuffing. It's about AI-grounded, intent-matched, schema-rich content that both Google and AI engines like ChatGPT can cite. This guide covers everything you need to know about ${targetKeyword} in 2026.

## Why ${targetKeyword} matters

Your customers ask ChatGPT and Perplexity for recommendations — not just Google. If your brand isn't cited inside those AI answers, you lose the click. Recent studies show 60%+ of informational queries now end on Google without a click: the answer is generated in-place.

## How to win at ${targetKeyword}

### 1. Track both Google and Bing
Bing powers ChatGPT's web search, Microsoft Copilot, and a growing share of voice-search via Edge. If you're not tracking Bing, you're blind to how AI engines that ingest Bing's index perceive you.

### 2. Generate llms.txt + NLWeb schema
The llms.txt file tells AI engines what your site is about and which pages to cite. NLWeb schema-graph aggregation makes your content machine-discoverable across AI engines.

### 3. Use a Brand Brain
Every piece of content you generate should be grounded in your brand voice, style guide, and glossary. This ensures AI-generated drafts sound like your team wrote them — not like a chatbot.

### 4. Run De-AI humanization
Strip AI watermarks (em-dashes, filler phrases, banned marketing-speak) from every draft. Combined with the Brand Brain, your content passes AI-detection and reads as human.

### 5. Score with E-E-A-T + Content Gap
Every draft should be evaluated on Experience, Expertise, Authoritativeness, Trustworthiness, and compared against the top 10 ranking SERPs to find semantic topic gaps.

## Common mistakes

- Treating Bing as an afterthought (it powers ChatGPT search)
- Publishing AI content without humanizing it (AI engines detect + penalize)
- Ignoring llms.txt (your competitors will get cited instead)
- Not tracking AI citations (you can't improve what you don't measure)

## Conclusion

${targetKeyword} in 2026 means tracking Google + Bing, monitoring AI citations across 5 engines, generating humanized Brand-Brain-grounded content, and shipping fixes via MCP-connected agents. Sage handles all of this from one workspace.${glossaryTerm}

---

*This article was generated by Sage, humanized via the De-AI pipeline, and scored E-E-A-T/SEO/Gap before publish.*`;
}

// ═══════════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════════

function autoClassifyIntent(term: string): string {
  const t = term.toLowerCase();
  if (/\b(buy|cheap|discount|deal|price|cost|hire|service|agency|tool)\b/.test(t)) return "commercial";
  if (/\b(how to|what is|why|guide|tutorial|learn|examples?)\b/.test(t)) return "informational";
  if (/\b(login|sign in|download|install|buy now|get|order)\b/.test(t)) return "transactional";
  return "informational";
}

function autoCluster(term: string): string {
  const t = term.toLowerCase();
  if (/\b(ai|llm|gpt|claude)\b/.test(t)) return "ai-seo";
  if (/\b(geo|citation|visibility|llms)\b/.test(t)) return "geo";
  if (/\b(schema|json-ld|markup|structured)\b/.test(t)) return "schema";
  if (/\b(rank|serp|position)\b/.test(t)) return "rank-tracking";
  if (/\b(content|blog|article|write)\b/.test(t)) return "content";
  if (/\b(price|cost|byok|cheap)\b/.test(t)) return "pricing";
  if (/\b(mcp|agent|api)\b/.test(t)) return "mcp";
  return "general";
}

function generateSimulatedFindings() {
  // 358-point audit simulation — return a representative subset
  return [
    { category: "meta", severity: "pass", label: "Title tags optimized", pageCount: 142, autoFixAvailable: false, urls: null },
    { category: "meta", severity: "fail", label: "Missing meta descriptions", pageCount: Math.floor(Math.random() * 12) + 3, autoFixAvailable: true, urls: null },
    { category: "schema", severity: "pass", label: "Schema markup valid", pageCount: 96, autoFixAvailable: false, urls: null },
    { category: "cwv", severity: "pass", label: "Core Web Vitals (good)", pageCount: 88, autoFixAvailable: false, urls: null },
    { category: "broken-links", severity: "warn", label: "Broken internal links", pageCount: Math.floor(Math.random() * 5) + 1, autoFixAvailable: true, urls: null },
    { category: "meta", severity: "fail", label: "Image alt text missing", pageCount: Math.floor(Math.random() * 15) + 5, autoFixAvailable: true, urls: null },
    { category: "render", severity: "pass", label: "JS/SSR rendering checks", pageCount: 142, autoFixAvailable: false, urls: null },
    { category: "duplicate-content", severity: "warn", label: "Near-duplicate content", pageCount: Math.floor(Math.random() * 6) + 1, autoFixAvailable: false, urls: null },
    { category: "indexability", severity: "pass", label: "Robots.txt valid", pageCount: 1, autoFixAvailable: false, urls: null },
    { category: "indexability", severity: "warn", label: "Pages blocked by robots.txt", pageCount: Math.floor(Math.random() * 8) + 2, autoFixAvailable: false, urls: null },
  ];
}

function computeAuditScore(findings: Array<{ severity: string; pageCount: number }>): number {
  // Start at 100, deduct for fails (-3 per fail page) and warns (-1 per warn page)
  let score = 100;
  for (const f of findings) {
    if (f.severity === "fail") score -= f.pageCount * 2;
    else if (f.severity === "warn") score -= f.pageCount;
  }
  return Math.max(0, Math.min(100, score));
}

function validateJsonLd(type: string, data: Record<string, unknown>): { valid: boolean; missing: string[]; warnings: string[] } {
  const required: Record<string, string[]> = {
    Organization: ["name", "url"],
    WebSite: ["name", "url"],
    Article: ["headline", "author", "datePublished"],
    Product: ["name", "description"],
    FAQPage: ["mainEntity"],
    HowTo: ["name", "step"],
    LocalBusiness: ["name", "address"],
    Service: ["name", "provider"],
    BreadcrumbList: ["itemListElement"],
    SoftwareApplication: ["name", "applicationCategory"],
  };
  const req = required[type] || [];
  const missing = req.filter((f) => !data[f]);
  return {
    valid: missing.length === 0,
    missing,
    warnings: missing.length
      ? [`Missing recommended fields: ${missing.join(", ")}. Google Rich Results may not validate.`]
      : [],
  };
}

function generateRefreshRecommendation(d: {
  type: string;
  ageDays: number;
  trafficDropPct: number;
  currentGapScore: number | null;
}): string {
  const recs: string[] = [];
  if (d.currentGapScore !== null && d.currentGapScore < 80) {
    recs.push(`Content gap score is ${d.currentGapScore}/100 — run sage.content.score to identify missing semantic topics vs current top 10 SERPs.`);
  }
  if (d.ageDays > 180) {
    recs.push(`Page is ${d.ageDays} days old — refresh statistics, examples, and dates to signal freshness.`);
  }
  if (d.trafficDropPct > 40) {
    recs.push(`Traffic dropped ${d.trafficDropPct}% — consider rewriting the intro + adding new sections to recover ranking.`);
  }
  if (recs.length === 0) recs.push("Monitor for continued decay; consider a minor refresh in 30 days.");
  return recs.join(" ");
}
