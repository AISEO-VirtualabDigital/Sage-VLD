/**
 * Sage seed script — generates demo data for the local dev database.
 * Run with: bun run db:seed
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Sage database...");

  // Wipe (order matters for FK constraints)
  await db.change.deleteMany();
  await db.citation.deleteMany();
  await db.competitor.deleteMany();
  await db.auditFinding.deleteMany();
  await db.auditRun.deleteMany();
  await db.ranking.deleteMany();
  await db.keyword.deleteMany();
  await db.contentDraft.deleteMany();
  await db.brandBrainFile.deleteMany();
  await db.brandBrain.deleteMany();
  await db.site.deleteMany();
  await db.account.deleteMany();
  await db.user.deleteMany();

  // ─── User ──────────────────────────────────────────────────────────────
  const user = await db.user.create({
    data: {
      email: "demo@sage.virtualab.digital",
      name: "Demo User",
      role: "admin",
      byokDataForseoKey: "demo_dfseo_key_xxx",
      byokLlmProvider: "openai",
      byokLlmKey: "demo_openai_key_xxx",
    },
  });
  console.log(`  ✓ User: ${user.email}`);

  // ─── Sites ─────────────────────────────────────────────────────────────
  const site1 = await db.site.create({
    data: {
      userId: user.id,
      url: "https://acme-labs.example",
      name: "Acme Labs",
      verified: true,
      cmsType: "nextjs",
    },
  });
  const site2 = await db.site.create({
    data: {
      userId: user.id,
      url: "https://northgate-seo.example",
      name: "Northgate SEO Agency",
      verified: true,
      cmsType: "wordpress",
    },
  });
  console.log(`  ✓ Sites: ${site1.name}, ${site2.name}`);

  // ─── Keywords + Rankings (Google + Bing, 7-day history) ────────────────
  const keywordsData = [
    { term: "ai seo platform", intent: "commercial", volume: 8100, cluster: "ai-seo" },
    { term: "geo tracking tool", intent: "commercial", volume: 2400, cluster: "geo" },
    { term: "llms.txt generator", intent: "informational", volume: 1900, cluster: "geo" },
    { term: "ai content seo", intent: "informational", volume: 12100, cluster: "ai-seo" },
    { term: "schema markup ai", intent: "informational", volume: 3600, cluster: "schema" },
    { term: "mcp server seo", intent: "transactional", volume: 880, cluster: "mcp" },
    { term: "byok dataforseo", intent: "transactional", volume: 420, cluster: "pricing" },
    { term: "bing rank tracker", intent: "commercial", volume: 1800, cluster: "rank-tracking" },
    { term: "eeat scorer", intent: "informational", volume: 720, cluster: "content" },
    { term: "brand brain seo", intent: "informational", volume: 540, cluster: "content" },
  ];

  for (const k of keywordsData) {
    const keyword = await db.keyword.create({
      data: { ...k, siteId: site1.id, country: "us", device: "desktop" },
    });

    // 7 days of rankings × 2 engines (Google + Bing)
    const today = new Date();
    for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
      const checkedAt = new Date(today);
      checkedAt.setDate(today.getDate() - dayOffset);
      checkedAt.setHours(8, 0, 0, 0);

      // Simulate position climbing over the week
      const baseGoogle = Math.max(1, 12 - (6 - dayOffset) * 1.5 + Math.random() * 2);
      const baseBing = Math.max(1, 18 - (6 - dayOffset) * 1.2 + Math.random() * 2);

      await db.ranking.create({
        data: {
          keywordId: keyword.id,
          engine: "google",
          position: Math.round(baseGoogle),
          serpFeatures: dayOffset < 3 ? '["featured_snippet"]' : null,
          checkedAt,
        },
      });
      await db.ranking.create({
        data: {
          keywordId: keyword.id,
          engine: "bing",
          position: Math.round(baseBing),
          serpFeatures: null,
          checkedAt,
        },
      });
    }
  }
  console.log(`  ✓ 10 keywords × 7 days × 2 engines = 140 rankings`);

  // ─── Content Drafts (1 of each type) ───────────────────────────────────
  await db.contentDraft.create({
    data: {
      siteId: site1.id,
      type: "home",
      title: "Acme Labs — AI-Native SEO Platform",
      slug: "/",
      body: "# Stop selling dashboards. Start shipping rankings.\n\nMeet Acme Labs — the AI-Visibility-first, agent-native SEO platform...",
      eeatScore: 94,
      seoScore: 91,
      gapScore: 88,
      humanized: true,
      status: "published",
      publishedUrl: "https://acme-labs.example/",
    },
  });
  await db.contentDraft.create({
    data: {
      siteId: site1.id,
      type: "services",
      title: "AI SEO Services — Built for Agencies Scaling 10–100 Sites",
      slug: "/services/ai-seo",
      body: "## What we do\n\nWe run AI-Visibility-first SEO at agency scale...",
      eeatScore: 89,
      seoScore: 87,
      gapScore: 84,
      humanized: true,
      status: "published",
      publishedUrl: "https://acme-labs.example/services/ai-seo",
    },
  });
  await db.contentDraft.create({
    data: {
      siteId: site1.id,
      type: "blog",
      title: "The 2026 Guide to AI-Visibility (GEO) — From llms.txt to NLWeb",
      slug: "/blog/ai-visibility-geo-2026",
      body: "# The 2026 Guide to AI-Visibility (GEO)\n\nSEO is no longer about keyword stuffing...",
      eeatScore: 96,
      seoScore: 93,
      gapScore: 91,
      humanized: true,
      status: "reviewing",
    },
  });
  console.log(`  ✓ 3 content drafts (home, services, blog)`);

  // ─── Audit Run + Findings ──────────────────────────────────────────────
  const auditRun = await db.auditRun.create({
    data: {
      siteId: site1.id,
      score: 94,
      pagesCrawled: 142,
      status: "completed",
      startedAt: new Date(Date.now() - 1000 * 60 * 5),
      completedAt: new Date(Date.now() - 1000 * 60 * 4),
    },
  });

  const findings = [
    { category: "meta", severity: "pass", label: "Title tags optimized", pageCount: 142, autoFixAvailable: false },
    { category: "meta", severity: "fail", label: "Missing meta descriptions", pageCount: 7, autoFixAvailable: true },
    { category: "schema", severity: "pass", label: "Schema markup valid", pageCount: 96, autoFixAvailable: false },
    { category: "cwv", severity: "pass", label: "Core Web Vitals (good)", pageCount: 88, autoFixAvailable: false },
    { category: "broken-links", severity: "warn", label: "Broken internal links", pageCount: 3, autoFixAvailable: true },
    { category: "meta", severity: "fail", label: "Image alt text missing", pageCount: 12, autoFixAvailable: true },
    { category: "render", severity: "pass", label: "JS/SSR rendering checks", pageCount: 142, autoFixAvailable: false },
    { category: "duplicate-content", severity: "warn", label: "Near-duplicate content", pageCount: 4, autoFixAvailable: false },
  ];
  for (const f of findings) {
    await db.auditFinding.create({ data: { ...f, auditRunId: auditRun.id } });
  }
  console.log(`  ✓ Audit run #${auditRun.id.slice(-6)} with ${findings.length} findings (score 94)`);

  // ─── AI Citations (5 engines × 4 queries each) ─────────────────────────
  const engines = ["chatgpt", "perplexity", "google-aio", "searchgpt", "claude"];
  const queries = [
    "best ai seo platform 2026",
    "what is geo tracking",
    "how to track bing rankings",
    "ai visibility tools",
  ];
  const visibilityByEngine: Record<string, number> = {
    chatgpt: 68,
    perplexity: 54,
    "google-aio": 41,
    searchgpt: 28,
    claude: 22,
  };

  for (const engine of engines) {
    for (const query of queries) {
      const cited = Math.random() * 100 < visibilityByEngine[engine];
      await db.citation.create({
        data: {
          siteId: site1.id,
          engine,
          query,
          cited,
          citationText: cited ? `According to Acme Labs, ${query}...` : null,
          citationUrl: cited ? "https://acme-labs.example/blog/" + query.replace(/\s+/g, "-") : null,
          competitorCited: cited ? null : ["ahrefs.com", "semrush.com", "yoast.com"][Math.floor(Math.random() * 3)],
          checkedAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 3),
        },
      });
    }
  }
  console.log(`  ✓ ${engines.length * queries.length} AI citation checks across 5 engines`);

  // ─── Brand Brain ───────────────────────────────────────────────────────
  const brandBrain = await db.brandBrain.create({
    data: {
      siteId: site1.id,
      voiceDoc: "Confident + technical. We speak like engineers talking to engineers — direct, data-backed, no fluff. Avoid marketing-speak and superlatives. Use 'we' for company voice, 'you' for the reader.",
      styleGuide: "Use em-dashes sparingly (never more than 1 per paragraph). Sentence length: 12–22 words avg. Always include a concrete metric or example. H2s in Title Case. Code in inline mono.",
      bannedPhrases: JSON.stringify(["leverage", "synergy", "game-changer", "revolutionary", "cutting-edge", "state-of-the-art", "moreover", "in conclusion", "it's worth noting"]),
      glossary: JSON.stringify({
        GEO: "Generative Engine Optimization — the practice of optimizing content for AI engines to cite",
        BYOK: "Bring Your Own Key — user supplies their own API credentials",
        MCP: "Model Context Protocol — open standard for AI agents to call external tools",
        NLWeb: "Schema-graph aggregation format proposed for AI-citable content",
      }),
      internalLinkMap: JSON.stringify({
        "/": ["/services/ai-seo", "/blog/ai-visibility-geo-2026", "/pricing"],
        "/blog/ai-visibility-geo-2026": ["/services/ai-seo", "/blog/llms-txt-guide"],
      }),
      version: 3,
    },
  });
  await db.brandBrainFile.createMany({
    data: [
      { brandBrainId: brandBrain.id, filename: "voice.md", type: "voice", content: brandBrain.voiceDoc || "" },
      { brandBrainId: brandBrain.id, filename: "style.md", type: "style", content: brandBrain.styleGuide || "" },
      { brandBrainId: brandBrain.id, filename: "banned-phrases.json", type: "banned", content: brandBrain.bannedPhrases || "[]" },
      { brandBrainId: brandBrain.id, filename: "glossary.json", type: "glossary", content: brandBrain.glossary || "{}" },
      { brandBrainId: brandBrain.id, filename: "example-good-blog.md", type: "example", content: "# Example good blog post\n\nThis is what a Sage-generated post should sound like." },
    ],
  });
  console.log(`  ✓ Brand Brain v3 with 5 files`);

  // ─── SEO Version Control changes ───────────────────────────────────────
  await db.change.create({
    data: {
      siteId: site1.id,
      url: "/",
      field: "title",
      before: "Acme Labs — Home",
      after: "Acme Labs — AI-Native SEO Platform for Agencies",
      impactRankingDelta: -4,
      impactTrafficDelta: 320,
    },
  });
  await db.change.create({
    data: {
      siteId: site1.id,
      url: "/services/ai-seo",
      field: "schema",
      before: '{"@type":"Service"}',
      after: '{"@type":"Service","@id":"#service","provider":{"@type":"Organization"}}',
      impactRankingDelta: -2,
      impactTrafficDelta: 110,
    },
  });
  await db.change.create({
    data: {
      siteId: site1.id,
      url: "/blog/ai-visibility-geo-2026",
      field: "content",
      before: "[previous draft, 1,400 words]",
      after: "[AI-generated draft, 2,400 words, E-E-A-T 96, gap 91]",
      impactRankingDelta: -7,
      impactTrafficDelta: 580,
    },
  });
  console.log(`  ✓ 3 SEO version-control changes`);

  // ─── Competitors (for AI Battlecards) ──────────────────────────────────
  await db.competitor.create({
    data: {
      siteId: site1.id,
      domain: "ahrefs.com",
      aiSovPercent: 71,
      googleSovPercent: 64,
      bingSovPercent: 58,
      notes: "Strong in 'backlink' and 'rank tracking' queries. Weak in GEO / AI-visibility.",
    },
  });
  await db.competitor.create({
    data: {
      siteId: site1.id,
      domain: "semrush.com",
      aiSovPercent: 68,
      googleSovPercent: 71,
      bingSovPercent: 55,
      notes: "Dominates 'keyword research' queries. No MCP server. No BYOK option.",
    },
  });
  console.log(`  ✓ 2 competitors for AI Battlecards`);

  console.log("\n✅ Seed complete. Demo login: demo@sage.virtualab.digital");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
