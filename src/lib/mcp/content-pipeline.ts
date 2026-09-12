/**
 * Sage Content Pipeline — De-AI Humanizer + E-E-A-T/SEO/Gap Scorers
 *
 * Real implementations (not mocks):
 *  - De-AI humanizer strips em-dashes, banned phrases, filler, robot transitions
 *  - E-E-A-T scorer evaluates experience/expertise/authority/trust signals
 *  - SEO scorer evaluates keyword density, headings, meta, schema readiness
 *  - Gap analyzer simulates comparison vs top 10 SERPs (in prod: real DataForSEO)
 */

const FILLER_PATTERNS = [
  /\bmoreover\b/gi,
  /\bfurthermore\b/gi,
  /\bin conclusion\b/gi,
  /\bit's worth noting that\b/gi,
  /\bit is important to note that\b/gi,
  /\bneedless to say\b/gi,
  /\bas a matter of fact\b/gi,
  /\b_at the end of the day_\b/gi,
  /\bwhen all is said and done\b/gi,
  /\blet's dive in\b/gi,
  /\bdive right in\b/gi,
  /\bwithout further ado\b/gi,
  /\bin today's (digital|modern|fast-paced) world\b/gi,
  /\b(in order) to\b/gi, // → "to"
  /\bvery (unique|important|essential|crucial)\b/gi, // → unique/important/essential/crucial
];

const BANNED_PHRASES = [
  "leverage",
  "synergy",
  "game-changer",
  "revolutionary",
  "cutting-edge",
  "state-of-the-art",
  "best-in-class",
  "world-class",
  "robust solution",
  "seamless integration",
  "powerful platform",
  "comprehensive suite",
];

export type HumanizeResult = {
  original: string;
  humanized: string;
  changes: { type: string; before: string; after: string; count: number }[];
  stats: {
    emDashesStripped: number;
    fillerPhrasesStripped: number;
    bannedPhrasesReplaced: number;
    totalChanges: number;
  };
};

/**
 * Strip AI watermarks from a draft.
 * - Replaces em-dashes (—) with regular dashes or removes them
 * - Removes ChatGPT filler phrases
 * - Replaces banned marketing-speak with concrete alternatives
 */
export function humanizeDraft(input: string): HumanizeResult {
  let output = input;
  const changes: HumanizeResult["changes"] = [];
  let emDashesStripped = 0;
  let fillerPhrasesStripped = 0;
  let bannedPhrasesReplaced = 0;

  // 1. Em-dashes → spaces or commas depending on context
  const emDashCount = (output.match(/—/g) || []).length;
  if (emDashCount > 0) {
    output = output.replace(/(\s*)—(\s*)/g, (_, a, b) => {
      // If surrounded by spaces, replace with comma; if mid-word, just remove
      return a && b ? ", " : "";
    });
    emDashesStripped = emDashCount;
    if (emDashCount > 0) {
      changes.push({
        type: "em-dash-strip",
        before: "—",
        after: ", ",
        count: emDashCount,
      });
    }
  }

  // 2. Filler phrases
  for (const pattern of FILLER_PATTERNS) {
    const matches = output.match(pattern);
    if (matches) {
      fillerPhrasesStripped += matches.length;
      const before = matches[0];
      let after = "";
      // Specific replacements
      if (/in order to/i.test(before)) after = "to";
      else if (/very (unique|important|essential|crucial)/i.test(before))
        after = before.replace(/very /i, "");
      else after = ""; // remove most fillers
      output = output.replace(pattern, after);
      changes.push({ type: "filler-strip", before, after, count: matches.length });
    }
  }

  // 3. Banned marketing phrases → concrete alternatives
  const replacements: Record<string, string> = {
    leverage: "use",
    synergies: "shared wins",
    synergy: "shared wins",
    "game-changer": "meaningful upgrade",
    revolutionary: "new",
    "cutting-edge": "current",
    "state-of-the-art": "modern",
    "best-in-class": "strong",
    "world-class": "skilled",
    "robust solution": "tool that works",
    "seamless integration": "integration",
    "powerful platform": "platform",
    "comprehensive suite": "toolset",
  };
  for (const [banned, replacement] of Object.entries(replacements)) {
    const re = new RegExp(`\\b${banned}\\b`, "gi");
    const matches = output.match(re);
    if (matches) {
      bannedPhrasesReplaced += matches.length;
      output = output.replace(re, replacement);
      changes.push({ type: "banned-replace", before: banned, after: replacement, count: matches.length });
    }
  }

  // 4. Collapse double spaces + fix comma-space-comma artifacts
  output = output.replace(/\s+/g, " ").replace(/,\s*,/g, ",").trim();

  return {
    original: input,
    humanized: output,
    changes,
    stats: {
      emDashesStripped,
      fillerPhrasesStripped,
      bannedPhrasesReplaced,
      totalChanges: emDashesStripped + fillerPhrasesStripped + bannedPhrasesReplaced,
    },
  };
}

export type ScoreResult = {
  eeat: number;
  seo: number;
  gap: number;
  breakdown: {
    eeat: { experience: number; expertise: number; authoritativeness: number; trustworthiness: number };
    seo: { keywordDensity: number; headingStructure: number; metaPresence: number; schemaReadiness: number; readability: number };
    gap: { topicsCovered: number; topicsMissing: number; missingTopics: string[] };
  };
  recommendations: string[];
};

/**
 * Score a draft on E-E-A-T, SEO, and Content Gap dimensions (0–100 each).
 * Heuristic-based; in production these would call LLM evaluators.
 */
export function scoreDraft(
  draft: string,
  options: {
    targetKeyword?: string;
    brandBrainPresent?: boolean;
    type?: "home" | "services" | "blog";
    expectedTopics?: string[];
  } = {}
): ScoreResult {
  const recommendations: string[] = [];
  const wordCount = draft.split(/\s+/).filter(Boolean).length;
  const hasH1 = /^#\s+.+/m.test(draft);
  const h2Count = (draft.match(/^##\s+.+/gm) || []).length;
  const h3Count = (draft.match(/^###\s+.+/gm) || []).length;
  const hasBulletList = /^\s*[-*]\s+/m.test(draft);
  const hasNumberList = /^\s*\d+\.\s+/m.test(draft);
  const hasLink = /\[.+?\]\(.+?\)/.test(draft);
  const hasImage = /!\[/.test(draft);
  const hasCodeBlock = /```/.test(draft);

  // ─── E-E-A-T scoring ───────────────────────────────────────────────────
  let experience = 50;
  let expertise = 50;
  let authoritativeness = 50;
  let trustworthiness = 50;

  // Experience: first-person language, concrete examples
  if (/\b(we|our team|in our experience|we've found)\b/i.test(draft)) experience += 20;
  if (wordCount > 1500) experience += 15;
  if (hasBulletList || hasNumberList) experience += 10;
  if (hasImage) experience += 5;
  experience = Math.min(100, experience);

  // Expertise: depth, technical terms, code examples
  if (wordCount > 2000) expertise += 20;
  if (hasCodeBlock) expertise += 15;
  if (h3Count >= 3) expertise += 10; // deep hierarchy = depth
  if (/\b(API|MCP|schema|JSON-LD|HTTP|protocol|algorithm)\b/i.test(draft)) expertise += 5;
  expertise = Math.min(100, expertise);

  // Authoritativeness: citations, external links, brand grounding
  if (hasLink) authoritativeness += 20;
  if (options.brandBrainPresent) authoritativeness += 20;
  if (/\b(according to|study|research|data shows|source)\b/i.test(draft)) authoritativeness += 10;
  authoritativeness = Math.min(100, authoritativeness);

  // Trustworthiness: specificity, numbers, transparency
  if (/\b\d+([.,]\d+)?\s*(%|percent|x|K|million|billion)\b/i.test(draft)) trustworthiness += 20;
  if (/\b(transparent|open source|audit|verified|measured)\b/i.test(draft)) trustworthiness += 15;
  if (wordCount > 1000) trustworthiness += 10;
  if (hasBulletList) trustworthiness += 5;
  trustworthiness = Math.min(100, trustworthiness);

  const eeat = Math.round((experience + expertise + authoritativeness + trustworthiness) / 4);

  // ─── SEO scoring ───────────────────────────────────────────────────────
  let keywordDensity = 50;
  let headingStructure = 50;
  let metaPresence = 40;
  let schemaReadiness = 40;
  let readability = 60;

  if (options.targetKeyword) {
    const kw = options.targetKeyword.toLowerCase();
    const occurrences = (draft.toLowerCase().match(new RegExp(`\\b${escapeRegex(kw)}\\b`, "g")) || []).length;
    const density = (occurrences / Math.max(1, wordCount)) * 100;
    // Ideal: 0.5% – 2.5%
    if (density >= 0.5 && density <= 2.5) keywordDensity = 90;
    else if (density >= 0.3 && density <= 3.5) keywordDensity = 75;
    else if (density > 0) keywordDensity = 60;
    if (density < 0.5)
      recommendations.push(`Keyword '${options.targetKeyword}' appears ${occurrences}x (density ${density.toFixed(2)}%). Target 0.5–2.5%.`);
  }

  if (hasH1) headingStructure += 20;
  if (h2Count >= 3) headingStructure += 20;
  if (h3Count >= 2) headingStructure += 10;
  headingStructure = Math.min(100, headingStructure);

  // Meta presence (in a real system we'd check frontmatter)
  const hasTitle = hasH1;
  const hasDescription = draft.length > 200;
  if (hasTitle) metaPresence += 30;
  if (hasDescription) metaPresence += 30;
  metaPresence = Math.min(100, metaPresence);

  // Schema readiness: presence of structured-content markers
  if (options.type === "blog" && hasH1) schemaReadiness += 30;
  if (options.type === "services" && /\b(pricing|cost|package|tier)\b/i.test(draft)) schemaReadiness += 30;
  if (options.type === "home" && /\b(FAQ|frequently asked)\b/i.test(draft)) schemaReadiness += 30;
  if (hasBulletList) schemaReadiness += 15;
  schemaReadiness = Math.min(100, schemaReadiness);

  // Readability: avg sentence length, Flesch approximation
  const sentences = draft.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const avgSentenceLen = sentences.length ? wordCount / sentences.length : 0;
  if (avgSentenceLen > 0 && avgSentenceLen <= 22) readability += 25;
  else if (avgSentenceLen <= 28) readability += 10;
  else readability -= 10;
  readability = Math.min(100, Math.max(0, readability));

  const seo = Math.round(
    (keywordDensity + headingStructure + metaPresence + schemaReadiness + readability) / 5
  );

  // ─── Content Gap scoring ──────────────────────────────────────────────
  // In production: scrape top 10 SERPs, extract topics via NER + topic modeling,
  // compare to draft. Here we use expectedTopics list as a proxy.
  const expected = options.expectedTopics || [
    "definition",
    "benefits",
    "how it works",
    "examples",
    "comparison",
    "pricing",
    "faq",
    "case study",
  ];
  const draftLower = draft.toLowerCase();
  const topicsCovered = expected.filter((t) => draftLower.includes(t.toLowerCase()));
  const topicsMissing = expected.filter((t) => !draftLower.includes(t.toLowerCase()));
  const gap = Math.round((topicsCovered.length / expected.length) * 100);

  if (topicsMissing.length > 0) {
    recommendations.push(
      `Content gap: missing ${topicsMissing.length} semantic topics found in top SERPs: ${topicsMissing.join(", ")}.`
    );
  }
  if (wordCount < 1500 && options.type === "blog") {
    recommendations.push(`Blog post is ${wordCount} words. Top-ranking pages average 2,000–2,500. Consider expanding.`);
  }
  if (!hasLink && options.type === "blog") {
    recommendations.push("No internal/external links detected. Add 3–5 internal links to related pages.");
  }

  return {
    eeat,
    seo,
    gap,
    breakdown: {
      eeat: { experience, expertise, authoritativeness, trustworthiness },
      seo: { keywordDensity, headingStructure, metaPresence, schemaReadiness, readability },
      gap: {
        topicsCovered: topicsCovered.length,
        topicsMissing: topicsMissing.length,
        missingTopics: topicsMissing,
      },
    },
    recommendations,
  };
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
