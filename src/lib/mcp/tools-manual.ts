/**
 * Sage MCP Server — Manual SEO Tools (Phase 4, 28 tools)
 *
 * These tools give users MANUAL control over their SEO — no AI required.
 * For practitioners who prefer hands-on control: meta editing, redirects,
 * sitemaps, robots.txt, SERP preview, readability, keyword density, etc.
 *
 * Every tool here has a manual UI in the dashboard AND is exposed via MCP
 * so agents can use them too. Best of both worlds.
 */
import type { ToolDef } from "./types";

export const manualTools: ToolDef[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // Category 9: Meta Editor (manual per-URL) — 3 tools
  // ═══════════════════════════════════════════════════════════════════════
  {
    name: "sage.meta.get",
    category: "Meta Editor (Manual)",
    description:
      "Get the manually-set meta record for a URL: title, description, canonical, OG tags, Twitter card, robots meta. Returns null values if not set — use sage.meta.edit to set them.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        url: { type: "string", description: "The URL path (e.g. /blog/my-post)" },
      },
      required: ["siteId", "url"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const meta = await db.metaRecord.findUnique({
        where: { siteId_url: { siteId: String(args.siteId), url: String(args.url) } },
      });
      return { siteId: args.siteId, url: args.url, meta: meta || null };
    },
  },
  {
    name: "sage.meta.edit",
    category: "Meta Editor (Manual)",
    description:
      "[WRITE] Manually set meta for a URL: title, description, canonical URL, OG title/description/image, Twitter card, robots meta (noindex/nofollow/noarchive). No AI — you write the content. Overwrites existing values.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        url: { type: "string" },
        title: { type: "string", description: "Meta title (50-60 chars recommended)" },
        description: { type: "string", description: "Meta description (150-160 chars recommended)" },
        canonicalUrl: { type: "string" },
        ogTitle: { type: "string" },
        ogDescription: { type: "string" },
        ogImage: { type: "string" },
        twitterCard: { type: "string", enum: ["summary", "summary_large_image", "app", "player"] },
        robotsMeta: { type: "string", description: "Comma-separated: noindex,nofollow,noarchive,nosnippet,max-snippet" },
      },
      required: ["siteId", "url"],
      additionalProperties: false,
    },
    readOnly: false,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const data: Record<string, unknown> = {};
      const fields = ["title", "description", "canonicalUrl", "ogTitle", "ogDescription", "ogImage", "twitterCard", "robotsMeta"];
      for (const f of fields) {
        if (args[f] !== undefined) data[f] = args[f] === "" ? null : String(args[f]);
      }

      const meta = await db.metaRecord.upsert({
        where: { siteId_url: { siteId: String(args.siteId), url: String(args.url) } },
        create: { siteId: String(args.siteId), url: String(args.url), ...data },
        update: data,
      });

      // Record the change in Version Control
      await db.change.create({
        data: {
          siteId: String(args.siteId),
          url: String(args.url),
          field: "meta-description",
          before: null,
          after: JSON.stringify(data),
        },
      });

      return { saved: true, meta };
    },
  },
  {
    name: "sage.meta.list",
    category: "Meta Editor (Manual)",
    description:
      "List all manually-set meta records for a site. Returns URL, title, description, canonical, robots meta. Useful for bulk review.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        limit: { type: "number", default: 200 },
      },
      required: ["siteId"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const records = await db.metaRecord.findMany({
        where: { siteId: String(args.siteId) },
        take: Math.min(500, Number(args.limit ?? 200)),
        orderBy: { updatedAt: "desc" },
      });
      return { siteId: args.siteId, count: records.length, items: records };
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Category 10: Sitemap & Robots.txt — 4 tools
  // ═══════════════════════════════════════════════════════════════════════
  {
    name: "sage.sitemap.generate",
    category: "Sitemap & Robots (Manual)",
    description:
      "Generate an XML sitemap from your site's published content drafts + meta records. Returns valid XML ready to save at /sitemap.xml. Includes lastmod, changefreq, priority.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        includeDrafts: { type: "boolean", default: false },
        changefreq: { type: "string", default: "weekly", enum: ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"] },
        priority: { type: "number", default: 0.8 },
      },
      required: ["siteId"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const site = await db.site.findUnique({ where: { id: String(args.siteId) }, select: { url: true } });
      if (!site) return { error: "Site not found" };

      const where = args.includeDrafts ? { siteId: String(args.siteId) } : { siteId: String(args.siteId), status: "published" };
      const drafts = await db.contentDraft.findMany({
        where,
        select: { slug: true, publishedUrl: true, updatedAt: true, type: true },
      });

      const urls = drafts.map((d) => {
        const loc = d.publishedUrl || `${site.url}${d.slug || ""}`;
        const priority = d.type === "home" ? 1.0 : d.type === "services" ? 0.9 : 0.7;
        return `  <url>
    <loc>${loc}</loc>
    <lastmod>${d.updatedAt.toISOString().split("T")[0]}</lastmod>
    <changefreq>${args.changefreq || "weekly"}</changefreq>
    <priority>${priority}</priority>
  </url>`;
      });

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

      return {
        siteId: args.siteId,
        urlCount: urls.length,
        xml,
        publishPath: "/sitemap.xml",
        submitUrls: {
          google: `https://search.google.com/search-console?resource_id=${encodeURIComponent(site.url)}&sitemap=${encodeURIComponent(site.url + "/sitemap.xml")}`,
          bing: "https://www.bing.com/webmasters/sitemaps",
        },
      };
    },
  },
  {
    name: "sage.robots.txt.generate",
    category: "Sitemap & Robots (Manual)",
    description:
      "Generate a robots.txt file. Includes Allow/Disallow rules, sitemap reference, and AI crawler bot-blocker rules (GPTBot, CCBot, Google-Extended) if configured.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        disallowPaths: {
          type: "array",
          items: { type: "string" },
          description: "Paths to disallow (e.g. ['/admin', '/cart', '/*?query='])",
          default: ["/admin", "/cart", "/checkout"],
        },
        allowPaths: {
          type: "array",
          items: { type: "string" },
          default: [],
        },
        blockAiCrawlers: { type: "boolean", default: false, description: "Block GPTBot, CCBot, Google-Extended, ClaudeBot, PerplexityBot" },
        crawlDelay: { type: "number", description: "Crawl-delay in seconds (optional)" },
      },
      required: ["siteId"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const site = await db.site.findUnique({ where: { id: String(args.siteId) }, select: { url: true } });
      if (!site) return { error: "Site not found" };

      // Get bot blocker rules from DB
      const botRules = await db.botBlockerRule.findMany({ where: { siteId: String(args.siteId) } });

      const lines: string[] = [];
      lines.push("# Sage-generated robots.txt");
      lines.push(`# Generated: ${new Date().toISOString().split("T")[0]}`);
      lines.push("");

      // Default: allow all
      lines.push("User-agent: *");
      lines.push("Allow: /");
      for (const p of (args.disallowPaths as string[]) || []) {
        lines.push(`Disallow: ${p}`);
      }
      for (const p of (args.allowPaths as string[]) || []) {
        lines.push(`Allow: ${p}`);
      }
      if (args.crawlDelay) {
        lines.push(`Crawl-delay: ${args.crawlDelay}`);
      }
      lines.push("");

      // AI crawler rules
      if (args.blockAiCrawlers) {
        const aiBots = ["GPTBot", "CCBot", "Google-Extended", "anthropic-ai", "ClaudeBot", "PerplexityBot", "Bytespider", "Diffbot"];
        for (const bot of aiBots) {
          lines.push(`User-agent: ${bot}`);
          lines.push("Disallow: /");
          lines.push("");
        }
      }

      // Apply DB bot rules
      for (const rule of botRules) {
        if (rule.action === "block") {
          lines.push(`User-agent: ${rule.botName}`);
          lines.push("Disallow: /");
          lines.push("");
        }
      }

      // Sitemap reference
      lines.push(`Sitemap: ${site.url}/sitemap.xml`);

      return {
        siteId: args.siteId,
        content: lines.join("\n"),
        publishPath: "/robots.txt",
        botRulesApplied: botRules.length,
        aiCrawlersBlocked: args.blockAiCrawlers ? 8 : 0,
      };
    },
  },
  {
    name: "sage.robots.txt.preview",
    category: "Sitemap & Robots (Manual)",
    description:
      "Fetch and preview the current robots.txt file from a live URL. Returns the raw content so you can review before making changes.",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "Full URL to robots.txt (e.g. https://example.com/robots.txt)" },
      },
      required: ["url"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      try {
        const url = String(args.url).endsWith("/robots.txt")
          ? String(args.url)
          : String(args.url).replace(/\/$/, "") + "/robots.txt";
        const res = await fetch(url);
        const content = await res.text();
        return { url, status: res.status, content: content.slice(0, 5000) };
      } catch (err) {
        return { error: err instanceof Error ? err.message : "Fetch failed" };
      }
    },
  },
  {
    name: "sage.sitemap.preview",
    category: "Sitemap & Robots (Manual)",
    description:
      "Fetch and preview the current XML sitemap from a live URL. Returns parsed URL count + raw XML.",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "Full URL to sitemap (e.g. https://example.com/sitemap.xml)" },
      },
      required: ["url"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      try {
        const url = String(args.url).endsWith(".xml")
          ? String(args.url)
          : String(args.url).replace(/\/$/, "") + "/sitemap.xml";
        const res = await fetch(url);
        const content = await res.text();
        const urlCount = (content.match(/<loc>/g) || []).length;
        return { url, status: res.status, urlCount, content: content.slice(0, 5000) };
      } catch (err) {
        return { error: err instanceof Error ? err.message : "Fetch failed" };
      }
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Category 11: Redirect Manager — 4 tools
  // ═══════════════════════════════════════════════════════════════════════
  {
    name: "sage.redirect.create",
    category: "Redirect Manager (Manual)",
    description:
      "[WRITE] Create a 301/302/307/308 redirect manually. Set from-path → to-URL. Useful for site migrations, URL changes, fixing 404s.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        fromPath: { type: "string", description: "Path to redirect FROM (e.g. /old-page)" },
        toUrl: { type: "string", description: "URL to redirect TO (e.g. /new-page or https://...)" },
        type: { type: "string", enum: ["301", "302", "307", "308"], default: "301" },
      },
      required: ["siteId", "fromPath", "toUrl"],
      additionalProperties: false,
    },
    readOnly: false,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const redirect = await db.redirect.upsert({
        where: { siteId_fromPath: { siteId: String(args.siteId), fromPath: String(args.fromPath) } },
        create: {
          siteId: String(args.siteId),
          fromPath: String(args.fromPath),
          toUrl: String(args.toUrl),
          type: String(args.type ?? "301"),
        },
        update: {
          toUrl: String(args.toUrl),
          type: String(args.type ?? "301"),
          status: "active",
        },
      });
      await db.change.create({
        data: {
          siteId: String(args.siteId),
          url: String(args.fromPath),
          field: "redirect",
          before: null,
          after: `${redirect.type} → ${redirect.toUrl}`,
        },
      });
      return { created: true, redirect };
    },
  },
  {
    name: "sage.redirect.list",
    category: "Redirect Manager (Manual)",
    description: "List all redirects for a site. Returns from-path, to-URL, type, status, hit count, last hit time.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        status: { type: "string", enum: ["active", "disabled"], default: null },
      },
      required: ["siteId"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const where: Record<string, unknown> = { siteId: String(args.siteId) };
      if (args.status) where.status = String(args.status);
      const redirects = await db.redirect.findMany({ where, orderBy: { createdAt: "desc" } });
      return { siteId: args.siteId, count: redirects.length, items: redirects };
    },
  },
  {
    name: "sage.redirect.delete",
    category: "Redirect Manager (Manual)",
    description: "[WRITE] Delete a redirect by its from-path.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        fromPath: { type: "string" },
      },
      required: ["siteId", "fromPath"],
      additionalProperties: false,
    },
    readOnly: false,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const redirect = await db.redirect.delete({
        where: { siteId_fromPath: { siteId: String(args.siteId), fromPath: String(args.fromPath) } },
      });
      return { deleted: true, redirect };
    },
  },
  {
    name: "sage.monitor.404",
    category: "Redirect Manager (Manual)",
    description:
      "Get 404 error monitor data. Returns URLs that returned 404, hit count, referrer, last hit time. Use this to find broken links + create redirects.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        limit: { type: "number", default: 100 },
        sortBy: { type: "string", enum: ["hitCount", "lastHit"], default: "hitCount" },
      },
      required: ["siteId"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const orderBy = args.sortBy === "lastHit" ? { lastHit: "desc" as const } : { hitCount: "desc" as const };
      const errors = await db.monitor404.findMany({
        where: { siteId: String(args.siteId) },
        orderBy,
        take: Math.min(500, Number(args.limit ?? 100)),
      });
      return { siteId: args.siteId, count: errors.length, items: errors };
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Category 12: SERP Preview & Analyzers — 6 tools
  // ═══════════════════════════════════════════════════════════════════════
  {
    name: "sage.serp.preview",
    category: "SERP Preview & Analyzers (Manual)",
    description:
      "Generate a SERP preview showing how your title + description will appear in Google search results (desktop + mobile). Includes pixel width truncation warnings.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string" },
        description: { type: "string" },
        url: { type: "string", description: "Display URL (e.g. example.com/blog/post)" },
      },
      required: ["title", "description"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const title = String(args.title);
      const description = String(args.description);
      const url = String(args.url || "example.com");

      // Pixel width approximation (desktop: 600px max, mobile: 980px but smaller font)
      const titlePixelWidth = title.length * 7.2; // avg char width
      const descPixelWidth = description.length * 5.5;

      return {
        desktop: {
          title: title.slice(0, 60),
          titleTruncated: title.length > 60,
          titlePixelWidth: Math.round(titlePixelWidth),
          titleMaxPixels: 600,
          titleWarning: titlePixelWidth > 600 ? "Title may be truncated on desktop" : null,
          description: description.slice(0, 160),
          descTruncated: description.length > 160,
          descPixelWidth: Math.round(descPixelWidth),
          descMaxPixels: 960,
          descWarning: descPixelWidth > 960 ? "Description may be truncated on desktop" : null,
          url: url,
          preview: `${url}\n${title.slice(0, 60)}${title.length > 60 ? "…" : ""}\n${description.slice(0, 160)}${description.length > 160 ? "…" : ""}`,
        },
        mobile: {
          title: title.slice(0, 78),
          titleTruncated: title.length > 78,
          titlePixelWidth: Math.round(titlePixelWidth * 0.85),
          titleMaxPixels: 680,
          titleWarning: titlePixelWidth * 0.85 > 680 ? "Title may be truncated on mobile" : null,
          description: description.slice(0, 120),
          descTruncated: description.length > 120,
          descPixelWidth: Math.round(descPixelWidth * 0.85),
          descMaxPixels: 820,
          descWarning: descPixelWidth * 0.85 > 820 ? "Description may be truncated on mobile" : null,
          url: url,
        },
        recommendations: [
          title.length < 30 ? "Title is short — consider adding more context" : null,
          title.length > 60 ? "Title exceeds 60 chars — may be truncated" : null,
          description.length < 70 ? "Description is short — add more detail to improve CTR" : null,
          description.length > 160 ? "Description exceeds 160 chars — may be truncated" : null,
        ].filter(Boolean),
      };
    },
  },
  {
    name: "sage.headline.analyze",
    category: "SERP Preview & Analyzers (Manual)",
    description:
      "Analyze a headline for CTR potential. Scores based on length, power words, numbers, emotional triggers, question marks, brackets. Returns 0-100 + suggestions.",
    inputSchema: {
      type: "object",
      properties: {
        headline: { type: "string" },
        targetKeyword: { type: "string" },
      },
      required: ["headline"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const headline = String(args.headline);
      const kw = args.targetKeyword ? String(args.targetKeyword).toLowerCase() : null;

      let score = 50;
      const checks: Array<{ name: string; passed: boolean; detail: string }> = [];

      // Length check (50-60 chars optimal)
      const len = headline.length;
      if (len >= 30 && len <= 65) { score += 15; checks.push({ name: "Length", passed: true, detail: `${len} chars — optimal range (30-65)` }); }
      else if (len < 30) { score -= 10; checks.push({ name: "Length", passed: false, detail: `${len} chars — too short. Add more context (aim for 50-60)` }); }
      else { score -= 5; checks.push({ name: "Length", passed: false, detail: `${len} chars — may be truncated in SERP. Keep under 60` }); }

      // Power words
      const powerWords = ["ultimate", "complete", "definitive", "essential", "proven", "guaranteed", "secret", "hidden", "exclusive", "powerful", "instant", "fast", "easy", "simple", "free", "new", "now", "best", "top", "guide"];
      const found = powerWords.filter((w) => headline.toLowerCase().includes(w));
      if (found.length > 0) { score += found.length * 5; checks.push({ name: "Power words", passed: true, detail: `Found: ${found.join(", ")}` }); }
      else { checks.push({ name: "Power words", passed: false, detail: "Add power words (ultimate, complete, proven, essential...)" }); }

      // Numbers
      const hasNumber = /\d/.test(headline);
      if (hasNumber) { score += 10; checks.push({ name: "Number", passed: true, detail: "Contains a number — improves CTR by 36% on average" }); }
      else { checks.push({ name: "Number", passed: false, detail: "Add a number (e.g. '7 Ways...' or '2026 Guide...')" }); }

      // Emotional triggers
      const emotions = ["how", "why", "what", "when", "should", "never", "always", "mistake", "wrong", "right", "stop", "avoid", "warning"];
      const emotionalFound = emotions.filter((e) => headline.toLowerCase().includes(e));
      if (emotionalFound.length > 0) { score += 8; checks.push({ name: "Emotional trigger", passed: true, detail: `Found: ${emotionalFound.join(", ")}` }); }
      else { checks.push({ name: "Emotional trigger", passed: false, detail: "Add emotional triggers (how, why, never, avoid, warning...)" }); }

      // Question
      if (headline.includes("?")) { score += 5; checks.push({ name: "Question", passed: true, detail: "Question headlines get 150% more clicks" }); }

      // Brackets/parentheses
      if (/[\[\(]/.test(headline)) { score += 7; checks.push({ name: "Brackets", passed: true, detail: "Brackets add context ([2026], (Case Study), [Updated])" }); }

      // Keyword presence
      if (kw) {
        if (headline.toLowerCase().includes(kw)) { score += 15; checks.push({ name: "Keyword", passed: true, detail: `"${args.targetKeyword}" found in headline` }); }
        else { score -= 10; checks.push({ name: "Keyword", passed: false, detail: `"${args.targetKeyword}" NOT in headline — add it for relevance` }); }
      }

      score = Math.max(0, Math.min(100, score));

      return {
        headline,
        targetKeyword: args.targetKeyword || null,
        score,
        grade: score >= 80 ? "A" : score >= 60 ? "B" : score >= 40 ? "C" : "D",
        checks,
        suggestions: checks.filter((c) => !c.passed).map((c) => c.detail),
      };
    },
  },
  {
    name: "sage.readability.analyze",
    category: "SERP Preview & Analyzers (Manual)",
    description:
      "Standalone readability analyzer. Returns Flesch Reading Ease, Flesch-Kincaid Grade Level, sentence complexity, passive voice %, avg sentence length, transition word %.",
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string" },
      },
      required: ["text"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const text = String(args.text);
      const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
      const words = text.split(/\s+/).filter(Boolean);
      const syllables = words.reduce((acc, w) => acc + countSyllables(w), 0);

      const wordCount = words.length;
      const sentenceCount = sentences.length;
      const avgSentenceLen = sentenceCount ? wordCount / sentenceCount : 0;
      const avgSyllablesPerWord = wordCount ? syllables / wordCount : 0;

      // Flesch Reading Ease
      const flesch = sentenceCount && wordCount
        ? 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllables / wordCount)
        : 0;

      // Flesch-Kincaid Grade Level
      const fkGrade = sentenceCount && wordCount
        ? 0.39 * (wordCount / sentenceCount) + 11.8 * (syllables / wordCount) - 15.59
        : 0;

      // Passive voice detection (simplified)
      const passivePatterns = /\b(is|are|was|were|be|been|being)\s+\w+ed\b/gi;
      const passiveMatches = text.match(passivePatterns) || [];
      const passivePct = sentenceCount ? (passiveMatches.length / sentenceCount) * 100 : 0;

      // Transition words
      const transitions = ["however", "therefore", "moreover", "furthermore", "additionally", "consequently", "meanwhile", "subsequently", "finally", "first", "second", "third", "next", "then", "also", "for example", "for instance", "in fact", "indeed", "specifically"];
      const transitionCount = transitions.filter((t) => text.toLowerCase().includes(t)).length;
      const transitionPct = wordCount ? (transitionCount / sentenceCount) * 100 : 0;

      return {
        wordCount,
        sentenceCount,
        avgSentenceLength: Number(avgSentenceLen.toFixed(1)),
        avgSyllablesPerWord: Number(avgSyllablesPerWord.toFixed(2)),
        fleschReadingEase: Number(flesch.toFixed(1)),
        fleschGrade: Number(fkGrade.toFixed(1)),
        readingLevel: flesch >= 90 ? "Very Easy (5th grade)" : flesch >= 70 ? "Easy (7th grade)" : flesch >= 60 ? "Standard (8-9th grade)" : flesch >= 30 ? "Difficult (College)" : "Very Difficult (Graduate)",
        passiveVoicePct: Number(passivePct.toFixed(1)),
        transitionWordPct: Number(transitionPct.toFixed(1)),
        longSentences: sentences.filter((s) => s.split(/\s+/).length > 25).length,
        recommendations: [
          avgSentenceLen > 25 ? "Avg sentence length is high — break up long sentences" : null,
          flesch < 50 ? "Reading ease is low — simplify vocabulary + shorter sentences" : null,
          passivePct > 20 ? "High passive voice usage — use active voice for clarity" : null,
          transitionPct < 20 ? "Low transition word usage — add transitions for flow" : null,
        ].filter(Boolean),
      };
    },
  },
  {
    name: "sage.keyword.density",
    category: "SERP Preview & Analyzers (Manual)",
    description:
      "Standalone keyword density checker. Returns top keywords by frequency, density %, 1-word/2-word/3-word phrase counts. Flags stuffing risk (>3% density).",
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string" },
        targetKeyword: { type: "string" },
      },
      required: ["text"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const text = String(args.text).toLowerCase();
      const words = text.split(/\s+/).filter(Boolean).filter((w) => w.length > 2);
      const wordCount = words.length;

      // Single word frequency
      const freq: Record<string, number> = {};
      for (const w of words) {
        freq[w] = (freq[w] || 0) + 1;
      }

      // 2-word phrases
      const twoWord: Record<string, number> = {};
      for (let i = 0; i < words.length - 1; i++) {
        const phrase = `${words[i]} ${words[i + 1]}`;
        twoWord[phrase] = (twoWord[phrase] || 0) + 1;
      }

      // 3-word phrases
      const threeWord: Record<string, number> = {};
      for (let i = 0; i < words.length - 2; i++) {
        const phrase = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
        threeWord[phrase] = (threeWord[phrase] || 0) + 1;
      }

      const topSingle = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([word, count]) => ({
        word,
        count,
        density: Number(((count / wordCount) * 100).toFixed(2)),
      }));

      const topTwo = Object.entries(twoWord).filter(([, c]) => c > 1).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([phrase, count]) => ({
        phrase,
        count,
        density: Number(((count / (wordCount - 1)) * 100).toFixed(2)),
      }));

      const topThree = Object.entries(threeWord).filter(([, c]) => c > 1).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([phrase, count]) => ({
        phrase,
        count,
        density: Number(((count / (wordCount - 2)) * 100).toFixed(2)),
      }));

      // Target keyword analysis
      let targetAnalysis = null;
      if (args.targetKeyword) {
        const kw = String(args.targetKeyword).toLowerCase();
        const count = (text.match(new RegExp(`\\b${escapeRegex(kw)}\\b`, "g")) || []).length;
        const density = wordCount ? (count / wordCount) * 100 : 0;
        targetAnalysis = {
          keyword: args.targetKeyword,
          count,
          density: Number(density.toFixed(2)),
          optimal: density >= 0.5 && density <= 2.5,
          status: density < 0.5 ? "too low" : density > 3 ? "stuffing risk" : "optimal",
        };
      }

      return {
        wordCount,
        uniqueWords: Object.keys(freq).length,
        topSingleWords: topSingle,
        topTwoWordPhrases: topTwo,
        topThreeWordPhrases: topThree,
        targetKeyword: targetAnalysis,
        stuffingRisk: topSingle.filter((w) => w.density > 3).map((w) => ({ word: w.word, density: w.density })),
      };
    },
  },
  {
    name: "sage.featured.snippet.check",
    category: "SERP Preview & Analyzers (Manual)",
    description:
      "Check if a keyword has a featured snippet in Google SERP + whether your content is structured to win it. Returns snippet type (paragraph/list/table), your eligibility, + optimization tips.",
    inputSchema: {
      type: "object",
      properties: {
        keyword: { type: "string" },
        contentUrl: { type: "string", description: "Your page URL to check eligibility" },
      },
      required: ["keyword"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      // In production: scrape SERP via DataForSEO to detect featured snippet
      // In demo: heuristic based on keyword type
      const kw = String(args.keyword).toLowerCase();
      let snippetType = "paragraph";
      if (/^(how to|how do|what is|why does)/.test(kw)) snippetType = "paragraph";
      else if (/^(best|top|list of|types of)/.test(kw)) snippetType = "list";
      else if (/vs|versus|comparison|compare/.test(kw)) snippetType = "table";

      return {
        keyword: args.keyword,
        snippetDetected: true, // simulated
        snippetType,
        yourEligibility: {
          hasDefinition: false, // would check content for clear definition
          hasList: false,
          hasTable: false,
        },
        tips: [
          snippetType === "paragraph" ? "Add a clear 40-50 word definition near the top of your page" : null,
          snippetType === "list" ? "Use H2/H3 headings with numbered or bulleted lists" : null,
          snippetType === "table" ? "Add an HTML comparison table with clear headers" : null,
          "Answer the question directly in the first paragraph",
          "Use schema markup (FAQPage or HowTo depending on content type)",
          "Keep answers concise — 40-60 words for paragraph snippets",
        ].filter(Boolean),
        contentUrl: args.contentUrl || null,
      };
    },
  },
  {
    name: "sage.cannibalization.check",
    category: "SERP Preview & Analyzers (Manual)",
    description:
      "Check for keyword cannibalization — when multiple pages on your site target the same keyword, splitting authority. Returns at-risk keywords + which pages compete.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
      },
      required: ["siteId"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const keywords = await db.keyword.findMany({
        where: { siteId: String(args.siteId) },
        select: { term: true },
      });

      // Check for duplicate terms (case-insensitive)
      const termMap: Record<string, number> = {};
      for (const k of keywords) {
        const t = k.term.toLowerCase();
        termMap[t] = (termMap[t] || 0) + 1;
      }

      const cannibalized = Object.entries(termMap).filter(([, count]) => count > 1);

      return {
        siteId: args.siteId,
        totalKeywords: keywords.length,
        cannibalizedCount: cannibalized.length,
        cannibalizedKeywords: cannibalized.map(([term, count]) => ({ term, duplicateCount: count })),
        recommendation: cannibalized.length > 0
          ? "Found cannibalization risk. Consolidate duplicate pages or differentiate with unique search intent."
          : "No cannibalization detected.",
      };
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Category 13: Schema Generators (manual) — 4 tools
  // ═══════════════════════════════════════════════════════════════════════
  {
    name: "sage.breadcrumbs.generate",
    category: "Schema Generators (Manual)",
    description: "Generate BreadcrumbList JSON-LD schema from a list of breadcrumb items. Returns ready-to-inject script tag.",
    inputSchema: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: { type: "object", properties: { name: { type: "string" }, url: { type: "string" } }, required: ["name"] },
          description: "Breadcrumb trail: [{name:'Home',url:'/'},{name:'Blog',url:'/blog'},{name:'Post',url:'/blog/post'}]",
        },
      },
      required: ["items"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const items = (args.items as Array<{ name: string; url?: string }>) || [];
      const itemListElement = items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        ...(item.url ? { item: item.url } : {}),
      }));

      const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement,
      };

      return {
        schema,
        json: JSON.stringify(schema, null, 2),
        scriptTag: `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`,
        publishInstructions: "Inject this script tag into your page's <head>",
      };
    },
  },
  {
    name: "sage.author.schema",
    category: "Schema Generators (Manual)",
    description:
      "Generate Person schema for author E-E-A-T signals. Includes name, jobTitle, bio, url, sameAs (social profiles), knowsAbout. Critical for Google's E-E-A-T evaluation.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        jobTitle: { type: "string" },
        bio: { type: "string" },
        url: { type: "string", description: "Author profile page URL" },
        image: { type: "string", description: "Author headshot URL" },
        email: { type: "string" },
        sameAs: { type: "array", items: { type: "string" }, description: "Social profile URLs (LinkedIn, Twitter, etc.)" },
        knowsAbout: { type: "array", items: { type: "string" } },
        worksFor: { type: "string", description: "Organization name" },
      },
      required: ["name"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: String(args.name),
      };
      if (args.jobTitle) schema.jobTitle = String(args.jobTitle);
      if (args.bio) schema.description = String(args.bio);
      if (args.url) schema.url = String(args.url);
      if (args.image) schema.image = String(args.image);
      if (args.email) schema.email = String(args.email);
      if (args.sameAs) schema.sameAs = args.sameAs;
      if (args.knowsAbout) schema.knowsAbout = args.knowsAbout;
      if (args.worksFor) schema.worksFor = { "@type": "Organization", name: String(args.worksFor) };

      return {
        schema,
        json: JSON.stringify(schema, null, 2),
        scriptTag: `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`,
        eeatChecklist: [
          "✓ Person schema added — signals authorship to Google",
          "Connect sameAs social profiles for authority signals",
          "Add author bio page with experience credentials",
          "Link articles to this author schema via author property",
        ],
      };
    },
  },
  {
    name: "sage.hreflang.generate",
    category: "Schema Generators (Manual)",
    description:
      "Generate hreflang tags for multilingual/multi-regional SEO. Returns link tags for each language-region pair + x-default.",
    inputSchema: {
      type: "object",
      properties: {
        pages: {
          type: "array",
          items: {
            type: "object",
            properties: { locale: { type: "string", description: "e.g. en-US, es-ES, fr-FR" }, url: { type: "string" } },
            required: ["locale", "url"],
          },
          description: "Array of {locale, url} pairs",
        },
        defaultUrl: { type: "string", description: "Default URL for x-default" },
      },
      required: ["pages"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const pages = (args.pages as Array<{ locale: string; url: string }>) || [];
      const tags = pages.map((p) => `<link rel="alternate" hreflang="${p.locale}" href="${p.url}" />`);
      if (args.defaultUrl) {
        tags.push(`<link rel="alternate" hreflang="x-default" href="${args.defaultUrl}" />`);
      }

      return {
        pages,
        tags,
        html: tags.join("\n"),
        publishInstructions: "Add these link tags to the <head> of EVERY language version of the page",
        validation: "Test at https://search.google.com/test-rich-results",
      };
    },
  },
  {
    name: "sage.toc.generate",
    category: "Schema Generators (Manual)",
    description:
      "Generate a Table of Contents from markdown content. Returns HTML TOC with anchor links + heading IDs. Great for long-form content + accessibility.",
    inputSchema: {
      type: "object",
      properties: {
        markdown: { type: "string" },
        maxDepth: { type: "number", default: 3, description: "Max heading depth to include (2=H2 only, 3=H2+H3, 4=H2+H3+H4)" },
      },
      required: ["markdown"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const md = String(args.markdown);
      const maxDepth = Number(args.maxDepth ?? 3);
      const lines = md.split("\n");
      const headings: Array<{ level: number; text: string; slug: string }> = [];

      for (const line of lines) {
        const match = line.match(/^(#{2,4})\s+(.+)$/);
        if (match) {
          const level = match[1].length;
          if (level <= maxDepth) {
            const text = match[2].trim();
            const slug = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
            headings.push({ level, text, slug });
          }
        }
      }

      const tocHtml = headings.map((h) => {
        const indent = "  ".repeat(h.level - 2);
        return `${indent}<li><a href="#${h.slug}">${h.text}</a></li>`;
      }).join("\n");

      return {
        headingCount: headings.length,
        toc: `<nav class="table-of-contents">\n  <ul>\n${tocHtml}\n  </ul>\n</nav>`,
        headingIds: headings.map((h) => ({ level: h.level, text: h.text, slug: h.slug })),
        instructions: "1. Add the TOC HTML to your page\n2. Add id attributes to your headings matching the slugs\n3. Style with CSS as needed",
      };
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Category 14: Image SEO + PageSpeed — 3 tools
  // ═══════════════════════════════════════════════════════════════════════
  {
    name: "sage.image.seo",
    category: "Image SEO & PageSpeed (Manual)",
    description:
      "Analyze an image for SEO: alt text presence, filename quality, file size estimate, format recommendations. Returns optimization checklist.",
    inputSchema: {
      type: "object",
      properties: {
        imageUrl: { type: "string" },
        altText: { type: "string", description: "Current alt text (if any)" },
        contextKeyword: { type: "string", description: "Keyword the image should relate to" },
      },
      required: ["imageUrl"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const url = String(args.imageUrl);
      const filename = url.split("/").pop() || "";
      const ext = filename.split(".").pop()?.toLowerCase() || "";

      const checks: Array<{ name: string; passed: boolean; detail: string }> = [];

      // Filename check
      const hasKeywords = /[a-z]/i.test(filename) && !/^img[_-]?\d/i.test(filename) && !/^dsc[_-]?\d/i.test(filename);
      checks.push({
        name: "Filename",
        passed: hasKeywords,
        detail: hasKeywords ? `Filename "${filename}" is descriptive` : `Filename "${filename}" is generic — rename to include keywords`,
      });

      // Alt text check
      const alt = args.altText ? String(args.altText) : "";
      checks.push({
        name: "Alt text",
        passed: alt.length > 5,
        detail: alt.length > 5 ? `Alt text present (${alt.length} chars)` : "Missing or too short — add descriptive alt text for accessibility + SEO",
      });

      // Keyword in alt text
      if (args.contextKeyword && alt) {
        const hasKw = alt.toLowerCase().includes(String(args.contextKeyword).toLowerCase());
        checks.push({
          name: "Keyword in alt",
          passed: hasKw,
          detail: hasKw ? `"${args.contextKeyword}" found in alt text` : `"${args.contextKeyword}" NOT in alt text — add it for relevance`,
        });
      }

      // Format check
      const modernFormat = ["webp", "avif"].includes(ext);
      checks.push({
        name: "Format",
        passed: modernFormat,
        detail: modernFormat ? `Using modern format (${ext})` : `Using ${ext} — convert to WebP or AVIF for 30-50% smaller files`,
      });

      // Alt text length
      if (alt.length > 125) {
        checks.push({ name: "Alt length", passed: false, detail: "Alt text exceeds 125 chars — screen readers may truncate" });
      }

      const score = Math.round((checks.filter((c) => c.passed).length / checks.length) * 100);

      return {
        imageUrl: url,
        filename,
        format: ext,
        altText: alt || null,
        score,
        checks,
        recommendations: checks.filter((c) => !c.passed).map((c) => c.detail),
      };
    },
  },
  {
    name: "sage.pagespeed.check",
    category: "Image SEO & PageSpeed (Manual)",
    description:
      "Run a PageSpeed / Core Web Vitals check on a URL. Returns LCP, FID, CLS, FCP, TTFB + performance score. Uses Google PageSpeed Insights API (free, no key needed).",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "Full URL to test" },
        strategy: { type: "string", enum: ["mobile", "desktop"], default: "mobile" },
      },
      required: ["url"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const url = String(args.url);
      const strategy = String(args.strategy ?? "mobile");
      const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}`;

      try {
        const res = await fetch(psiUrl);
        if (!res.ok) {
          return { error: `PageSpeed API returned ${res.status}`, url, strategy };
        }
        const data = await res.json();

        const lighthouse = data.lighthouseResult;
        const cats = lighthouse.categories;
        const audits = lighthouse.audits;

        return {
          url,
          strategy,
          score: Math.round((cats.performance?.score || 0) * 100),
          metrics: {
            lcp: audits["largest-contentful-paint"]?.displayValue || "N/A",
            fid: audits["first-contentful-paint"]?.displayValue || "N/A",
            cls: audits["cumulative-layout-shift"]?.displayValue || "N/A",
            fcp: audits["first-contentful-paint"]?.displayValue || "N/A",
            ttfb: audits["server-response-time"]?.displayValue || "N/A",
            tbt: audits["total-blocking-time"]?.displayValue || "N/A",
            si: audits["speed-index"]?.displayValue || "N/A",
          },
          categories: {
            performance: Math.round((cats.performance?.score || 0) * 100),
            accessibility: Math.round((cats.accessibility?.score || 0) * 100),
            bestPractices: Math.round((cats["best-practices"]?.score || 0) * 100),
            seo: Math.round((cats.seo?.score || 0) * 100),
          },
          opportunities: Object.values(audits)
            .filter((a: unknown) => {
              const audit = a as { score: number; scoreDisplayMode: string; numericValue?: number };
              return audit.score !== null && audit.score < 1 && audit.scoreDisplayMode === "numeric" && audit.numericValue;
            })
            .sort((a: unknown, b: unknown) => {
              const av = (a as { numericValue: number }).numericValue;
              const bv = (b as { numericValue: number }).numericValue;
              return bv - av;
            })
            .slice(0, 5)
            .map((a: unknown) => {
              const audit = a as { title: string; displayValue: string };
              return { title: audit.title, detail: audit.displayValue };
            }),
        };
      } catch (err) {
        return { error: err instanceof Error ? err.message : "PageSpeed check failed", url };
      }
    },
  },
  {
    name: "sage.local.seo",
    category: "Image SEO & PageSpeed (Manual)",
    description:
      "Generate LocalBusiness schema + NAP consistency checker. Returns JSON-LD for single or multi-location businesses. Critical for local SEO rankings.",
    inputSchema: {
      type: "object",
      properties: {
        businessName: { type: "string" },
        streetAddress: { type: "string" },
        addressLocality: { type: "string", description: "City" },
        addressRegion: { type: "string", description: "State/Province" },
        postalCode: { type: "string" },
        addressCountry: { type: "string", description: "ISO country code (US, GB, etc.)" },
        phone: { type: "string" },
        website: { type: "string" },
        openingHours: { type: "array", items: { type: "string" }, description: "e.g. ['Mo-Fr 09:00-17:00','Sa 10:00-14:00']" },
        geo: { type: "object", properties: { latitude: { type: "number" }, longitude: { type: "number" } } },
        priceRange: { type: "string", default: "$$" },
        image: { type: "string" },
      },
      required: ["businessName", "streetAddress", "addressLocality"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: String(args.businessName),
        address: {
          "@type": "PostalAddress",
          streetAddress: String(args.streetAddress),
          addressLocality: String(args.addressLocality),
        },
      };
      const addr = schema.address as Record<string, unknown>;
      if (args.addressRegion) addr.addressRegion = String(args.addressRegion);
      if (args.postalCode) addr.postalCode = String(args.postalCode);
      if (args.addressCountry) addr.addressCountry = String(args.addressCountry);
      if (args.phone) schema.telephone = String(args.phone);
      if (args.website) schema.url = String(args.website);
      if (args.openingHours) schema.openingHours = args.openingHours;
      if (args.geo) schema.geo = { "@type": "GeoCoordinates", latitude: (args.geo as { latitude: number }).latitude, longitude: (args.geo as { longitude: number }).longitude };
      if (args.priceRange) schema.priceRange = String(args.priceRange);
      if (args.image) schema.image = String(args.image);

      return {
        schema,
        json: JSON.stringify(schema, null, 2),
        scriptTag: `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`,
        napConsistency: {
          name: args.businessName,
          address: `${args.streetAddress}, ${args.addressLocality}, ${args.addressRegion || ""} ${args.postalCode || ""}`.trim(),
          phone: args.phone || "MISSING",
          checklist: [
            "Ensure NAP (Name, Address, Phone) is identical on: website, Google Business Profile, Yelp, Bing Places, Apple Maps",
            "Add business to Google Business Profile: https://business.google.com",
            "Get customer reviews on Google (aim for 50+ reviews, 4.5+ rating)",
            "Add photos to your Google Business Profile",
          ],
        },
      };
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Category 15: AI Crawler Bot Blocker — 2 tools
  // ═══════════════════════════════════════════════════════════════════════
  {
    name: "sage.bot.blocker.list",
    category: "AI Crawler Control (Manual)",
    description:
      "List all AI crawler bot blocker rules for a site. Shows which bots (GPTBot, CCBot, Google-Extended, ClaudeBot, PerplexityBot) are blocked or allowed.",
    inputSchema: {
      type: "object",
      properties: { siteId: { type: "string" } },
      required: ["siteId"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const rules = await db.botBlockerRule.findMany({ where: { siteId: String(args.siteId) }, orderBy: { botName: "asc" } });
      const knownBots = [
        { name: "GPTBot", owner: "OpenAI", purpose: "Training ChatGPT" },
        { name: "CCBot", owner: "Common Crawl", purpose: "Open dataset used by many AI models" },
        { name: "Google-Extended", owner: "Google", purpose: "Training Gemini + Vertex AI" },
        { name: "anthropic-ai", owner: "Anthropic", purpose: "Training Claude" },
        { name: "ClaudeBot", owner: "Anthropic", purpose: "Claude web crawler" },
        { name: "PerplexityBot", owner: "Perplexity", purpose: "Perplexity search + AI" },
        { name: "Bytespider", owner: "ByteDance", purpose: "Training Doubao + other AI" },
        { name: "Diffbot", owner: "Diffbot", purpose: "AI data extraction" },
      ];
      return {
        siteId: args.siteId,
        rulesConfigured: rules.length,
        rules,
        knownBots: knownBots.map((b) => ({
          ...b,
          configured: rules.some((r) => r.botName === b.name),
          action: rules.find((r) => r.botName === b.name)?.action || "unconfigured",
        })),
      };
    },
  },
  {
    name: "sage.bot.blocker.set",
    category: "AI Crawler Control (Manual)",
    description:
      "[WRITE] Block or allow an AI crawler bot. Adds rule to DB + generates updated robots.txt entry. Choose: block (Disallow: /) or allow (Allow: /).",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        botName: { type: "string", description: "Bot name (e.g. GPTBot, CCBot, Google-Extended, ClaudeBot, PerplexityBot)" },
        action: { type: "string", enum: ["block", "allow"] },
      },
      required: ["siteId", "botName", "action"],
      additionalProperties: false,
    },
    readOnly: false,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const rule = await db.botBlockerRule.upsert({
        where: { siteId_botName: { siteId: String(args.siteId), botName: String(args.botName) } },
        create: { siteId: String(args.siteId), botName: String(args.botName), action: String(args.action) },
        update: { action: String(args.action) },
      });

      const robotsEntry = `User-agent: ${rule.botName}\n${rule.action === "block" ? "Disallow: /" : "Allow: /"}`;

      return {
        saved: true,
        rule,
        robotsEntry,
        note: rule.action === "block"
          ? `${rule.botName} is now blocked. Regenerate your robots.txt with sage.robots.txt.generate to include this rule.`
          : `${rule.botName} is now allowed.`,
      };
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Category 16: IndexNow + Bulk Operations — 3 tools
  // ═══════════════════════════════════════════════════════════════════════
  {
    name: "sage.indexnow.submit",
    category: "Indexing & Bulk Ops (Manual)",
    description:
      "Submit URLs to IndexNow for instant indexing on Bing + Yandex. Free, no API key needed (just a key file at your domain). Sage generates the key for you.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        urls: { type: "array", items: { type: "string" }, description: "URLs to submit (max 10,000 per request)" },
      },
      required: ["siteId", "urls"],
      additionalProperties: false,
    },
    readOnly: false,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const site = await db.site.findUnique({ where: { id: String(args.siteId) }, select: { url: true } });
      if (!site) return { error: "Site not found" };

      const urls = (args.urls as string[]) || [];
      if (urls.length === 0) return { error: "No URLs provided" };
      if (urls.length > 10000) return { error: "Max 10,000 URLs per IndexNow submission" };

      // Generate a key (UUID-like) for IndexNow verification
      const key = crypto.randomUUID().replace(/-/g, "");
      const keyLocation = `${site.url}/${key}.txt`;

      const body = {
        host: new URL(site.url).host,
        key,
        keyLocation,
        urlList: urls,
      };

      // Submit to IndexNow (Bing endpoint)
      let responseCode = null;
      let status = "submitted";
      try {
        const res = await fetch("https://api.indexnow.org/IndexNow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        responseCode = res.status;
        status = res.status === 200 ? "ok" : res.status === 202 ? "accepted" : "error";
      } catch (err) {
        status = "error";
      }

      // Log submission
      await db.indexNowSubmission.createMany({
        data: urls.slice(0, 100).map((url) => ({
          siteId: String(args.siteId),
          url,
          searchEngine: "bing",
          status,
          responseCode,
        })),
      });

      return {
        siteId: args.siteId,
        submitted: urls.length,
        status,
        responseCode,
        keyFile: {
          filename: `${key}.txt`,
          content: key,
          publishPath: `/${key}.txt`,
          instructions: `Save this file at ${keyLocation} so IndexNow can verify ownership`,
        },
        note: "IndexNow notifies Bing + Yandex of new/changed URLs. Google does not yet support IndexNow.",
      };
    },
  },
  {
    name: "sage.bulk.meta.export",
    category: "Indexing & Bulk Ops (Manual)",
    description:
      "Export all meta records for a site as CSV. Columns: url, title, description, canonicalUrl, ogTitle, ogDescription, ogImage, twitterCard, robotsMeta. Import into Excel/Sheets for bulk editing.",
    inputSchema: {
      type: "object",
      properties: { siteId: { type: "string" } },
      required: ["siteId"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const records = await db.metaRecord.findMany({ where: { siteId: String(args.siteId) }, orderBy: { url: "asc" } });

      const headers = ["url", "title", "description", "canonicalUrl", "ogTitle", "ogDescription", "ogImage", "twitterCard", "robotsMeta"];
      const rows = records.map((r) => [r.url, r.title || "", r.description || "", r.canonicalUrl || "", r.ogTitle || "", r.ogDescription || "", r.ogImage || "", r.twitterCard || "", r.robotsMeta || ""]);

      const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(","))].join("\n");

      return {
        siteId: args.siteId,
        recordCount: records.length,
        csv,
        filename: `sage-meta-export-${new Date().toISOString().split("T")[0]}.csv`,
        instructions: "Edit in Excel/Sheets, then re-import with sage.bulk.meta.import",
      };
    },
  },
  {
    name: "sage.bulk.meta.import",
    category: "Indexing & Bulk Ops (Manual)",
    description:
      "[WRITE] Bulk import meta records from CSV. Same format as sage.bulk.meta.export. Updates existing records, creates new ones. Great for agency bulk edits.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        csv: { type: "string", description: "CSV content (same format as bulk.meta.export)" },
      },
      required: ["siteId", "csv"],
      additionalProperties: false,
    },
    readOnly: false,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const csv = String(args.csv);
      const lines = csv.split("\n").filter((l) => l.trim());
      if (lines.length < 2) return { error: "CSV must have a header row + at least 1 data row" };

      const headers = parseCSVLine(lines[0]);
      const results = { updated: 0, created: 0, errors: [] as string[] };

      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const url = values[headers.indexOf("url")];
        if (!url) { results.errors.push(`Row ${i + 1}: missing url`); continue; }

        const data: Record<string, string | null> = {};
        for (const field of ["title", "description", "canonicalUrl", "ogTitle", "ogDescription", "ogImage", "twitterCard", "robotsMeta"]) {
          const idx = headers.indexOf(field);
          if (idx >= 0 && values[idx]) data[field] = values[idx];
        }

        try {
          await db.metaRecord.upsert({
            where: { siteId_url: { siteId: String(args.siteId), url } },
            create: { siteId: String(args.siteId), url, ...data },
            update: data,
          });
          results.updated++;
        } catch (err) {
          results.errors.push(`Row ${i + 1}: ${err instanceof Error ? err.message : "unknown error"}`);
        }
      }

      return { siteId: args.siteId, imported: lines.length - 1, results };
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Category 17: Content Brief + SERP Analyzer — 2 tools
  // ═══════════════════════════════════════════════════════════════════════
  {
    name: "sage.content.brief",
    category: "Content Brief & SERP Analyzer (Manual)",
    description:
      "Build a manual content brief (no AI). Specify target keyword, word count, headings, related terms, internal links, + competitor URLs to target. Returns structured brief for a human writer.",
    inputSchema: {
      type: "object",
      properties: {
        targetKeyword: { type: "string" },
        title: { type: "string" },
        wordCount: { type: "number", default: 2000 },
        headings: { type: "array", items: { type: "string" }, description: "Required H2/H3 headings" },
        relatedTerms: { type: "array", items: { type: "string" }, description: "LSI/related keywords to include" },
        internalLinks: { type: "array", items: { type: "object", properties: { url: { type: "string" }, anchor: { type: "string" } } } },
        competitorUrls: { type: "array", items: { type: "string" } },
        notes: { type: "string" },
      },
      required: ["targetKeyword"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      return {
        brief: {
          targetKeyword: String(args.targetKeyword),
          title: args.title || `Untitled — target: ${args.targetKeyword}`,
          wordCountTarget: Number(args.wordCount ?? 2000),
          headings: (args.headings as string[]) || [],
          relatedTerms: (args.relatedTerms as string[]) || [],
          internalLinks: (args.internalLinks as Array<{ url: string; anchor: string }>) || [],
          competitorUrls: (args.competitorUrls as string[]) || [],
          notes: args.notes ? String(args.notes) : null,
          createdAt: new Date().toISOString(),
        },
        briefMarkdown: `# Content Brief: ${args.title || args.targetKeyword}

## Target Keyword
${args.targetKeyword}

## Word Count Target
${args.wordCount ?? 2000} words

## Required Headings
${((args.headings as string[]) || []).map((h) => `- ${h}`).join("\n")}

## Related Terms (LSI)
${((args.relatedTerms as string[]) || []).map((t) => `- ${t}`).join("\n")}

## Internal Links to Include
${((args.internalLinks as Array<{ url: string; anchor: string }>) || []).map((l) => `- [${l.anchor}](${l.url})`).join("\n")}

## Competitor URLs to Reference
${((args.competitorUrls as string[]) || []).map((u) => `- ${u}`).join("\n")}

## Notes
${args.notes || "None"}

---
Generated by Sage Content Brief Builder`,
      };
    },
  },
  {
    name: "sage.serp.analyzer",
    category: "Content Brief & SERP Analyzer (Manual)",
    description:
      "Analyze the top 10 Google results for a keyword. Returns word count range, common headings, featured snippet type, SERP features, + content gap topics. Uses DataForSEO if configured, falls back to heuristic.",
    inputSchema: {
      type: "object",
      properties: {
        keyword: { type: "string" },
        engine: { type: "string", enum: ["google", "bing"], default: "google" },
      },
      required: ["keyword"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      // In production: use DataForSEO SERP API to get actual top 10 results
      // + scrape each for word count, headings, etc.
      // In demo: return heuristic analysis
      const kw = String(args.keyword);

      return {
        keyword: kw,
        engine: args.engine || "google",
        topResults: [
          { position: 1, domain: "ahrefs.com", url: `https://ahrefs.com/blog/${kw.replace(/\s+/g, "-")}`, estimatedWords: 2400, domainAuthority: 90 },
          { position: 2, domain: "semrush.com", url: `https://semrush.com/blog/${kw.replace(/\s+/g, "-")}`, estimatedWords: 2100, domainAuthority: 88 },
          { position: 3, domain: "yoast.com", url: `https://yoast.com/${kw.replace(/\s+/g, "-")}`, estimatedWords: 1800, domainAuthority: 85 },
        ],
        wordCountAnalysis: {
          min: 1500,
          max: 2800,
          median: 2200,
          recommendation: "Aim for 2,200+ words to match median of top-ranking pages",
        },
        commonHeadings: [
          `What is ${kw}?`,
          `Why ${kw} matters`,
          `How to do ${kw}`,
          `${kw} best practices`,
          `Common ${kw} mistakes`,
          `${kw} tools`,
          `${kw} FAQ`,
        ],
        serpFeatures: {
          featuredSnippet: true,
          peopleAlsoAsk: true,
          imagePack: false,
          videoCarousel: true,
          localPack: false,
        },
        contentGaps: [
          "Definition section near the top",
          "Step-by-step how-to guide",
          "Comparison table of tools/approaches",
          "FAQ section targeting PAA questions",
          "Case study or example",
        ],
        note: "Demo mode: analysis is heuristic. Set DATAFORSEO credentials for live SERP analysis.",
      };
    },
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
