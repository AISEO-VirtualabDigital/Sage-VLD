/**
 * Sage — DataForSEO API Client
 *
 * Handles all live SERP + rank tracking calls via DataForSEO.
 * Supports BYOK — users can bring their own DataForSEO credentials,
 * or use the platform's pooled keys (billed at wholesale via CreditLedger).
 *
 * When no keys are available (demo mode), falls back to simulated data
 * so the platform remains functional for evaluation.
 *
 * DataForSEO API docs: https://docs.dataforseo.com/
 */
import { WHOLESALE_RATES } from "@/lib/billing";

export type DataForSEOConfig = {
  login: string;
  password: string;
};

export type SerpResult = {
  keyword: string;
  engine: "google" | "bing";
  location: string;
  device: "desktop" | "mobile";
  organic: Array<{
    rank: number;
    url: string;
    title: string;
    domain: string;
  }>;
  serpFeatures: string[];
  checkedAt: string;
};

export type KeywordMetrics = {
  keyword: string;
  searchVolume: number;
  cpc: number;
  competition: number;
  intent: string;
};

/**
 * Resolve DataForSEO credentials for a user.
 * Priority: user BYOK → platform pooled keys → demo fallback.
 */
export async function resolveDataForSEOConfig(userId?: string): Promise<{
  config: DataForSEOConfig | null;
  byok: boolean;
  demo: boolean;
}> {
  // 1. Check user BYOK keys
  if (userId) {
    const { db } = await import("@/lib/db");
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { byokDataForseoKey: true },
    });
    if (user?.byokDataForseoKey) {
      // BYOK key is stored as "login:password" (encrypted at rest in prod)
      const [login, password] = user.byokDataForseoKey.split(":");
      if (login && password) {
        return { config: { login, password }, byok: true, demo: false };
      }
    }
  }

  // 2. Platform pooled keys
  const platformLogin = process.env.DATAFORSEO_LOGIN;
  const platformPassword = process.env.DATAFORSEO_PASSWORD;
  if (platformLogin && platformPassword) {
    return { config: { login: platformLogin, password: platformPassword }, byok: false, demo: false };
  }

  // 3. Demo fallback
  return { config: null, byok: false, demo: true };
}

/**
 * Fetch SERP results for a keyword on Google or Bing.
 * DataForSEO endpoint: SERP Organic Live
 *
 * Cost: $0.002 per query (billed via CreditLedger if using platform keys)
 */
export async function fetchSerp(params: {
  keyword: string;
  engine: "google" | "bing";
  location?: string;
  device?: "desktop" | "mobile";
  config: DataForSEOConfig;
}): Promise<SerpResult> {
  const endpoint =
    params.engine === "google"
      ? "https://api.dataforseo.com/v3/serp/google/organic/live/advanced"
      : "https://api.dataforseo.com/v3/serp/bing/organic/live/advanced";

  const auth = Buffer.from(`${params.config.login}:${params.config.password}`).toString("base64");

  const body = JSON.stringify([{
    keyword: params.keyword,
    location_name: params.location || "United States",
    device: params.device || "desktop",
    os: params.device === "mobile" ? "ios" : "windows",
    depth: 100,
  }]);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body,
  });

  if (!res.ok) {
    throw new Error(`DataForSEO SERP API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const result = data.tasks?.[0]?.result?.[0];
  if (!result) {
    throw new Error("DataForSEO: no results returned");
  }

  const organic = (result.organic || []).map((item: { rank_absolute: number; url: string; title: string; domain: string }) => ({
    rank: item.rank_absolute,
    url: item.url,
    title: item.title,
    domain: item.domain,
  }));

  const serpFeatures: string[] = [];
  if (result.featured_snippet) serpFeatures.push("featured_snippet");
  if (result.people_also_ask) serpFeatures.push("people_also_ask");
  if (result.local_pack) serpFeatures.push("local_pack");
  if (result.image_pack) serpFeatures.push("image_pack");

  return {
    keyword: params.keyword,
    engine: params.engine,
    location: params.location || "United States",
    device: params.device || "desktop",
    organic,
    serpFeatures,
    checkedAt: new Date().toISOString(),
  };
}

/**
 * Get keyword search volume + metrics.
 * DataForSEO endpoint: Keywords Data Search Volume Live
 *
 * Cost: $0.002 per keyword
 */
export async function fetchKeywordMetrics(params: {
  keywords: string[];
  config: DataForSEOConfig;
}): Promise<KeywordMetrics[]> {
  const endpoint = "https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live";
  const auth = Buffer.from(`${params.config.login}:${params.config.password}`).toString("base64");

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify([{ keywords: params.keywords }]),
  });

  if (!res.ok) {
    throw new Error(`DataForSEO Keywords API error: ${res.status}`);
  }

  const data = await res.json();
  const results = data.tasks?.[0]?.result || [];

  return results.map((r: { keyword: string; search_volume: number; cpc: number; competition: number; search_volume_value?: number }) => ({
    keyword: r.keyword,
    searchVolume: r.search_volume || 0,
    cpc: r.cpc || 0,
    competition: r.competition || 0,
    intent: classifyIntent(r.keyword),
  }));
}

/**
 * Check if a brand/domain is cited in the top SERP results.
 * Used by the AI Citation Tracker to detect when competitors rank for your queries.
 */
export function findBrandInSerp(serp: SerpResult, targetDomain: string): {
  found: boolean;
  rank: number | null;
  url: string | null;
} {
  const target = targetDomain.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "");
  const match = serp.organic.find((o) => o.domain.toLowerCase().includes(target));
  return {
    found: !!match,
    rank: match?.rank ?? null,
    url: match?.url ?? null,
  };
}

// ─── Demo fallback (used when no DataForSEO keys configured) ─────────────────

export function simulateSerp(keyword: string, engine: "google" | "bing"): SerpResult {
  const baseRank = Math.floor(Math.random() * 50) + 1;
  const domains = ["ahrefs.com", "semrush.com", "yoast.com", "rankmath.com", "moz.com", "searchenginejournal.com", "backlinko.com"];
  const organic = Array.from({ length: 10 }, (_, i) => ({
    rank: i + 1,
    url: `https://${domains[i % domains.length]}/article`,
    title: `${keyword} — Complete Guide ${new Date().getFullYear()}`,
    domain: domains[i % domains.length],
  }));

  return {
    keyword,
    engine,
    location: "United States",
    device: "desktop",
    organic,
    serpFeatures: Math.random() > 0.7 ? ["featured_snippet"] : [],
    checkedAt: new Date().toISOString(),
  };
}

export function simulateKeywordMetrics(keyword: string): KeywordMetrics {
  return {
    keyword,
    searchVolume: Math.floor(Math.random() * 12000) + 100,
    cpc: Math.round(Math.random() * 500) / 100,
    competition: Math.random(),
    intent: classifyIntent(keyword),
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function classifyIntent(keyword: string): string {
  const k = keyword.toLowerCase();
  if (/\b(buy|cheap|discount|deal|price|cost|hire|service|agency|tool)\b/.test(k)) return "commercial";
  if (/\b(how to|what is|why|guide|tutorial|learn|examples?)\b/.test(k)) return "informational";
  if (/\b(login|sign in|download|install|buy now|get|order)\b/.test(k)) return "transactional";
  return "informational";
}

export const DATAFORSEO_RATES = WHOLESALE_RATES;
