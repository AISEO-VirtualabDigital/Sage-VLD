"use client";

import * as React from "react";
import {
  FileText,
  Globe,
  GitBranch,
  Search,
  Code2,
  Image as ImageIcon,
  Bot,
  Zap,
  FileSearch,
  Loader2,
  Copy,
  Check,
  Plus,
  Trash2,
  Download,
  Upload,
  RefreshCw,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { callTool } from "../api";
import {
  useMetaList,
  useMetaEdit,
  useRedirectList,
  useRedirectCreate,
  useRedirectDelete,
  useMonitor404,
  useBotBlockerList,
  useBotBlockerSet,
} from "../hooks/use-dashboard-data";

type ManualTab =
  | "meta"
  | "sitemap"
  | "redirects"
  | "analyzers"
  | "schema"
  | "image"
  | "bots"
  | "indexing"
  | "briefs";

const tabs: Array<{ id: ManualTab; label: string; icon: typeof FileText; count: number }> = [
  { id: "meta", label: "Meta Editor", icon: FileText, count: 3 },
  { id: "sitemap", label: "Sitemap & Robots", icon: Globe, count: 4 },
  { id: "redirects", label: "Redirects & 404", icon: GitBranch, count: 4 },
  { id: "analyzers", label: "SERP & Analyzers", icon: Search, count: 6 },
  { id: "schema", label: "Schema Generators", icon: Code2, count: 4 },
  { id: "image", label: "Image & PageSpeed", icon: ImageIcon, count: 3 },
  { id: "bots", label: "AI Crawler Control", icon: Bot, count: 2 },
  { id: "indexing", label: "Indexing & Bulk", icon: Zap, count: 3 },
  { id: "briefs", label: "Briefs & SERP", icon: FileSearch, count: 2 },
];

export function ManualToolsView({ siteId }: { siteId: string }) {
  const [tab, setTab] = React.useState<ManualTab>("meta");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Manual Tools</h1>
        <p className="text-sm text-muted-foreground mt-1">
          31 hands-on SEO tools — no AI required. Full manual control for practitioners who prefer to drive.
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto border-b border-white/[0.06] pb-px">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-colors -mb-px",
              tab === t.id
                ? "border-emerald-500 text-emerald-300"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
            <span className="text-[9px] text-muted-foreground/60">({t.count})</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "meta" && <MetaTab siteId={siteId} />}
      {tab === "sitemap" && <SitemapTab siteId={siteId} />}
      {tab === "redirects" && <RedirectsTab siteId={siteId} />}
      {tab === "analyzers" && <AnalyzersTab siteId={siteId} />}
      {tab === "schema" && <SchemaTab />}
      {tab === "image" && <ImageTab />}
      {tab === "bots" && <BotsTab siteId={siteId} />}
      {tab === "indexing" && <IndexingTab siteId={siteId} />}
      {tab === "briefs" && <BriefsTab />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Shared components
// ═══════════════════════════════════════════════════════════════════════════

function ToolCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-5 bg-white/[0.02] border-white/[0.06]">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground mt-0.5 mb-4">{description}</p>
      {children}
    </Card>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <Button
      size="sm"
      variant="ghost"
      className="h-7 text-xs"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

function OutputBlock({ label, content }: { label: string; content: string }) {
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
        <CopyButton text={content} />
      </div>
      <pre className="text-[11px] font-mono text-foreground/80 bg-background border border-white/[0.06] rounded-md p-3 overflow-x-auto max-h-64 whitespace-pre-wrap">
        {content}
      </pre>
    </div>
  );
}

function RunButton({
  onClick,
  loading,
  children,
}: {
  onClick: () => void;
  loading: boolean;
  children: React.ReactNode;
}) {
  return (
    <Button
      onClick={onClick}
      disabled={loading}
      size="sm"
      className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
      {children}
    </Button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tab 1: Meta Editor
// ═══════════════════════════════════════════════════════════════════════════

function MetaTab({ siteId }: { siteId: string }) {
  const { data: metaList, isLoading } = useMetaList(siteId);
  const metaEdit = useMetaEdit();
  const [form, setForm] = React.useState({
    url: "",
    title: "",
    description: "",
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    twitterCard: "summary",
    robotsMeta: "",
  });

  const handleSave = async () => {
    if (!form.url) return;
    await metaEdit.mutateAsync({ siteId, ...form });
    setForm({ url: "", title: "", description: "", canonicalUrl: "", ogTitle: "", ogDescription: "", ogImage: "", twitterCard: "summary", robotsMeta: "" });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ToolCard title="Edit Meta (Manual)" description="Set meta tags for a URL — no AI, you write the content.">
        <div className="space-y-3">
          <div>
            <Label className="text-xs">URL Path *</Label>
            <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="/blog/my-post" className="mt-1 bg-background border-white/[0.08] font-mono text-sm" />
          </div>
          <div>
            <Label className="text-xs">Title (50-60 chars)</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Page Title" className="mt-1 bg-background border-white/[0.08] text-sm" />
            <span className="text-[10px] text-muted-foreground">{form.title.length}/60</span>
          </div>
          <div>
            <Label className="text-xs">Description (150-160 chars)</Label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Meta description" className="mt-1 w-full rounded-md border border-white/[0.08] bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
            <span className="text-[10px] text-muted-foreground">{form.description.length}/160</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Canonical URL</Label>
              <Input value={form.canonicalUrl} onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })} placeholder="https://..." className="mt-1 bg-background border-white/[0.08] text-sm" />
            </div>
            <div>
              <Label className="text-xs">Robots Meta</Label>
              <Input value={form.robotsMeta} onChange={(e) => setForm({ ...form, robotsMeta: e.target.value })} placeholder="noindex,nofollow" className="mt-1 bg-background border-white/[0.08] text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">OG Title</Label>
              <Input value={form.ogTitle} onChange={(e) => setForm({ ...form, ogTitle: e.target.value })} placeholder="Open Graph title" className="mt-1 bg-background border-white/[0.08] text-sm" />
            </div>
            <div>
              <Label className="text-xs">OG Image URL</Label>
              <Input value={form.ogImage} onChange={(e) => setForm({ ...form, ogImage: e.target.value })} placeholder="https://.../og.png" className="mt-1 bg-background border-white/[0.08] text-sm" />
            </div>
          </div>
          <RunButton onClick={handleSave} loading={metaEdit.isPending}>Save Meta</RunButton>
          {metaEdit.data && (
            <div className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded p-2">
              ✓ Saved meta for {metaEdit.data.result?.meta?.url || form.url}
            </div>
          )}
        </div>
      </ToolCard>

      <ToolCard title="Meta Records" description={`${metaList?.length || 0} URLs with manually-set meta`}>
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : !metaList || metaList.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-6">No meta records yet. Edit one →</div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {metaList.map((m: Record<string, unknown>) => (
              <div key={m.id as string} className="rounded-md border border-white/[0.04] bg-white/[0.01] p-2.5">
                <div className="text-xs font-mono text-foreground truncate">{m.url as string}</div>
                <div className="text-[11px] text-foreground/80 truncate mt-0.5">{(m.title as string) || "(no title)"}</div>
                <div className="text-[10px] text-muted-foreground truncate">{(m.description as string) || "(no description)"}</div>
                {m.robotsMeta && <span className="text-[9px] text-amber-300 bg-amber-500/10 px-1 py-0.5 rounded mt-1 inline-block">{m.robotsMeta as string}</span>}
              </div>
            ))}
          </div>
        )}
      </ToolCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tab 2: Sitemap & Robots
// ═══════════════════════════════════════════════════════════════════════════

function SitemapTab({ siteId }: { siteId: string }) {
  const [sitemapOut, setSitemapOut] = React.useState<string>("");
  const [robotsOut, setRobotsOut] = React.useState<string>("");
  const [blockAi, setBlockAi] = React.useState(true);
  const [loadingSitemap, setLoadingSitemap] = React.useState(false);
  const [loadingRobots, setLoadingRobots] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState("");
  const [previewOut, setPreviewOut] = React.useState<{ url: string; content: string; status: number } | null>(null);
  const [loadingPreview, setLoadingPreview] = React.useState(false);

  const genSitemap = async () => {
    setLoadingSitemap(true);
    try {
      const r = await callTool<{ xml: string; urlCount: number }>("sage.sitemap.generate", { siteId });
      setSitemapOut(r.xml);
    } finally { setLoadingSitemap(false); }
  };

  const genRobots = async () => {
    setLoadingRobots(true);
    try {
      const r = await callTool<{ content: string; aiCrawlersBlocked: number }>("sage.robots.txt.generate", { siteId, blockAiCrawlers: blockAi });
      setRobotsOut(r.content);
    } finally { setLoadingRobots(false); }
  };

  const fetchPreview = async (tool: string) => {
    if (!previewUrl) return;
    setLoadingPreview(true);
    try {
      const r = await callTool<{ content: string; status: number; url: string }>(tool, { url: previewUrl });
      setPreviewOut({ url: r.url, content: r.content, status: r.status });
    } finally { setLoadingPreview(false); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ToolCard title="XML Sitemap Generator" description="Generate sitemap.xml from your published content. Submit to Google + Bing.">
        <RunButton onClick={genSitemap} loading={loadingSitemap}>Generate Sitemap</RunButton>
        {sitemapOut && <OutputBlock label="sitemap.xml" content={sitemapOut} />}
      </ToolCard>

      <ToolCard title="robots.txt Generator" description="Generate robots.txt with optional AI crawler blocking.">
        <label className="flex items-center gap-2 text-xs text-foreground mb-3">
          <input type="checkbox" checked={blockAi} onChange={(e) => setBlockAi(e.target.checked)} className="rounded" />
          Block AI crawlers (GPTBot, CCBot, Google-Extended, ClaudeBot, PerplexityBot)
        </label>
        <RunButton onClick={genRobots} loading={loadingRobots}>Generate robots.txt</RunButton>
        {robotsOut && <OutputBlock label="robots.txt" content={robotsOut} />}
      </ToolCard>

      <ToolCard title="Preview Live robots.txt" description="Fetch robots.txt from any URL to review.">
        <div className="flex gap-2">
          <Input value={previewUrl} onChange={(e) => setPreviewUrl(e.target.value)} placeholder="https://example.com" className="bg-background border-white/[0.08] text-sm" />
          <RunButton onClick={() => fetchPreview("sage.robots.txt.preview")} loading={loadingPreview}>Fetch</RunButton>
        </div>
        {previewOut && !previewUrl.includes("sitemap") && <OutputBlock label="robots.txt" content={previewOut.content} />}
      </ToolCard>

      <ToolCard title="Preview Live Sitemap" description="Fetch sitemap.xml from any URL to review.">
        <div className="flex gap-2">
          <Input value={previewUrl} onChange={(e) => setPreviewUrl(e.target.value)} placeholder="https://example.com/sitemap.xml" className="bg-background border-white/[0.08] text-sm" />
          <RunButton onClick={() => fetchPreview("sage.sitemap.preview")} loading={loadingPreview}>Fetch</RunButton>
        </div>
        {previewOut && previewUrl.includes("sitemap") && <OutputBlock label="sitemap.xml" content={previewOut.content} />}
      </ToolCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tab 3: Redirects & 404
// ═══════════════════════════════════════════════════════════════════════════

function RedirectsTab({ siteId }: { siteId: string }) {
  const { data: redirects, isLoading } = useRedirectList(siteId);
  const { data: errors404 } = useMonitor404(siteId);
  const createRedirect = useRedirectCreate();
  const deleteRedirect = useRedirectDelete();
  const [form, setForm] = React.useState({ fromPath: "", toUrl: "", type: "301" });

  const handleCreate = async () => {
    if (!form.fromPath || !form.toUrl) return;
    await createRedirect.mutateAsync({ siteId, ...form });
    setForm({ fromPath: "", toUrl: "", type: "301" });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ToolCard title="Create Redirect" description="Manually create a 301/302/307/308 redirect.">
        <div className="space-y-3">
          <div>
            <Label className="text-xs">From Path</Label>
            <Input value={form.fromPath} onChange={(e) => setForm({ ...form, fromPath: e.target.value })} placeholder="/old-page" className="mt-1 bg-background border-white/[0.08] font-mono text-sm" />
          </div>
          <div>
            <Label className="text-xs">To URL</Label>
            <Input value={form.toUrl} onChange={(e) => setForm({ ...form, toUrl: e.target.value })} placeholder="/new-page or https://..." className="mt-1 bg-background border-white/[0.08] font-mono text-sm" />
          </div>
          <div>
            <Label className="text-xs">Type</Label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="mt-1 block rounded-md border border-white/[0.08] bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/40">
              <option value="301">301 (Permanent)</option>
              <option value="302">302 (Temporary)</option>
              <option value="307">307 (Temporary, preserve method)</option>
              <option value="308">308 (Permanent, preserve method)</option>
            </select>
          </div>
          <RunButton onClick={handleCreate} loading={createRedirect.isPending}>
            <Plus className="h-3.5 w-3.5" /> Create Redirect
          </RunButton>
        </div>
      </ToolCard>

      <ToolCard title="Active Redirects" description={`${redirects?.length || 0} redirects configured`}>
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : !redirects || redirects.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-6">No redirects yet</div>
        ) : (
          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {redirects.map((r: Record<string, unknown>) => (
              <div key={r.id as string} className="flex items-center gap-2 text-xs rounded-md border border-white/[0.04] bg-white/[0.01] p-2">
                <span className="text-[9px] font-mono bg-emerald-500/15 text-emerald-300 px-1 py-0.5 rounded">{r.type as string}</span>
                <span className="font-mono text-foreground/80 truncate flex-1">{r.fromPath as string}</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-mono text-foreground/80 truncate flex-1">{r.toUrl as string}</span>
                <button onClick={() => deleteRedirect.mutate({ siteId, fromPath: r.fromPath as string })} className="text-red-400 hover:text-red-300 shrink-0">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </ToolCard>

      <ToolCard title="404 Monitor" description={`${errors404?.length || 0} URLs returning 404`}>
        {!errors404 || errors404.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-6">No 404 errors logged</div>
        ) : (
          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {errors404.map((e: Record<string, unknown>) => (
              <div key={e.id as string} className="text-xs rounded-md border border-white/[0.04] bg-white/[0.01] p-2">
                <div className="font-mono text-red-300 truncate">{e.url as string}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {e.hitCount as number} hits · last: {new Date(e.lastHit as string).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </ToolCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tab 4: SERP Preview & Analyzers
// ═══════════════════════════════════════════════════════════════════════════

function AnalyzersTab({ siteId }: { siteId: string }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <SerpPreviewTool />
      <HeadlineAnalyzerTool />
      <ReadabilityTool />
      <KeywordDensityTool />
      <FeaturedSnippetTool />
      <CannibalizationTool siteId={siteId} />
    </div>
  );
}

function SerpPreviewTool() {
  const [form, setForm] = React.useState({ title: "", description: "", url: "" });
  const [result, setResult] = React.useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = React.useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const r = await callTool<Record<string, unknown>>("sage.serp.preview", form);
      setResult(r);
    } finally { setLoading(false); }
  };

  return (
    <ToolCard title="SERP Preview" description="See how your title + description appear in Google (desktop + mobile).">
      <div className="space-y-2">
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Page title" className="bg-background border-white/[0.08] text-sm" />
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Meta description" className="w-full rounded-md border border-white/[0.08] bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
        <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="example.com/blog/post" className="bg-background border-white/[0.08] text-sm" />
        <RunButton onClick={run} loading={loading}>Preview</RunButton>
        {result && (
          <div className="mt-3 space-y-3">
            <div className="rounded-md border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Desktop Preview</div>
              <div className="text-[11px] text-emerald-400">{(result.desktop as Record<string, unknown>)?.url as string}</div>
              <div className="text-sm text-[#8ab4f8]">{(result.desktop as Record<string, unknown>)?.title as string}</div>
              <div className="text-xs text-muted-foreground">{(result.desktop as Record<string, unknown>)?.description as string}</div>
            </div>
            {(result.recommendations as string[])?.length > 0 && (
              <div className="text-[11px] text-amber-300 space-y-0.5">
                {(result.recommendations as string[]).map((r, i) => <div key={i}>⚠ {r}</div>)}
              </div>
            )}
          </div>
        )}
      </div>
    </ToolCard>
  );
}

function HeadlineAnalyzerTool() {
  const [headline, setHeadline] = React.useState("");
  const [keyword, setKeyword] = React.useState("");
  const [result, setResult] = React.useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = React.useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const r = await callTool<Record<string, unknown>>("sage.headline.analyze", { headline, targetKeyword: keyword || undefined });
      setResult(r);
    } finally { setLoading(false); }
  };

  return (
    <ToolCard title="Headline Analyzer" description="Score your headline for CTR potential (0-100).">
      <div className="space-y-2">
        <Input value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="The Ultimate Guide to AI SEO in 2026" className="bg-background border-white/[0.08] text-sm" />
        <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="target keyword (optional)" className="bg-background border-white/[0.08] text-sm" />
        <RunButton onClick={run} loading={loading}>Analyze</RunButton>
        {result && (
          <div className="mt-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl font-display font-bold text-foreground">{result.score as number}/100</span>
              <span className={cn("text-sm font-bold px-2 py-0.5 rounded", (result.grade as string) >= "A" ? "text-emerald-300 bg-emerald-500/15" : (result.grade as string) >= "C" ? "text-amber-300 bg-amber-500/15" : "text-red-300 bg-red-500/15")}>Grade {result.grade as string}</span>
            </div>
            <div className="space-y-1">
              {(result.checks as Array<Record<string, unknown>>)?.map((c, i) => (
                <div key={i} className="text-[11px] flex items-start gap-1.5">
                  <span className={c.passed ? "text-emerald-400" : "text-red-400"}>{c.passed ? "✓" : "✗"}</span>
                  <span className="text-foreground/80"><b>{c.name as string}:</b> {c.detail as string}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  );
}

function ReadabilityTool() {
  const [text, setText] = React.useState("");
  const [result, setResult] = React.useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = React.useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const r = await callTool<Record<string, unknown>>("sage.readability.analyze", { text });
      setResult(r);
    } finally { setLoading(false); }
  };

  return (
    <ToolCard title="Readability Analyzer" description="Flesch Reading Ease, Grade Level, passive voice, sentence complexity.">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="Paste your content here..." className="w-full rounded-md border border-white/[0.08] bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
      <div className="mt-2"><RunButton onClick={run} loading={loading}>Analyze</RunButton></div>
      {result && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <Metric label="Flesch" value={`${result.fleschReadingEase as number}`} sub={result.readingLevel as string} />
          <Metric label="Grade Level" value={`${result.fleschGrade as number}`} />
          <Metric label="Avg Sentence" value={`${result.avgSentenceLength as number} words`} />
          <Metric label="Passive Voice" value={`${result.passiveVoicePct as number}%`} />
        </div>
      )}
    </ToolCard>
  );
}

function KeywordDensityTool() {
  const [text, setText] = React.useState("");
  const [keyword, setKeyword] = React.useState("");
  const [result, setResult] = React.useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = React.useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const r = await callTool<Record<string, unknown>>("sage.keyword.density", { text, targetKeyword: keyword || undefined });
      setResult(r);
    } finally { setLoading(false); }
  };

  return (
    <ToolCard title="Keyword Density" description="Check keyword density + top words/phrases. Flags stuffing risk.">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="Paste content..." className="w-full rounded-md border border-white/[0.08] bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
      <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="target keyword (optional)" className="mt-2 bg-background border-white/[0.08] text-sm" />
      <div className="mt-2"><RunButton onClick={run} loading={loading}>Analyze</RunButton></div>
      {result && (
        <div className="mt-3 space-y-2">
          {result.targetKeyword && (
            <div className={cn("text-xs p-2 rounded border", (result.targetKeyword as Record<string, unknown>).optimal ? "border-emerald-500/20 bg-emerald-500/[0.04] text-emerald-200" : "border-amber-500/20 bg-amber-500/[0.04] text-amber-200")}>
              <b>{(result.targetKeyword as Record<string, unknown>).keyword as string}</b>: {(result.targetKeyword as Record<string, unknown>).count as number} occurrences ({(result.targetKeyword as Record<string, unknown>).density as number}% density) — {(result.targetKeyword as Record<string, unknown>).status as string}
            </div>
          )}
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Top words</div>
            <div className="flex flex-wrap gap-1">
              {(result.topSingleWords as Array<Record<string, unknown>>)?.slice(0, 8).map((w, i) => (
                <span key={i} className="text-[10px] bg-white/[0.04] px-1.5 py-0.5 rounded">{w.word as string} {w.density as number}%</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </ToolCard>
  );
}

function FeaturedSnippetTool() {
  const [keyword, setKeyword] = React.useState("");
  const [result, setResult] = React.useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = React.useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const r = await callTool<Record<string, unknown>>("sage.featured.snippet.check", { keyword });
      setResult(r);
    } finally { setLoading(false); }
  };

  return (
    <ToolCard title="Featured Snippet Checker" description="Check if a keyword has a snippet + how to win it.">
      <div className="flex gap-2">
        <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="how to do seo" className="bg-background border-white/[0.08] text-sm" />
        <RunButton onClick={run} loading={loading}>Check</RunButton>
      </div>
      {result && (
        <div className="mt-3 space-y-2">
          <div className="text-xs">
            <span className="text-muted-foreground">Snippet type: </span>
            <span className="text-emerald-300 font-semibold capitalize">{result.snippetType as string}</span>
          </div>
          <div className="text-[11px] space-y-0.5">
            {(result.tips as string[])?.map((t, i) => <div key={i} className="text-foreground/80">→ {t}</div>)}
          </div>
        </div>
      )}
    </ToolCard>
  );
}

function CannibalizationTool({ siteId }: { siteId: string }) {
  const [result, setResult] = React.useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = React.useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const r = await callTool<Record<string, unknown>>("sage.cannibalization.check", { siteId });
      setResult(r);
    } finally { setLoading(false); }
  };

  return (
    <ToolCard title="Cannibalization Checker" description="Find keywords where multiple pages compete.">
      <RunButton onClick={run} loading={loading}>Check Site</RunButton>
      {result && (
        <div className="mt-3">
          <div className="text-xs text-muted-foreground mb-2">
            {result.cannibalizedCount as number} cannibalized keywords out of {result.totalKeywords as number} total
          </div>
          {(result.cannibalizedKeywords as Array<Record<string, unknown>>)?.length > 0 ? (
            <div className="space-y-1">
              {(result.cannibalizedKeywords as Array<Record<string, unknown>>).map((k, i) => (
                <div key={i} className="text-xs flex items-center gap-2">
                  <span className="text-red-400">⚠</span>
                  <span className="text-foreground">{k.term as string}</span>
                  <span className="text-muted-foreground">({k.duplicateCount as number} pages)</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-emerald-300">✓ No cannibalization detected</div>
          )}
        </div>
      )}
    </ToolCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tab 5: Schema Generators
// ═══════════════════════════════════════════════════════════════════════════

function SchemaTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <BreadcrumbsTool />
      <AuthorSchemaTool />
      <HreflangTool />
      <TocTool />
    </div>
  );
}

function BreadcrumbsTool() {
  const [items, setItems] = React.useState("Home,/\nBlog,/blog\nPost,/blog/post");
  const [result, setResult] = React.useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = React.useState(false);

  const run = async () => {
    const parsed = items.split("\n").map((line) => {
      const [name, url] = line.split(",");
      return { name: name?.trim(), url: url?.trim() };
    }).filter((i) => i.name);
    setLoading(true);
    try {
      const r = await callTool<Record<string, unknown>>("sage.breadcrumbs.generate", { items: parsed });
      setResult(r);
    } finally { setLoading(false); }
  };

  return (
    <ToolCard title="Breadcrumbs Schema" description="Generate BreadcrumbList JSON-LD. One item per line: name,url">
      <textarea value={items} onChange={(e) => setItems(e.target.value)} rows={4} className="w-full rounded-md border border-white/[0.08] bg-background px-3 py-2 text-xs font-mono resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
      <div className="mt-2"><RunButton onClick={run} loading={loading}>Generate</RunButton></div>
      {result && <OutputBlock label="JSON-LD" content={result.json as string} />}
    </ToolCard>
  );
}

function AuthorSchemaTool() {
  const [form, setForm] = React.useState({ name: "", jobTitle: "", bio: "", url: "", image: "", sameAs: "" });
  const [result, setResult] = React.useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = React.useState(false);

  const run = async () => {
    const sameAs = form.sameAs.split("\n").map((s) => s.trim()).filter(Boolean);
    setLoading(true);
    try {
      const r = await callTool<Record<string, unknown>>("sage.author.schema", { ...form, sameAs });
      setResult(r);
    } finally { setLoading(false); }
  };

  return (
    <ToolCard title="Author Schema (E-E-A-T)" description="Person schema for author authority signals.">
      <div className="space-y-2">
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Author name" className="bg-background border-white/[0.08] text-sm" />
        <Input value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} placeholder="Job title" className="bg-background border-white/[0.08] text-sm" />
        <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={2} placeholder="Bio" className="w-full rounded-md border border-white/[0.08] bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
        <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="Profile URL" className="bg-background border-white/[0.08] text-sm" />
        <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Headshot URL" className="bg-background border-white/[0.08] text-sm" />
        <textarea value={form.sameAs} onChange={(e) => setForm({ ...form, sameAs: e.target.value })} rows={2} placeholder="Social URLs (one per line)" className="w-full rounded-md border border-white/[0.08] bg-background px-3 py-2 text-xs font-mono resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
        <RunButton onClick={run} loading={loading}>Generate</RunButton>
      </div>
      {result && <OutputBlock label="JSON-LD" content={result.json as string} />}
    </ToolCard>
  );
}

function HreflangTool() {
  const [pages, setPages] = React.useState("en-US,https://example.com\nes-ES,https://example.com/es\nfr-FR,https://example.com/fr");
  const [defaultUrl, setDefaultUrl] = React.useState("https://example.com");
  const [result, setResult] = React.useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = React.useState(false);

  const run = async () => {
    const parsed = pages.split("\n").map((line) => {
      const [locale, url] = line.split(",");
      return { locale: locale?.trim(), url: url?.trim() };
    }).filter((p) => p.locale && p.url);
    setLoading(true);
    try {
      const r = await callTool<Record<string, unknown>>("sage.hreflang.generate", { pages: parsed, defaultUrl });
      setResult(r);
    } finally { setLoading(false); }
  };

  return (
    <ToolCard title="Hreflang Tags" description="Generate hreflang link tags for multilingual SEO. Format: locale,url per line">
      <textarea value={pages} onChange={(e) => setPages(e.target.value)} rows={4} className="w-full rounded-md border border-white/[0.08] bg-background px-3 py-2 text-xs font-mono resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
      <Input value={defaultUrl} onChange={(e) => setDefaultUrl(e.target.value)} placeholder="x-default URL" className="mt-2 bg-background border-white/[0.08] text-sm" />
      <div className="mt-2"><RunButton onClick={run} loading={loading}>Generate</RunButton></div>
      {result && <OutputBlock label="HTML link tags" content={result.html as string} />}
    </ToolCard>
  );
}

function TocTool() {
  const [markdown, setMarkdown] = React.useState("# Title\n\n## Introduction\n\n## Main Section\n\n### Subsection 1\n\n### Subsection 2\n\n## Conclusion");
  const [result, setResult] = React.useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = React.useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const r = await callTool<Record<string, unknown>>("sage.toc.generate", { markdown });
      setResult(r);
    } finally { setLoading(false); }
  };

  return (
    <ToolCard title="Table of Contents" description="Generate TOC from markdown headings with anchor links.">
      <textarea value={markdown} onChange={(e) => setMarkdown(e.target.value)} rows={5} className="w-full rounded-md border border-white/[0.08] bg-background px-3 py-2 text-xs font-mono resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
      <div className="mt-2"><RunButton onClick={run} loading={loading}>Generate TOC</RunButton></div>
      {result && <OutputBlock label="TOC HTML" content={result.toc as string} />}
    </ToolCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tab 6: Image SEO & PageSpeed
// ═══════════════════════════════════════════════════════════════════════════

function ImageTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ImageSeoTool />
      <PageSpeedTool />
      <LocalSeoTool />
    </div>
  );
}

function ImageSeoTool() {
  const [form, setForm] = React.useState({ imageUrl: "", altText: "", contextKeyword: "" });
  const [result, setResult] = React.useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = React.useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const r = await callTool<Record<string, unknown>>("sage.image.seo", form);
      setResult(r);
    } finally { setLoading(false); }
  };

  return (
    <ToolCard title="Image SEO Analyzer" description="Check alt text, filename, format, keyword usage.">
      <div className="space-y-2">
        <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://example.com/image.jpg" className="bg-background border-white/[0.08] text-sm" />
        <Input value={form.altText} onChange={(e) => setForm({ ...form, altText: e.target.value })} placeholder="Current alt text" className="bg-background border-white/[0.08] text-sm" />
        <Input value={form.contextKeyword} onChange={(e) => setForm({ ...form, contextKeyword: e.target.value })} placeholder="Context keyword" className="bg-background border-white/[0.08] text-sm" />
        <RunButton onClick={run} loading={loading}>Analyze</RunButton>
      </div>
      {result && (
        <div className="mt-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl font-display font-bold text-foreground">{result.score as number}/100</span>
          </div>
          <div className="space-y-1">
            {(result.checks as Array<Record<string, unknown>>)?.map((c, i) => (
              <div key={i} className="text-[11px] flex items-start gap-1.5">
                <span className={c.passed ? "text-emerald-400" : "text-red-400"}>{c.passed ? "✓" : "✗"}</span>
                <span className="text-foreground/80"><b>{c.name as string}:</b> {c.detail as string}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolCard>
  );
}

function PageSpeedTool() {
  const [url, setUrl] = React.useState("");
  const [strategy, setStrategy] = React.useState("mobile");
  const [result, setResult] = React.useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = React.useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const r = await callTool<Record<string, unknown>>("sage.pagespeed.check", { url, strategy });
      setResult(r);
    } finally { setLoading(false); }
  };

  return (
    <ToolCard title="PageSpeed Insights" description="Live Google PageSpeed API — Core Web Vitals + performance score.">
      <div className="space-y-2">
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" className="bg-background border-white/[0.08] text-sm" />
        <select value={strategy} onChange={(e) => setStrategy(e.target.value)} className="block rounded-md border border-white/[0.08] bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/40">
          <option value="mobile">Mobile</option>
          <option value="desktop">Desktop</option>
        </select>
        <RunButton onClick={run} loading={loading}>Run Test</RunButton>
      </div>
      {result && !result.error && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-3">
            <div className={cn("text-3xl font-display font-bold", (result.score as number) >= 90 ? "text-emerald-400" : (result.score as number) >= 50 ? "text-amber-400" : "text-red-400")}>
              {result.score as number}
            </div>
            <div className="text-xs text-muted-foreground">Performance Score ({strategy})</div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Metric label="LCP" value={(result.metrics as Record<string, string>)?.lcp || "N/A"} />
            <Metric label="CLS" value={(result.metrics as Record<string, string>)?.cls || "N/A"} />
            <Metric label="FCP" value={(result.metrics as Record<string, string>)?.fcp || "N/A"} />
            <Metric label="TTFB" value={(result.metrics as Record<string, string>)?.ttfb || "N/A"} />
          </div>
        </div>
      )}
      {result?.error && <div className="mt-2 text-xs text-red-300">{result.error as string}</div>}
    </ToolCard>
  );
}

function LocalSeoTool() {
  const [form, setForm] = React.useState({ businessName: "", streetAddress: "", addressLocality: "", addressRegion: "", postalCode: "", phone: "", website: "" });
  const [result, setResult] = React.useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = React.useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const r = await callTool<Record<string, unknown>>("sage.local.seo", form);
      setResult(r);
    } finally { setLoading(false); }
  };

  return (
    <ToolCard title="LocalBusiness Schema" description="Generate LocalBusiness JSON-LD + NAP consistency checklist.">
      <div className="space-y-2">
        <Input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} placeholder="Business name" className="bg-background border-white/[0.08] text-sm" />
        <Input value={form.streetAddress} onChange={(e) => setForm({ ...form, streetAddress: e.target.value })} placeholder="Street address" className="bg-background border-white/[0.08] text-sm" />
        <div className="grid grid-cols-2 gap-2">
          <Input value={form.addressLocality} onChange={(e) => setForm({ ...form, addressLocality: e.target.value })} placeholder="City" className="bg-background border-white/[0.08] text-sm" />
          <Input value={form.addressRegion} onChange={(e) => setForm({ ...form, addressRegion: e.target.value })} placeholder="State" className="bg-background border-white/[0.08] text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} placeholder="Postal code" className="bg-background border-white/[0.08] text-sm" />
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="bg-background border-white/[0.08] text-sm" />
        </div>
        <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="Website URL" className="bg-background border-white/[0.08] text-sm" />
        <RunButton onClick={run} loading={loading}>Generate</RunButton>
      </div>
      {result && <OutputBlock label="LocalBusiness JSON-LD" content={result.json as string} />}
    </ToolCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tab 7: AI Crawler Control
// ═══════════════════════════════════════════════════════════════════════════

function BotsTab({ siteId }: { siteId: string }) {
  const { data, isLoading } = useBotBlockerList(siteId);
  const botSet = useBotBlockerSet();

  const knownBots = (data?.knownBots as Array<Record<string, unknown>>) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ToolCard title="AI Crawler Control" description="Block or allow AI training crawlers. Updates robots.txt rules.">
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : (
          <div className="space-y-2">
            {knownBots.map((bot) => {
              const action = bot.action as string;
              const configured = bot.configured as boolean;
              return (
                <div key={bot.name as string} className="flex items-center gap-3 rounded-md border border-white/[0.04] bg-white/[0.01] p-2.5">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{bot.name as string}</div>
                    <div className="text-[10px] text-muted-foreground">{bot.owner as string} — {bot.purpose as string}</div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => botSet.mutate({ siteId, botName: bot.name as string, action: "block" })}
                      className={cn("text-[10px] px-2 py-1 rounded font-medium transition-colors", action === "block" ? "bg-red-500/20 text-red-300 border border-red-500/30" : "bg-white/[0.04] text-muted-foreground hover:text-red-300 border border-transparent")}
                    >
                      Block
                    </button>
                    <button
                      onClick={() => botSet.mutate({ siteId, botName: bot.name as string, action: "allow" })}
                      className={cn("text-[10px] px-2 py-1 rounded font-medium transition-colors", action === "allow" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-white/[0.04] text-muted-foreground hover:text-emerald-300 border border-transparent")}
                    >
                      Allow
                    </button>
                  </div>
                  {!configured && <span className="text-[9px] text-muted-foreground/60">unconfigured</span>}
                </div>
              );
            })}
          </div>
        )}
        <div className="mt-3 text-[11px] text-muted-foreground bg-white/[0.02] border border-white/[0.04] rounded p-2">
          💡 Blocking AI crawlers prevents your content from being used to train AI models. Allow if you want AI engines to cite your content.
        </div>
      </ToolCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tab 8: Indexing & Bulk Ops
// ═══════════════════════════════════════════════════════════════════════════

function IndexingTab({ siteId }: { siteId: string }) {
  const [urls, setUrls] = React.useState("");
  const [result, setResult] = React.useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [csvOut, setCsvOut] = React.useState("");
  const [csvIn, setCsvIn] = React.useState("");
  const [importResult, setImportResult] = React.useState<Record<string, unknown> | null>(null);

  const submitIndexNow = async () => {
    const urlList = urls.split("\n").map((u) => u.trim()).filter(Boolean);
    if (urlList.length === 0) return;
    setLoading(true);
    try {
      const r = await callTool<Record<string, unknown>>("sage.indexnow.submit", { siteId, urls: urlList });
      setResult(r);
    } finally { setLoading(false); }
  };

  const exportCsv = async () => {
    setLoading(true);
    try {
      const r = await callTool<{ csv: string; recordCount: number }>("sage.bulk.meta.export", { siteId });
      setCsvOut(r.csv);
    } finally { setLoading(false); }
  };

  const importCsv = async () => {
    if (!csvIn) return;
    setLoading(true);
    try {
      const r = await callTool<Record<string, unknown>>("sage.bulk.meta.import", { siteId, csv: csvIn });
      setImportResult(r);
    } finally { setLoading(false); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ToolCard title="IndexNow Submission" description="Submit URLs to Bing + Yandex for instant indexing. One URL per line.">
        <textarea value={urls} onChange={(e) => setUrls(e.target.value)} rows={5} placeholder="https://example.com/page-1\nhttps://example.com/page-2" className="w-full rounded-md border border-white/[0.08] bg-background px-3 py-2 text-xs font-mono resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
        <div className="mt-2"><RunButton onClick={submitIndexNow} loading={loading}>Submit to IndexNow</RunButton></div>
        {result && (
          <div className="mt-3 text-xs space-y-1">
            <div className="text-emerald-300">✓ Submitted {result.submitted as number} URLs</div>
            <div className="text-muted-foreground">Status: {result.status as string} (HTTP {result.responseCode as number})</div>
            {result.keyFile && (
              <div className="mt-2 p-2 bg-white/[0.02] border border-white/[0.04] rounded">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Verification key file</div>
                <div className="font-mono text-[10px] text-foreground mt-0.5">{(result.keyFile as Record<string, unknown>).publishPath as string}</div>
                <div className="font-mono text-[10px] text-emerald-300 mt-0.5">{(result.keyFile as Record<string, unknown>).content as string}</div>
              </div>
            )}
          </div>
        )}
      </ToolCard>

      <ToolCard title="Bulk Meta Export" description="Export all meta records as CSV for editing in Excel/Sheets.">
        <RunButton onClick={exportCsv} loading={loading}><Download className="h-3.5 w-3.5" /> Export CSV</RunButton>
        {csvOut && <OutputBlock label="CSV Export" content={csvOut} />}
      </ToolCard>

      <ToolCard title="Bulk Meta Import" description="Import edited CSV. Same format as export. Updates existing + creates new.">
        <textarea value={csvIn} onChange={(e) => setCsvIn(e.target.value)} rows={5} placeholder="url,title,description&#10;/blog/post,My Title,My description" className="w-full rounded-md border border-white/[0.08] bg-background px-3 py-2 text-xs font-mono resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
        <div className="mt-2"><RunButton onClick={importCsv} loading={loading}><Upload className="h-3.5 w-3.5" /> Import CSV</RunButton></div>
        {importResult && (
          <div className="mt-3 text-xs space-y-1">
            <div className="text-emerald-300">✓ Imported {(importResult.results as Record<string, unknown>)?.updated as number} records</div>
            {((importResult.results as Record<string, unknown>)?.errors as string[])?.length > 0 && (
              <div className="text-red-300">{((importResult.results as Record<string, unknown>)?.errors as string[]).length} errors</div>
            )}
          </div>
        )}
      </ToolCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tab 9: Content Brief & SERP Analyzer
// ═══════════════════════════════════════════════════════════════════════════

function BriefsTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ContentBriefTool />
      <SerpAnalyzerTool />
    </div>
  );
}

function ContentBriefTool() {
  const [form, setForm] = React.useState({ targetKeyword: "", title: "", wordCount: 2000, headings: "", relatedTerms: "", notes: "" });
  const [result, setResult] = React.useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = React.useState(false);

  const run = async () => {
    const headings = form.headings.split("\n").map((h) => h.trim()).filter(Boolean);
    const relatedTerms = form.relatedTerms.split(",").map((t) => t.trim()).filter(Boolean);
    setLoading(true);
    try {
      const r = await callTool<Record<string, unknown>>("sage.content.brief", { ...form, headings, relatedTerms });
      setResult(r);
    } finally { setLoading(false); }
  };

  return (
    <ToolCard title="Content Brief Builder" description="Build a manual brief for a human writer. No AI — you specify everything.">
      <div className="space-y-2">
        <Input value={form.targetKeyword} onChange={(e) => setForm({ ...form, targetKeyword: e.target.value })} placeholder="Target keyword" className="bg-background border-white/[0.08] text-sm" />
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Article title" className="bg-background border-white/[0.08] text-sm" />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Word Count</Label>
            <Input type="number" value={form.wordCount} onChange={(e) => setForm({ ...form, wordCount: Number(e.target.value) })} className="mt-1 bg-background border-white/[0.08] text-sm" />
          </div>
        </div>
        <textarea value={form.headings} onChange={(e) => setForm({ ...form, headings: e.target.value })} rows={4} placeholder="Required headings (one per line)" className="w-full rounded-md border border-white/[0.08] bg-background px-3 py-2 text-xs font-mono resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
        <Input value={form.relatedTerms} onChange={(e) => setForm({ ...form, relatedTerms: e.target.value })} placeholder="Related terms (comma-separated)" className="bg-background border-white/[0.08] text-sm" />
        <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Notes for writer" className="w-full rounded-md border border-white/[0.08] bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
        <RunButton onClick={run} loading={loading}>Generate Brief</RunButton>
      </div>
      {result && <OutputBlock label="Content Brief" content={result.briefMarkdown as string} />}
    </ToolCard>
  );
}

function SerpAnalyzerTool() {
  const [keyword, setKeyword] = React.useState("");
  const [engine, setEngine] = React.useState("google");
  const [result, setResult] = React.useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = React.useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const r = await callTool<Record<string, unknown>>("sage.serp.analyzer", { keyword, engine });
      setResult(r);
    } finally { setLoading(false); }
  };

  return (
    <ToolCard title="SERP Analyzer" description="Analyze top 10 Google results for a keyword. Word count, headings, gaps.">
      <div className="flex gap-2">
        <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="ai seo platform" className="bg-background border-white/[0.08] text-sm" />
        <select value={engine} onChange={(e) => setEngine(e.target.value)} className="rounded-md border border-white/[0.08] bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/40">
          <option value="google">Google</option>
          <option value="bing">Bing</option>
        </select>
        <RunButton onClick={run} loading={loading}>Analyze</RunButton>
      </div>
      {result && (
        <div className="mt-3 space-y-3 text-xs">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Top Results</div>
            {(result.topResults as Array<Record<string, unknown>>)?.map((r, i) => (
              <div key={i} className="flex items-center gap-2 py-1 border-b border-white/[0.03] last:border-0">
                <span className="text-emerald-300 font-mono w-4">#{r.position as number}</span>
                <span className="text-foreground truncate flex-1">{r.domain as string}</span>
                <span className="text-muted-foreground">{r.estimatedWords as number} words</span>
              </div>
            ))}
          </div>
          <div className="p-2 bg-white/[0.02] border border-white/[0.04] rounded">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Word Count Analysis</div>
            <div className="text-foreground mt-0.5">Median: {(result.wordCountAnalysis as Record<string, unknown>)?.median as number} words</div>
            <div className="text-emerald-300">{(result.wordCountAnalysis as Record<string, unknown>)?.recommendation as string}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Content Gaps</div>
            {(result.contentGaps as string[])?.map((g, i) => (
              <div key={i} className="text-foreground/80">→ {g}</div>
            ))}
          </div>
        </div>
      )}
    </ToolCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════════════

function Metric({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-md bg-white/[0.02] border border-white/[0.04] px-2 py-1.5">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm font-display font-bold text-foreground">{value}</div>
      {sub && <div className="text-[9px] text-muted-foreground truncate">{sub}</div>}
    </div>
  );
}
