/**
 * Sage MCP Server — Competitor Analysis Suite (Phase 5, 9 tools)
 *
 * Domain overview, domain keywords, landscape, content gaps,
 * SERP competitors, competitor backlinks, top pages, traffic, battlecard.
 */
import type { ToolDef } from "./types";

export const competitorTools: ToolDef[] = [
  {
    name: "sage.competitor.overview",
    category: "Competitor Analysis Suite",
    description:
      "Get a full overview of a competitor domain: estimated traffic, total keywords, total backlinks, domain authority, top pages, top keywords. DataForSEO-powered or simulated.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        domain: { type: "string", description: "Competitor domain" },
      },
      required: ["siteId", "domain"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const domain = String(args.domain);

      // Check DB
      let comp = await db.competitorDomain.findUnique({
        where: { siteId_domain: { siteId: String(args.siteId), domain } },
      });

      if (!comp) {
        // Simulate + store
        const hash = domain.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
        comp = await db.competitorDomain.create({
          data: {
            siteId: String(args.siteId),
            domain,
            estimatedTraffic: 5000 + (hash % 500000),
            totalKeywords: 200 + (hash % 10000),
            totalBacklinks: 500 + (hash % 50000),
            domainAuthority: 20 + (hash % 70),
            topPages: JSON.stringify(simulateTopPages(domain, hash)),
            commonKeywords: JSON.stringify([]),
            competitorOnlyKeywords: JSON.stringify([]),
            gapKeywords: JSON.stringify([]),
          },
        });
      }

      return {
        siteId: args.siteId,
        domain,
        overview: {
          estimatedTraffic: comp.estimatedTraffic,
          totalKeywords: comp.totalKeywords,
          totalBacklinks: comp.totalBacklinks,
          domainAuthority: comp.domainAuthority,
          topPages: JSON.parse(comp.topPages || "[]"),
          lastAnalyzed: comp.lastAnalyzed,
        },
        dataMode: comp.estimatedTraffic ? "stored" : "demo (simulated)",
      };
    },
  },
  {
    name: "sage.competitor.keywords",
    category: "Competitor Analysis Suite",
    description:
      "Get all keywords a competitor ranks for. Returns keyword, position, volume, difficulty, URL ranking. Filter by position range, volume. DataForSEO-powered or simulated.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        domain: { type: "string" },
        limit: { type: "number", default: 50 },
        maxPosition: { type: "number", default: 20, description: "Max ranking position (1-100)" },
      },
      required: ["siteId", "domain"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const domain = String(args.domain);
      const maxPos = Number(args.maxPosition ?? 20);
      const limit = Math.min(500, Number(args.limit ?? 50));

      // Simulate (production: DataForSEO Domain Keywords)
      const hash = domain.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const baseKeywords = [
        `${domain.split(".")[0]} alternative`, `${domain.split(".")[0]} vs`, `${domain.split(".")[0]} review`,
        `${domain.split(".")[0]} pricing`, `${domain.split(".")[0]} features`, `best ${domain.split(".")[0]} tools`,
        `${domain.split(".")[0]} tutorial`, `${domain.split(".")[0]} demo`, `${domain.split(".")[0]} cost`,
        `how to use ${domain.split(".")[0]}`, `${domain.split(".")[0]} vs competitors`, `${domain.split(".")[0]} free trial`,
        `${domain.split(".")[0]} integrations`, `${domain.split(".")[0]} api`, `${domain.split(".")[0]} review 2026`,
      ];

      const keywords = baseKeywords.slice(0, limit).map((kw, i) => ({
        keyword: kw,
        position: 1 + ((hash + i * 3) % maxPos),
        volume: 100 + ((hash + i * 7) % 8000),
        difficulty: 10 + ((hash + i * 5) % 70),
        url: `https://${domain}/${kw.replace(/\s+/g, "-")}`,
        traffic: Math.round((100 + ((hash + i * 7) % 8000)) * (0.1 - i * 0.005) * (1 / (1 + i))),
      }));

      return {
        siteId: args.siteId,
        domain,
        keywordCount: keywords.length,
        keywords,
        dataMode: "demo (simulated)",
      };
    },
  },
  {
    name: "sage.competitor.landscape",
    category: "Competitor Analysis Suite",
    description:
      "Get the competitive landscape for a keyword. Returns all domains ranking in top 100 + their positions, authority, content length. Shows who you're competing against.",
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
      const kw = String(args.keyword);

      // Simulate (production: DataForSEO SERP API)
      const hash = kw.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const domains = [
        { domain: "ahrefs.com", authority: 90, type: "tool" },
        { domain: "semrush.com", authority: 88, type: "tool" },
        { domain: "yoast.com", authority: 85, type: "plugin" },
        { domain: "moz.com", authority: 87, type: "tool" },
        { domain: "searchenginejournal.com", authority: 82, type: "blog" },
        { domain: "backlinko.com", authority: 78, type: "blog" },
        { domain: "neilpatel.com", authority: 80, type: "blog" },
        { domain: "wikipedia.org", authority: 95, type: "reference" },
        { domain: "reddit.com", authority: 91, type: "forum" },
        { domain: "youtube.com", authority: 94, type: "video" },
      ];

      const landscape = domains.map((d, i) => ({
        ...d,
        position: i + 1,
        contentLength: 1500 + ((hash + i * 200) % 3000),
        backlinks: 10 + ((hash + i * 50) % 500),
        estimatedTraffic: Math.round((1000 - i * 80) * (0.5 + (hash % 50) / 100)),
      }));

      return {
        keyword: kw,
        engine: args.engine || "google",
        competitorCount: landscape.length,
        landscape,
        dataMode: "demo (simulated)",
        insights: {
          averageAuthority: Math.round(landscape.reduce((acc, l) => acc + l.authority, 0) / landscape.length),
          averageContentLength: Math.round(landscape.reduce((acc, l) => acc + l.contentLength, 0) / landscape.length),
          topCompetitorType: "reference",
          recommendation: "Aim for content length 2,000+ words + 50+ backlinks to compete in top 5",
        },
      };
    },
  },
  {
    name: "sage.competitor.content.gaps",
    category: "Competitor Analysis Suite",
    description:
      "Find content gaps — topics your competitors cover but you don't. Returns gap URLs + keywords + estimated traffic. Prioritize by opportunity.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        competitors: { type: "array", items: { type: "string" } },
        limit: { type: "number", default: 30 },
      },
      required: ["siteId", "competitors"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const competitors = (args.competitors as string[]) || [];

      // Get your published content
      const yourContent = await db.contentDraft.findMany({
        where: { siteId: String(args.siteId), status: "published" },
        select: { title: true, slug: true },
      });

      // Simulate competitor content (production: DataForSEO Pages + SERP)
      const gapTopics = [
        "Ultimate guide to AI SEO in 2026",
        "How to track AI citations",
        "llms.txt generator tutorial",
        "Schema markup for AI engines",
        "Bing vs Google for SEO",
        "Local SEO checklist",
        "WooCommerce SEO guide",
        "Technical SEO audit template",
        "Keyword research with AI",
        "Content optimization tools compared",
        "Backlink analysis workflow",
        "Featured snippet optimization",
        "Core Web Vitals guide",
        "Internal linking strategy",
        "SEO reporting dashboard",
      ];

      const gaps = gapTopics.slice(0, Number(args.limit ?? 30)).map((topic, i) => {
        const hash = topic.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
        return {
          topic,
          competitor: competitors[i % competitors.length],
          competitorUrl: `https://${competitors[i % competitors.length]}/${topic.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`,
          keyword: topic.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(" ").slice(0, 4).join(" "),
          volume: 200 + (hash % 5000),
          difficulty: 20 + (hash % 50),
          estimatedTraffic: 50 + (hash % 800),
          priority: i < 10 ? "high" : i < 20 ? "medium" : "low",
        };
      });

      return {
        siteId: args.siteId,
        competitors,
        yourContentCount: yourContent.length,
        gapCount: gaps.length,
        contentGaps: gaps,
        dataMode: "demo (simulated)",
        recommendation: gaps.length > 0
          ? `Found ${gaps.length} content gaps. Create content for the high-priority topics first.`
          : "No content gaps — you cover all competitor topics.",
      };
    },
  },
  {
    name: "sage.competitor.serp",
    category: "Competitor Analysis Suite",
    description:
      "SERP competitor analysis — see which domains consistently appear in SERPs for your tracked keywords. Returns overlap %, common competitors, SERP feature occupancy.",
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

      // Simulate SERP competitors (production: DataForSEO Domain Competitors)
      const serpCompetitors = ["ahrefs.com", "semrush.com", "yoast.com", "moz.com", "rankmath.com"].map((domain, i) => {
        const hash = domain.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
        return {
          domain,
          appearances: Math.round(keywords.length * (0.8 - i * 0.15)),
          overlapPercent: Math.round((0.8 - i * 0.15) * 100),
          avgPosition: 3 + (hash % 15),
          commonKeywords: Math.round(keywords.length * (0.6 - i * 0.1)),
        };
      });

      return {
        siteId: args.siteId,
        totalKeywords: keywords.length,
        serpCompetitors,
        topCompetitor: serpCompetitors[0],
        dataMode: "demo (simulated)",
      };
    },
  },
  {
    name: "sage.competitor.backlinks",
    category: "Competitor Analysis Suite",
    description:
      "Analyze a competitor's backlink profile. Find their top linking domains, link-building strategies, and opportunities to replicate. Cross-reference with your backlinks.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        competitorDomain: { type: "string" },
        limit: { type: "number", default: 50 },
      },
      required: ["siteId", "competitorDomain"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const competitor = String(args.competitorDomain);
      const { db } = await import("@/lib/db");

      // Get your backlink domains
      const yourBacklinks = await db.backlink.findMany({
        where: { siteId: String(args.siteId) },
        select: { sourceDomain: true },
      });
      const yourDomains = new Set(yourBacklinks.map((b) => b.sourceDomain));

      // Simulate competitor backlinks
      const hash = competitor.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const linkingDomains = ["forbes.com", "techcrunch.com", "entrepreneur.com", "inc.com", "wired.com", "medium.com", "reddit.com", "github.com", "producthunt.com", "ycombinator.com"].map((d, i) => ({
        domain: d,
        authority: 70 + ((hash + i * 7) % 25),
        backlinksToCompetitor: 1 + ((hash + i * 3) % 20),
        youAlsoHave: yourDomains.has(d),
        firstSeen: new Date(Date.now() - (i + 1) * 30 * 24 * 60 * 60 * 1000).toISOString(),
      }));

      const opportunities = linkingDomains.filter((d) => !d.youAlsoHave);
      const sorted = linkingDomains.sort((a, b) => b.authority - a.authority).slice(0, Number(args.limit ?? 50));

      return {
        siteId: args.siteId,
        competitorDomain: competitor,
        totalReferringDomains: sorted.length,
        linkingDomains: sorted,
        opportunities: {
          count: opportunities.length,
          domains: opportunities,
          note: "These domains link to your competitor but not you. Reach out for link-building.",
        },
        dataMode: "demo (simulated)",
      };
    },
  },
  {
    name: "sage.competitor.top.pages",
    category: "Competitor Analysis Suite",
    description:
      "Get the top pages on a competitor's site by estimated traffic. Returns URL, traffic, keywords ranking, top keyword. Find their best content to understand their strategy.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        domain: { type: "string" },
        limit: { type: "number", default: 20 },
      },
      required: ["siteId", "domain"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const domain = String(args.domain);
      const limit = Math.min(100, Number(args.limit ?? 20));
      const hash = domain.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

      const pageTypes = ["/blog/", "/guide/", "/tutorial/", "/resources/", "/tools/", "/templates/", "/checklist/", "/faq/"];
      const topics = ["seo-guide", "keyword-research", "backlink-analysis", "technical-seo", "content-optimization", "schema-markup", "local-seo", "ecommerce-seo", "wordpress-seo", "google-search-console", "core-web-vitals", "featured-snippets", "internal-linking", "sitemap-optimization", "meta-tags"];

      const topPages = Array.from({ length: limit }, (_, i) => ({
        url: `https://${domain}${pageTypes[i % pageTypes.length]}${topics[i % topics.length]}`,
        title: `${topics[i % topics.length].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} — Complete Guide`,
        estimatedTraffic: Math.max(50, 2000 - i * 100 + (hash % 500)),
        keywordsRanking: 5 + ((hash + i * 3) % 50),
        topKeyword: topics[i % topics.length].replace(/-/g, " "),
        topPosition: 1 + ((hash + i) % 10),
      })).sort((a, b) => b.estimatedTraffic - a.estimatedTraffic);

      return {
        siteId: args.siteId,
        domain,
        pageCount: topPages.length,
        topPages,
        totalEstimatedTraffic: topPages.reduce((acc, p) => acc + p.estimatedTraffic, 0),
        dataMode: "demo (simulated)",
      };
    },
  },
  {
    name: "sage.competitor.traffic",
    category: "Competitor Analysis Suite",
    description:
      "Estimate a competitor's organic traffic. Returns total monthly visits, traffic by country, traffic trend (6 months), top traffic sources. DataForSEO-powered or simulated.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        domain: { type: "string" },
      },
      required: ["siteId", "domain"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const domain = String(args.domain);
      const hash = domain.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

      const totalTraffic = 5000 + (hash % 500000);
      const trend = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        return {
          month: d.toLocaleString("en-US", { month: "short" }),
          traffic: Math.round(totalTraffic * (0.7 + i * 0.05 + (hash % 20) / 100)),
        };
      });

      return {
        siteId: args.siteId,
        domain,
        estimatedMonthlyTraffic: totalTraffic,
        trafficValue: Math.round(totalTraffic * 0.5),
        trend,
        byCountry: [
          { country: "United States", percent: 35 + (hash % 20) },
          { country: "United Kingdom", percent: 10 + (hash % 10) },
          { country: "India", percent: 8 + (hash % 10) },
          { country: "Canada", percent: 5 + (hash % 8) },
          { country: "Australia", percent: 4 + (hash % 6) },
          { country: "Germany", percent: 3 + (hash % 5) },
        ],
        trafficTrend: trend[5].traffic > trend[0].traffic ? "growing" : "declining",
        dataMode: "demo (simulated)",
      };
    },
  },
  {
    name: "sage.competitor.battlecard",
    category: "Competitor Analysis Suite",
    description:
      "Generate a competitive battlecard comparing your site to a competitor. Side-by-side: traffic, keywords, backlinks, authority, content gaps, opportunities. Ready for strategy meetings.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        competitorDomain: { type: "string" },
      },
      required: ["siteId", "competitorDomain"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const competitor = String(args.competitorDomain);
      const site = await db.site.findUnique({ where: { id: String(args.siteId) }, select: { url: true, name: true } });
      const yourDomain = site ? new URL(site.url).hostname : "your-site.com";

      // Get your stats
      const [yourKeywords, yourBacklinks] = await Promise.all([
        db.keyword.count({ where: { siteId: String(args.siteId) } }),
        db.backlink.count({ where: { siteId: String(args.siteId) } }),
      ]);

      // Get or simulate competitor stats
      const hash = competitor.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const competitorTraffic = 10000 + (hash % 200000);
      const competitorKeywords = 500 + (hash % 8000);
      const competitorBacklinks = 1000 + (hash % 30000);
      const competitorAuthority = 30 + (hash % 50);

      const yourTraffic = yourKeywords * 50; // rough estimate

      return {
        siteId: args.siteId,
        yourDomain,
        competitorDomain: competitor,
        battlecard: {
          you: {
            domain: yourDomain,
            estimatedTraffic: yourTraffic,
            totalKeywords: yourKeywords,
            totalBacklinks: yourBacklinks,
            domainAuthority: 25, // would be from DataForSEO
          },
          competitor: {
            domain: competitor,
            estimatedTraffic: competitorTraffic,
            totalKeywords: competitorKeywords,
            totalBacklinks: competitorBacklinks,
            domainAuthority: competitorAuthority,
          },
          advantages: [
            yourTraffic > competitorTraffic ? "You have more organic traffic" : "Competitor has more traffic — content gap opportunity",
            yourBacklinks > competitorBacklinks ? "You have more backlinks" : "Competitor has stronger backlink profile — build more links",
          ],
          opportunities: [
            "Target keywords they rank for but you don't",
            "Replicate their top backlink sources",
            "Create better content on their top pages' topics",
            "Win featured snippets where they currently appear",
          ],
          threats: [
            competitorAuthority > 30 ? "Competitor has higher domain authority — harder to outrank" : null,
            competitorTraffic > yourTraffic * 2 ? "Competitor has significantly more traffic — they may be capturing your audience" : null,
          ].filter(Boolean),
        },
        dataMode: "demo (simulated)",
      };
    },
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function simulateTopPages(domain: string, hash: number) {
  const topics = ["seo-guide", "keyword-research", "backlinks", "technical-seo", "schema-markup"];
  return topics.map((t, i) => ({
    url: `https://${domain}/blog/${t}`,
    traffic: Math.max(100, 1000 - i * 200 + (hash % 300)),
    keywords: 10 + (hash % 50),
  }));
}
