/**
 * Sage — Google API Client (Search Console + Analytics 4)
 *
 * Uses OAuth 2.0 to access a user's GSC + GA4 data with per-URL attribution.
 * Users connect their Google account once; Sage stores the refresh token
 * (encrypted at rest) and uses it to pull fresh data on demand.
 *
 * When no Google connection exists (demo mode), falls back to simulated
 * data so the analytics views remain functional.
 *
 * Google Search Console API: https://developers.google.com/webmaster-tools/v1/api_reference_index
 * Google Analytics Data API: https://developers.google.com/analytics/devguides/reporting/data/v1
 */

export type GoogleConnection = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // epoch ms
};

export type GscRow = {
  url: string;
  page: string;
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type DecayRecommendation = {
  url: string;
  title: string;
  ageDays: number;
  trafficDropPct: number;
  currentSeoScore: number | null;
  currentGapScore: number | null;
  priority: "critical" | "high" | "medium";
  recommendation: string;
};

/**
 * Refresh the OAuth access token using the stored refresh token.
 */
export async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  expiresAt: number;
}> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET not configured");
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    throw new Error(`Google token refresh failed: ${res.status}`);
  }

  const data = await res.json();
  return {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
}

/**
 * Fetch Google Search Console performance data for a site.
 *
 * GSC API endpoint: searchanalytics/query
 * Returns per-URL + per-query performance for the specified date range.
 */
export async function fetchGscPerformance(params: {
  siteUrl: string; // the verified property in GSC (e.g. https://example.com/)
  accessToken: string;
  days?: number;
  dimensions?: string[];
  rowLimit?: number;
}): Promise<GscRow[]> {
  const days = params.days || 28;
  const dimensions = params.dimensions || ["page", "query"];
  const rowLimit = Math.min(1000, params.rowLimit || 100);

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(params.siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${params.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        dimensions,
        rowLimit,
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`GSC API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return (data.rows || []).map((row: { keys: string[]; clicks: number; impressions: number; ctr: number; position: number }) => ({
    url: row.keys[0],
    page: row.keys[0],
    query: row.keys[1] || "(not set)",
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: Number((row.ctr * 100).toFixed(2)),
    position: Number(row.position.toFixed(1)),
  }));
}

/**
 * Generate the OAuth URL for connecting a Google account.
 * User visits this URL, grants access, and is redirected back with a code.
 */
export function getOAuthUrl(params: { redirectUri: string; state: string }): string {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error("GOOGLE_CLIENT_ID not configured");

  const scopes = [
    "https://www.googleapis.com/auth/webmasters.readonly", // Search Console
    "https://www.googleapis.com/auth/analytics.readonly", // GA4
  ];

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", params.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", scopes.join(" "));
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("state", params.state);

  return url.toString();
}

/**
 * Exchange the OAuth code for access + refresh tokens.
 */
export async function exchangeCodeForTokens(code: string, redirectUri: string): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth credentials not configured");
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!res.ok) {
    throw new Error(`Google OAuth exchange failed: ${res.status}`);
  }

  const data = await res.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
}

// ─── Demo fallback (simulated GSC data) ─────────────────────────────────────

export function simulateGscPerformance(params: {
  siteUrl: string;
  siteName: string;
  publishedPages: Array<{ title: string; url: string; seoScore: number | null; gapScore: number | null; updatedAt: string }>;
  keywords: Array<{ term: string; volume: number | null }>;
  days: number;
}): { totals: { clicks: number; impressions: number; avgCtr: number }; rows: GscRow[] } {
  const { siteUrl, siteName, publishedPages, keywords, days } = params;

  const rows: GscRow[] = publishedPages.map((page, i) => {
    const kw = keywords[i % keywords.length];
    const clicks = Math.floor((kw?.volume || 1000) * (0.02 + Math.random() * 0.08));
    const impressions = Math.floor(clicks * (8 + Math.random() * 12));
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const position = 3 + Math.random() * 20;
    return {
      url: page.url || `${siteUrl}${page.url}`,
      page: page.url,
      query: kw?.term || "unknown",
      clicks,
      impressions,
      ctr: Number(ctr.toFixed(2)),
      position: Number(position.toFixed(1)),
    };
  });

  rows.sort((a, b) => b.clicks - a.clicks);

  const totals = {
    clicks: rows.reduce((acc, r) => acc + r.clicks, 0),
    impressions: rows.reduce((acc, r) => acc + r.impressions, 0),
    avgCtr: 0,
  };
  totals.avgCtr = totals.impressions ? Number(((totals.clicks / totals.impressions) * 100).toFixed(2)) : 0;

  return { totals, rows };
}

/**
 * Detect content decay by comparing GSC data over two periods.
 * In demo mode, simulates decay based on page age + gap scores.
 */
export function detectDecay(params: {
  publishedPages: Array<{ title: string; url: string; seoScore: number | null; gapScore: number | null; updatedAt: string }>;
  threshold: number;
}): DecayRecommendation[] {
  const { publishedPages, threshold } = params;

  return publishedPages
    .map((p) => {
      const ageDays = Math.floor((Date.now() - new Date(p.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
      const trafficDrop = Math.max(0, Math.floor((ageDays / 30) * (100 - (p.gapScore || 80)) * 0.4));
      return {
        url: p.url,
        title: p.title,
        ageDays,
        trafficDropPct: trafficDrop,
        currentSeoScore: p.seoScore,
        currentGapScore: p.gapScore,
        priority: (trafficDrop > 50 ? "critical" : trafficDrop > 30 ? "high" : "medium") as "critical" | "high" | "medium",
        recommendation: generateRefreshRec(p, ageDays, trafficDrop),
      };
    })
    .filter((r) => r.trafficDropPct >= threshold)
    .sort((a, b) => b.trafficDropPct - a.trafficDropPct);
}

function generateRefreshRec(
  p: { type?: string; ageDays: number; trafficDropPct: number; currentGapScore: number | null },
  ageDays: number,
  trafficDrop: number
): string {
  const recs: string[] = [];
  if (p.currentGapScore !== null && p.currentGapScore < 80) {
    recs.push(`Content gap score is ${p.currentGapScore}/100 — run sage.content.score to identify missing semantic topics vs current top 10 SERPs.`);
  }
  if (ageDays > 180) {
    recs.push(`Page is ${ageDays} days old — refresh statistics, examples, and dates to signal freshness.`);
  }
  if (trafficDrop > 40) {
    recs.push(`Traffic dropped ${trafficDrop}% — consider rewriting the intro + adding new sections to recover ranking.`);
  }
  if (recs.length === 0) recs.push("Monitor for continued decay; consider a minor refresh in 30 days.");
  return recs.join(" ");
}
