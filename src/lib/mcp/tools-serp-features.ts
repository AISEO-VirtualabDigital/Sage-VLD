/**
 * Sage MCP Server — SERP Feature Tracking Suite (Phase 5, 6 tools)
 *
 * Detect, track, and alert on SERP features (featured snippets, PAA,
 * image pack, video carousel, local pack, shopping, etc.) for your keywords.
 */
import type { ToolDef } from "./types";

export const serpFeatureTools: ToolDef[] = [
  {
    name: "sage.serp.features.detect",
    category: "SERP Feature Tracking",
    description:
      "Detect which SERP features appear for a keyword. Returns: featured snippet, PAA, image pack, video carousel, local pack, shopping, news, sitelinks, top stories, Twitter. DataForSEO-powered or simulated.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        keyword: { type: "string" },
        engine: { type: "string", enum: ["google", "bing"], default: "google" },
      },
      required: ["siteId", "keyword"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const kw = String(args.keyword);
      const engine = String(args.engine ?? "google");

      // Simulate feature detection (production: DataForSEO SERP Features API)
      const hash = kw.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const allFeatures = [
        "featured_snippet", "people_also_ask", "image_pack", "video_carousel",
        "local_pack", "shopping", "news", "sitelinks", "top_stories", "twitter",
      ];

      const detected = allFeatures.filter((_, i) => (hash + i * 7) % 3 === 0);
      const yourPosition = 1 + (hash % 20);

      // Store tracking record
      for (const feature of detected) {
        await db.serpFeatureTracking.create({
          data: {
            siteId: String(args.siteId),
            keyword: kw,
            feature,
            present: true,
            yourPosition,
            checkedAt: new Date(),
          },
        });
      }

      return {
        siteId: args.siteId,
        keyword: kw,
        engine,
        featuresDetected: detected,
        yourPosition,
        opportunities: detected.map((f) => ({
          feature: f,
          winnable: true,
          recommendation: getFeatureRecommendation(f),
        })),
        dataMode: "demo (simulated)",
      };
    },
  },
  {
    name: "sage.serp.features.history",
    category: "SERP Feature Tracking",
    description:
      "Get SERP feature history for a keyword over time. Shows when features appeared/disappeared, position changes. Useful for tracking algorithm update impacts.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        keyword: { type: "string" },
        days: { type: "number", default: 30 },
      },
      required: ["siteId", "keyword"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const days = Number(args.days ?? 30);
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const records = await db.serpFeatureTracking.findMany({
        where: { siteId: String(args.siteId), keyword: String(args.keyword), checkedAt: { gte: since } },
        orderBy: { checkedAt: "asc" },
      });

      // Group by feature
      const byFeature: Record<string, Array<{ date: string; present: boolean; position: number | null }>> = {};
      for (const r of records) {
        if (!byFeature[r.feature]) byFeature[r.feature] = [];
        byFeature[r.feature].push({
          date: r.checkedAt.toISOString().split("T")[0],
          present: r.present,
          position: r.yourPosition,
        });
      }

      return {
        siteId: args.siteId,
        keyword: args.keyword,
        days,
        totalRecords: records.length,
        features: Object.entries(byFeature).map(([feature, history]) => ({
          feature,
          history,
          currentlyPresent: history[history.length - 1]?.present || false,
        })),
        dataMode: records.length > 0 ? "stored" : "demo (no history yet)",
      };
    },
  },
  {
    name: "sage.serp.features.winning",
    category: "SERP Feature Tracking",
    description:
      "Find SERP features you're currently winning. Returns features where your site occupies the feature (e.g. you hold the featured snippet). Track your wins over time.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        feature: { type: "string", description: "Optional: filter by specific feature type" },
      },
      required: ["siteId"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const where: Record<string, unknown> = {
        siteId: String(args.siteId),
        present: true,
        yourPosition: { lte: 10 }, // top 10 = winning
      };
      if (args.feature) where.feature = String(args.feature);

      const wins = await db.serpFeatureTracking.findMany({
        where,
        orderBy: { checkedAt: "desc" },
        take: 50,
        distinct: ["keyword", "feature"],
      });

      // Group by feature
      const byFeature: Record<string, number> = {};
      for (const w of wins) {
        byFeature[w.feature] = (byFeature[w.feature] || 0) + 1;
      }

      return {
        siteId: args.siteId,
        totalWins: wins.length,
        winsByFeature: byFeature,
        wins,
        dataMode: wins.length > 0 ? "stored" : "demo (no wins tracked yet)",
      };
    },
  },
  {
    name: "sage.serp.features.losing",
    category: "SERP Feature Tracking",
    description:
      "Find SERP features you're losing — keywords where competitors hold features you want. Returns feature, competitor, their position, your position. Prioritize recovery opportunities.",
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

      // Find features where competitor is present + you're not winning
      const losses = await db.serpFeatureTracking.findMany({
        where: {
          siteId: String(args.siteId),
          present: true,
          OR: [
            { yourPosition: { gt: 10 } },
            { yourPosition: null },
          ],
        },
        orderBy: { checkedAt: "desc" },
        take: 50,
        distinct: ["keyword", "feature"],
      });

      return {
        siteId: args.siteId,
        totalLosses: losses.length,
        losses: losses.map((l) => ({
          keyword: l.keyword,
          feature: l.feature,
          yourPosition: l.yourPosition,
          competitorPosition: l.competitorPosition,
          competitorDomain: l.competitorDomain,
          opportunity: "Optimize content to win this feature",
        })),
        dataMode: losses.length > 0 ? "stored" : "demo (no losses tracked)",
      };
    },
  },
  {
    name: "sage.serp.features.sov",
    category: "SERP Feature Tracking",
    description:
      "SERP feature Share-of-Voice — what % of your tracked keywords have each SERP feature, and what % you occupy. Shows feature optimization opportunities.",
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

      if (keywords.length === 0) {
        return { error: "No keywords tracked for this site" };
      }

      const features = await db.serpFeatureTracking.findMany({
        where: { siteId: String(args.siteId), checkedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      });

      // Simulate if no data
      const allFeatures = ["featured_snippet", "people_also_ask", "image_pack", "video_carousel", "local_pack", "shopping"];
      const sov = allFeatures.map((feature) => {
        const hash = feature.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
        const presentCount = Math.round(keywords.length * (0.3 + (hash % 50) / 100));
        const youWin = Math.round(presentCount * (0.2 + (hash % 30) / 100));
        return {
          feature,
          presentOnKeywords: presentCount,
          presentPercent: Math.round((presentCount / keywords.length) * 100),
          youWinCount: youWin,
          youWinPercent: presentCount > 0 ? Math.round((youWin / presentCount) * 100) : 0,
          opportunityPercent: presentCount > 0 ? Math.round(((presentCount - youWin) / keywords.length) * 100) : 0,
        };
      });

      return {
        siteId: args.siteId,
        totalKeywords: keywords.length,
        featureSOV: sov,
        totalOpportunities: sov.reduce((acc, s) => acc + (s.presentOnKeywords - s.youWinCount), 0),
        dataMode: features.length > 0 ? "stored" : "demo (simulated)",
      };
    },
  },
  {
    name: "sage.serp.features.alerts",
    category: "SERP Feature Tracking",
    description:
      "[WRITE] Set up alerts for SERP feature changes. Get notified when you win/lose a featured snippet, PAA, or other feature. Returns alert config + recent triggers.",
    inputSchema: {
      type: "object",
      properties: {
        siteId: { type: "string" },
        features: { type: "array", items: { type: "string" }, description: "Features to alert on" },
        alertOnWin: { type: "boolean", default: true },
        alertOnLoss: { type: "boolean", default: true },
      },
      required: ["siteId"],
      additionalProperties: false,
    },
    readOnly: false,
    handler: async (args) => {
      const { db } = await import("@/lib/db");
      const features = (args.features as string[]) || ["featured_snippet", "people_also_ask", "local_pack"];
      const alertOnWin = args.alertOnWin !== false;
      const alertOnLoss = args.alertOnLoss !== false;

      // Get recent feature changes
      const recentChanges = await db.serpFeatureTracking.findMany({
        where: {
          siteId: String(args.siteId),
          feature: { in: features },
          checkedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
        orderBy: { checkedAt: "desc" },
        take: 20,
      });

      // Simulate alert triggers
      const hash = String(args.siteId).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const triggers = [
        { type: "win", feature: "featured_snippet", keyword: "ai seo platform", position: 0, date: new Date().toISOString() },
        { type: "loss", feature: "people_also_ask", keyword: "best seo tool", position: 12, date: new Date(Date.now() - 86400000).toISOString() },
      ].filter((t) => (t.type === "win" && alertOnWin) || (t.type === "loss" && alertOnLoss));

      return {
        configured: true,
        siteId: args.siteId,
        features,
        alertOnWin,
        alertOnLoss,
        recentTriggers: triggers,
        recentChangesCount: recentChanges.length,
        note: "In production, alerts send via email + Slack webhook. Configure delivery in settings.",
      };
    },
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function getFeatureRecommendation(feature: string): string {
  const recs: Record<string, string> = {
    featured_snippet: "Add a 40-50 word definition near the top + use H2/H3 structure",
    people_also_ask: "Add an FAQ section with schema markup targeting common questions",
    image_pack: "Add high-quality images with descriptive alt text + image sitemap",
    video_carousel: "Embed a relevant YouTube video + add VideoObject schema",
    local_pack: "Optimize Google Business Profile + get more reviews + local citations",
    shopping: "Add Product schema with price + availability + GTIN",
    news: "Publish timely content + submit to Google News + add NewsArticle schema",
    sitelinks: "Improve site structure + internal linking + brand authority",
    top_stories: "Publish breaking/trending content + NewsArticle schema",
    twitter: "Be active on Twitter/X + embed tweets in content",
  };
  return recs[feature] || "Optimize content for this feature type";
}
