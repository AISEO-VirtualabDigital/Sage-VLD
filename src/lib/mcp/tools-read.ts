/**
 * Sage MCP Server — Read Tools (Phase 1, 5 tools)
 *
 * All read-only. Run in demo mode without auth, or with bearer token for user-scoped results.
 */
import type { ToolDef, ToolContext } from "./types";

export const readTools: ToolDef[] = [
  {
    name: "sage.sites.list",
    category: "Site & Core Management",
    description:
      "List all sites connected to the authenticated user. Returns id, url, name, verified status, CMS type, and timestamps. Use this first to discover siteIds needed by other tools.",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Max results (default 50, max 200)", default: 50 },
        cursor: { type: "string", description: "Pagination cursor (site id)", default: null },
      },
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args, ctx: ToolContext) => {
      const { db } = await import("@/lib/db");
      const limit = Math.min(200, Number(args.limit ?? 50));
      const cursor = args.cursor ? { id: String(args.cursor) } : undefined;
      const sites = await db.site.findMany({
        where: { userId: ctx.userId },
        take: limit + 1,
        cursor,
        skip: cursor ? 1 : 0,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          url: true,
          name: true,
          verified: true,
          cmsType: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      const hasMore = sites.length > limit;
      const items = hasMore ? sites.slice(0, limit) : sites;
      return {
        count: items.length,
        hasMore,
        nextCursor: hasMore ? items[items.length - 1].id : null,
        items,
      };
    },
  },
  {
    name: "sage.keywords.list",
    category: "Keywords & Dual-Core Rank Tracking",
    description:
      "List tracked keywords for a site. Returns term, intent classification, topic cluster, country, device, and monthly search volume. Use for keyword research and topic clustering workflows.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string", description: "Site ID (from sage.sites.list)" },
        cluster: { type: "string", description: "Filter by topic cluster", default: null },
        intent: {
          type: "string",
          enum: ["informational", "navigational", "transactional", "commercial"],
          default: null,
        },
        limit: { type: "number", default: 100 },
      },
      required: ["siteId"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const siteId = String(args.siteId);
      const limit = Math.min(500, Number(args.limit ?? 100));
      const where: Record<string, unknown> = { siteId };
      if (args.cluster) where.cluster = String(args.cluster);
      if (args.intent) where.intent = String(args.intent);

      const keywords = await db.keyword.findMany({
        where,
        take: limit,
        orderBy: { volume: "desc" },
        select: {
          id: true,
          term: true,
          intent: true,
          cluster: true,
          country: true,
          device: true,
          volume: true,
          createdAt: true,
        },
      });
      return {
        siteId,
        count: keywords.length,
        clusters: Array.from(new Set(keywords.map((k) => k.cluster).filter(Boolean))),
        items: keywords,
      };
    },
  },
  {
    name: "sage.rankings.get",
    category: "Keywords & Dual-Core Rank Tracking",
    description:
      "Get ranking history for a keyword across Google + Bing. Returns daily positions, SERP features, and a trend summary. Pass engine='google'|'bing' to filter, or omit for both.",
    inputSchema: {
      type: "object",
      properties: {
        keywordId: { type: "string", description: "Keyword ID (from sage.keywords.list)" },
        engine: {
          type: "string",
          enum: ["google", "bing"],
          description: "Filter to a single engine (default: both)",
          default: null,
        },
        days: { type: "number", description: "Lookback window in days (default 30, max 365)", default: 30 },
      },
      required: ["keywordId"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const keywordId = String(args.keywordId);
      const days = Math.min(365, Number(args.days ?? 30));
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const where: Record<string, unknown> = {
        keywordId,
        checkedAt: { gte: since },
      };
      if (args.engine) where.engine = String(args.engine);

      const rankings = await db.ranking.findMany({
        where,
        orderBy: { checkedAt: "asc" },
        select: {
          id: true,
          engine: true,
          position: true,
          serpFeatures: true,
          checkedAt: true,
        },
      });

      const byEngine: Record<string, { positions: number[]; items: typeof rankings }> = {};
      for (const r of rankings) {
        if (!byEngine[r.engine]) byEngine[r.engine] = { positions: [], items: [] };
        byEngine[r.engine].positions.push(r.position);
        byEngine[r.engine].items.push(r);
      }

      const summary = Object.entries(byEngine).map(([engine, data]) => {
        const first = data.positions[0] ?? 0;
        const last = data.positions[data.positions.length - 1] ?? 0;
        const validPositions = data.positions.filter((p) => p > 0);
        const best = validPositions.length ? Math.min(...validPositions) : null;
        return {
          engine,
          currentPosition: last || null,
          previousPosition: first || null,
          delta: first && last ? first - last : 0,
          bestPosition: best,
          dataPoints: data.positions.length,
        };
      });

      return { keywordId, days, engines: summary, history: rankings };
    },
  },
  {
    name: "sage.citations.get",
    category: "AI Citations & GEO Tracking",
    description:
      "Get AI Citation Tracker (GEO) report for a site. Returns citation rate, share-of-voice, and per-engine breakdowns across ChatGPT, Perplexity, Google AI Overviews, SearchGPT, and Claude. Includes competitor citation data when available.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string", description: "Site ID (from sage.sites.list)" },
        engine: {
          type: "string",
          enum: ["chatgpt", "perplexity", "google-aio", "searchgpt", "claude"],
          description: "Filter to a single AI engine (default: all)",
          default: null,
        },
        days: { type: "number", description: "Lookback in days (default 30)", default: 30 },
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

      const where: Record<string, unknown> = {
        siteId,
        checkedAt: { gte: since },
      };
      if (args.engine) where.engine = String(args.engine);

      const citations = await db.citation.findMany({
        where,
        orderBy: { checkedAt: "desc" },
        select: {
          id: true,
          engine: true,
          query: true,
          cited: true,
          citationText: true,
          citationUrl: true,
          competitorCited: true,
          checkedAt: true,
        },
      });

      const byEngine: Record<string, { total: number; cited: number; competitors: Record<string, number> }> = {};
      for (const c of citations) {
        if (!byEngine[c.engine]) byEngine[c.engine] = { total: 0, cited: 0, competitors: {} };
        byEngine[c.engine].total += 1;
        if (c.cited) byEngine[c.engine].cited += 1;
        if (c.competitorCited) {
          byEngine[c.engine].competitors[c.competitorCited] =
            (byEngine[c.engine].competitors[c.competitorCited] || 0) + 1;
        }
      }

      const engines = Object.entries(byEngine).map(([engine, data]) => ({
        engine,
        citationRate: data.total ? Math.round((data.cited / data.total) * 100) : 0,
        checked: data.total,
        cited: data.cited,
        topCompetitors: Object.entries(data.competitors)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([domain, count]) => ({ domain, count })),
      }));

      const totalCited = citations.filter((c) => c.cited).length;
      const overallSov = citations.length ? Math.round((totalCited / citations.length) * 100) : 0;

      return {
        siteId,
        days,
        overallSovPercent: overallSov,
        totalChecks: citations.length,
        totalCited,
        engines,
        recentCitations: citations.filter((c) => c.cited).slice(0, 10),
      };
    },
  },
  {
    name: "sage.audits.latest",
    category: "Technical Audits & Site Health",
    description:
      "Get the latest completed site audit. Returns overall score (0-100), pages crawled, and all findings grouped by severity (pass/warn/fail) with auto-fix availability flags. Use this to identify the highest-impact technical SEO issues to fix first.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string", description: "Site ID (from sage.sites.list)" },
      },
      required: ["siteId"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const siteId = String(args.siteId);

      const audit = await db.auditRun.findFirst({
        where: { siteId, status: "completed" },
        orderBy: { completedAt: "desc" },
        include: { findings: { orderBy: [{ severity: "asc" }, { pageCount: "desc" }] } },
      });

      if (!audit) {
        return { siteId, audit: null, message: "No completed audit found for this site." };
      }

      const bySeverity: Record<string, typeof audit.findings> = { fail: [], warn: [], pass: [] };
      for (const f of audit.findings) {
        if (!bySeverity[f.severity]) bySeverity[f.severity] = [];
        bySeverity[f.severity].push(f);
      }

      return {
        siteId,
        audit: {
          id: audit.id,
          score: audit.score,
          pagesCrawled: audit.pagesCrawled,
          startedAt: audit.startedAt,
          completedAt: audit.completedAt,
        },
        summary: {
          fail: bySeverity.fail.length,
          warn: bySeverity.warn.length,
          pass: bySeverity.pass.length,
          autoFixAvailable: audit.findings.filter((f) => f.autoFixAvailable).length,
        },
        findings: bySeverity,
      };
    },
  },
];
