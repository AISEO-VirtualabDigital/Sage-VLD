/**
 * Sage Dashboard — MCP API client
 *
 * Thin wrapper around fetch() that calls the MCP REST endpoints.
 * Read tools need no auth; write tools auto-attach the demo API key.
 */

const DEMO_API_KEY = "sage_live_demo_key_0000000000000000";

export async function callTool<T = unknown>(
  toolName: string,
  args: Record<string, unknown> = {},
  options: { method?: "GET" | "POST" } = {}
): Promise<T> {
  const method = options.method || "POST";
  const url = `/api/mcp/${toolName}`;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${DEMO_API_KEY}`,
  };

  let body: string | undefined;
  if (method === "POST") {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(args);
  }

  const res = await fetch(url, { method, headers, body });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(
      `MCP call failed: ${toolName} (${res.status}) — ${errBody.error || res.statusText}`
    );
  }
  const data = await res.json();
  return data.result as T;
}

// ─── Typed response shapes ─────────────────────────────────────────────────

export type Site = {
  id: string;
  url: string;
  name: string;
  verified: boolean;
  cmsType: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Keyword = {
  id: string;
  term: string;
  intent: string;
  cluster: string | null;
  country: string;
  device: string;
  volume: number | null;
  createdAt: string;
};

export type Ranking = {
  id: string;
  engine: string;
  position: number;
  serpFeatures: string | null;
  checkedAt: string;
};

export type Citation = {
  id: string;
  engine: string;
  query: string;
  cited: boolean;
  citationText: string | null;
  citationUrl: string | null;
  competitorCited: string | null;
  checkedAt: string;
};

export type ContentDraft = {
  id: string;
  type: string;
  title: string;
  slug: string | null;
  status: string;
  version: number;
  eeatScore: number | null;
  seoScore: number | null;
  gapScore: number | null;
  humanized: boolean;
  publishedUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuditRun = {
  id: string;
  siteId: string;
  score: number;
  pagesCrawled: number;
  status: string;
  startedAt: string;
  completedAt: string | null;
};

export type AuditFinding = {
  id: string;
  category: string;
  severity: string;
  label: string;
  pageCount: number;
  autoFixAvailable: boolean;
};

export type Change = {
  id: string;
  siteId: string;
  url: string;
  field: string;
  before: string | null;
  after: string | null;
  impactRankingDelta: number | null;
  impactTrafficDelta: number | null;
  rolledBack: boolean;
  rolledBackAt: string | null;
  createdAt: string;
};

export type BrandBrain = {
  id: string;
  siteId: string;
  voiceDoc: string | null;
  styleGuide: string | null;
  bannedPhrases: string[] | string;
  glossary: Record<string, string> | string;
  internalLinkMap: Record<string, unknown> | string;
  version: number;
  files?: Array<{ id: string; filename: string; content: string; type: string; createdAt: string }>;
};
