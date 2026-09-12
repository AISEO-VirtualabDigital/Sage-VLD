/**
 * Sage — LLM Client (OpenAI / Anthropic)
 *
 * Handles all AI content generation calls. Supports BYOK — users can bring
 * their own OpenAI or Anthropic API key, or use the platform's pooled key
 * (billed at wholesale LLM cost via CreditLedger).
 *
 * When no keys are available (demo mode), falls back to template-based
 * generation so the content pipeline remains functional.
 *
 * The generated content ALWAYS runs through the De-AI humanizer + E-E-A-T
 * scorer regardless of which LLM produced it.
 */
import { WHOLESALE_RATES } from "@/lib/billing";

export type LLMProvider = "openai" | "anthropic" | "demo";

export type LLMConfig = {
  provider: LLMProvider;
  apiKey: string;
  model?: string;
};

export type GenerateOptions = {
  type: "home" | "services" | "blog";
  targetKeyword: string;
  brandVoice?: string;
  styleGuide?: string;
  glossary?: Record<string, string>;
  serviceName?: string;
  location?: string;
  title?: string;
  siteName: string;
  siteUrl: string;
  expectedTopics?: string[];
};

export type GenerateResult = {
  content: string;
  provider: LLMProvider;
  model: string;
  inputTokens: number;
  outputTokens: number;
  costCents: number;
};

/**
 * Resolve LLM credentials for a user.
 * Priority: user BYOK → platform pooled keys → demo fallback.
 */
export async function resolveLLMConfig(userId?: string): Promise<{
  config: LLMConfig | null;
  byok: boolean;
  demo: boolean;
}> {
  // 1. Check user BYOK keys
  if (userId) {
    const { db } = await import("@/lib/db");
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { byokLlmProvider: true, byokLlmKey: true },
    });
    if (user?.byokLlmProvider && user?.byokLlmKey) {
      return {
        config: {
          provider: user.byokLlmProvider as LLMProvider,
          apiKey: user.byokLlmKey,
          model: user.byokLlmProvider === "openai" ? "gpt-4o" : "claude-3-5-sonnet-20241022",
        },
        byok: true,
        demo: false,
      };
    }
  }

  // 2. Platform pooled keys
  if (process.env.OPENAI_API_KEY) {
    return {
      config: { provider: "openai", apiKey: process.env.OPENAI_API_KEY, model: "gpt-4o" },
      byok: false,
      demo: false,
    };
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return {
      config: { provider: "anthropic", apiKey: process.env.ANTHROPIC_API_KEY, model: "claude-3-5-sonnet-20241022" },
      byok: false,
      demo: false,
    };
  }

  // 3. Demo fallback
  return { config: null, byok: false, demo: true };
}

/**
 * Generate content via the configured LLM provider.
 * Falls back to template-based generation in demo mode.
 */
export async function generateContent(
  options: GenerateOptions,
  config: LLMConfig | null
): Promise<GenerateResult> {
  if (!config) {
    // Demo mode — use template generator
    return {
      content: generateTemplateDraft(options),
      provider: "demo",
      model: "sage-template-v1",
      inputTokens: 0,
      outputTokens: 0,
      costCents: 0,
    };
  }

  const prompt = buildPrompt(options);

  if (config.provider === "openai") {
    return generateViaOpenAI(prompt, config);
  }
  if (config.provider === "anthropic") {
    return generateViaAnthropic(prompt, config);
  }

  // Fallback
  return {
    content: generateTemplateDraft(options),
    provider: "demo",
    model: "sage-template-v1",
    inputTokens: 0,
    outputTokens: 0,
    costCents: 0,
  };
}

// ─── OpenAI ─────────────────────────────────────────────────────────────────

async function generateViaOpenAI(prompt: string, config: LLMConfig): Promise<GenerateResult> {
  const model = config.model || "gpt-4o";
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "You are an expert SEO content writer. Generate markdown content. Do not use em-dashes (—). Do not use filler phrases like 'moreover', 'in conclusion', 'it's worth noting'. Be direct and specific. Include concrete metrics where possible." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || "";
  const inputTokens = data.usage?.prompt_tokens || 0;
  const outputTokens = data.usage?.completion_tokens || 0;

  // Cost calculation (GPT-4o: $2.50/1M input, $10/1M output as of 2025)
  const costCents = Math.round(
    (inputTokens * 0.00025 + outputTokens * 0.001) * 100
  );

  return { content, provider: "openai", model, inputTokens, outputTokens, costCents };
}

// ─── Anthropic ──────────────────────────────────────────────────────────────

async function generateViaAnthropic(prompt: string, config: LLMConfig): Promise<GenerateResult> {
  const model = config.model || "claude-3-5-sonnet-20241022";
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 4000,
      system: "You are an expert SEO content writer. Generate markdown content. Do not use em-dashes (—). Do not use filler phrases like 'moreover', 'in conclusion', 'it's worth noting'. Be direct and specific. Include concrete metrics where possible.",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    throw new Error(`Anthropic API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const content = data.content?.[0]?.text || "";
  const inputTokens = data.usage?.input_tokens || 0;
  const outputTokens = data.usage?.output_tokens || 0;

  // Cost calculation (Claude 3.5 Sonnet: $3/1M input, $15/1M output)
  const costCents = Math.round(
    (inputTokens * 0.0003 + outputTokens * 0.0015) * 100
  );

  return { content, provider: "anthropic", model, inputTokens, outputTokens, costCents };
}

// ─── Prompt builder ─────────────────────────────────────────────────────────

function buildPrompt(options: GenerateOptions): string {
  const parts: string[] = [];

  parts.push(`Generate a ${options.type.toUpperCase()} page for ${options.siteName} (${options.siteUrl}).`);
  parts.push(`Target keyword: "${options.targetKeyword}"`);

  if (options.brandVoice) {
    parts.push(`\nBrand voice: ${options.brandVoice}`);
  }
  if (options.styleGuide) {
    parts.push(`Style guide: ${options.styleGuide}`);
  }
  if (options.glossary && Object.keys(options.glossary).length > 0) {
    parts.push(`Glossary (use these terms correctly):`);
    for (const [term, def] of Object.entries(options.glossary)) {
      parts.push(`- ${term}: ${def}`);
    }
  }

  if (options.type === "home") {
    parts.push(`\nGenerate a high-converting homepage with:`);
    parts.push(`- H1 headline + subheadline`);
    parts.push(`- 3 value propositions (bullet list)`);
    parts.push(`- Social proof section`);
    parts.push(`- FAQ section (3-4 questions)`);
    parts.push(`- Call-to-action`);
  } else if (options.type === "services") {
    parts.push(`\nGenerate a services page for "${options.serviceName || options.targetKeyword}"${options.location ? ` targeting ${options.location}` : ""}:`);
    parts.push(`- H1 + intro paragraph`);
    parts.push(`- 3-tier pricing table (Starter/Growth/Agency)`);
    parts.push(`- Benefits section (bullet list)`);
    parts.push(`- Process section (numbered steps)`);
    parts.push(`- LocalBusiness schema markup suggestions`);
  } else {
    parts.push(`\nGenerate a 2,000+ word blog post${options.title ? ` titled "${options.title}"` : ""}:`);
    parts.push(`- H1 + intro hook`);
    parts.push(`- 4-6 H2 sections with H3 subsections`);
    parts.push(`- Concrete examples + metrics`);
    parts.push(`- Internal link suggestions (as [text](url) placeholders)`);
    parts.push(`- FAQ section`);
    parts.push(`- Conclusion`);
  }

  if (options.expectedTopics && options.expectedTopics.length > 0) {
    parts.push(`\nCover these semantic topics (found in top-ranking pages):`);
    parts.push(options.expectedTopics.map((t) => `- ${t}`).join("\n"));
  }

  parts.push(`\nOutput markdown only. No preamble, no commentary.`);

  return parts.join("\n");
}

// ─── Template fallback (demo mode) ──────────────────────────────────────────

function generateTemplateDraft(options: GenerateOptions): string {
  const { siteName, siteUrl, targetKeyword, type, serviceName, location, title, brandVoice, glossary } = options;

  let glossaryLine = "";
  if (glossary && Object.keys(glossary).length > 0) {
    const first = Object.entries(glossary)[0];
    glossaryLine = `\n\n> **${first[0]}**: ${first[1]}`;
  }

  if (type === "home") {
    return `# ${siteName}

Stop selling dashboards. Start shipping rankings. ${siteName} is the AI-Visibility-first platform for ${targetKeyword}.

## Why ${siteName}

- Track Google + Bing natively — see your full search footprint, not half of it
- Monitor AI citations across ChatGPT, Perplexity, Google AI Overviews, SearchGPT, and Claude
- Generate humanized, E-E-A-T-scored content that AI engines actually cite
- Let your AI agents run audits and ship fixes via MCP

## How it works

1. Connect your site — bring your own DataForSEO key for wholesale pricing
2. ${siteName} runs a 358-point audit + benchmarks your AI visibility
3. Get prioritized fixes + AI-generated content grounded in your Brand Brain
4. Watch rankings + AI citations climb — with one-click rollback on every change

## FAQ

### What makes ${siteName} different?
We're built AI-Visibility-first. Legacy tools treat Google as the only search engine. We track Google + Bing, plus 5 AI engines, because that's where your customers actually ask questions in 2026.${glossaryLine}`;
  }

  if (type === "services") {
    return `# ${serviceName || targetKeyword}

${location ? `Serving ${location} and surrounding areas. ` : ""}Conversion-focused ${serviceName?.toLowerCase() || targetKeyword} built for measurable organic growth — not vanity metrics.

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
- SEO Version Control with one-click rollback on every change${glossaryLine}`;
  }

  // blog
  return `# ${title || `The 2026 Guide to ${targetKeyword}`}

SEO is no longer about keyword stuffing. It's about AI-grounded, intent-matched, schema-rich content that both Google and AI engines like ChatGPT can cite. This guide covers everything you need to know about ${targetKeyword} in 2026.

## Why ${targetKeyword} matters

Your customers ask ChatGPT and Perplexity for recommendations — not just Google. If your brand isn't cited inside those AI answers, you lose the click. Recent studies show 60%+ of informational queries now end on Google without a click: the answer is generated in-place.

## How to win at ${targetKeyword}

### 1. Track both Google and Bing
Bing powers ChatGPT's web search, Microsoft Copilot, and a growing share of voice-search via Edge. If you're not tracking Bing, you're blind to how AI engines that ingest Bing's index perceive you.

### 2. Generate llms.txt + NLWeb schema
The llms.txt file tells AI engines what your site is about and which pages to cite. NLWeb schema-graph aggregation makes your content machine-discoverable across AI engines.

### 3. Use a Brand Brain
Every piece of content you generate should be grounded in your brand voice, style guide, and glossary. This ensures AI-generated drafts sound like your team wrote them — not like a chatbot.${glossaryLine}

---

*This article was generated by Sage, humanized via the De-AI pipeline, and scored E-E-A-T/SEO/Gap before publish.*`;
}

export const LLM_COSTS = {
  ai_content_generate_cents: WHOLESALE_RATES.ai_content_generate_cents,
};
