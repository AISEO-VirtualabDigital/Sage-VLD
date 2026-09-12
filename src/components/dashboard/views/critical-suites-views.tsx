"use client";

import * as React from "react";
import { Loader2, Search, TrendingUp, ExternalLink, AlertTriangle, Check, X, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { callTool } from "../api";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════════════════
// Shared components
// ═══════════════════════════════════════════════════════════════════════════

function ToolCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Card className="p-5 bg-white/[0.02] border-white/[0.06]">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground mt-0.5 mb-4">{description}</p>
      {children}
    </Card>
  );
}

function RunButton({ onClick, loading, children, className }: { onClick: () => void; loading: boolean; children: React.ReactNode; className?: string }) {
  return (
    <Button onClick={onClick} disabled={loading} size="sm" className={cn("bg-emerald-500 text-emerald-950 hover:bg-emerald-400", className)}>
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
      {children}
    </Button>
  );
}

function Metric({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-md bg-white/[0.02] border border-white/[0.04] px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-lg font-display font-bold text-foreground">{value}</div>
      {sub && <div className="text-[9px] text-muted-foreground truncate">{sub}</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Backlinks View
// ═══════════════════════════════════════════════════════════════════════════

export function BacklinksView({ siteId }: { siteId: string }) {
  const [profile, setProfile] = React.useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [toxic, setToxic] = React.useState<Record<string, unknown> | null>(null);
  const [loadingToxic, setLoadingToxic] = React.useState(false);
  const [lost, setLost] = React.useState<Record<string, unknown> | null>(null);
  const [loadingLost, setLoadingLost] = React.useState(false);
  const [competitorDomain, setCompetitorDomain] = React.useState("");
  const [compBacklinks, setCompBacklinks] = React.useState<Record<string, unknown> | null>(null);
  const [loadingComp, setLoadingComp] = React.useState(false);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const r = await callTool<Record<string, unknown>>("sage.backlinks.profile", { siteId });
      setProfile(r);
    } finally { setLoading(false); }
  };

  const loadToxic = async () => {
    setLoadingToxic(true);
    try {
      const r = await callTool<Record<string, unknown>>("sage.backlinks.toxic.check", { siteId });
      setToxic(r);
    } finally { setLoadingToxic(false); }
  };

  const loadLost = async () => {
    setLoadingLost(true);
    try {
      const r = await callTool<Record<string, unknown>>("sage.backlinks.lost", { siteId, days: 90 });
      setLost(r);
    } finally { setLoadingLost(false); }
  };

  const loadComp = async () => {
    if (!competitorDomain) return;
    setLoadingComp(true);
    try {
      const r = await callTool<Record<string, unknown>>("sage.backlinks.competitor", { siteId, competitorDomain });
      setCompBacklinks(r);
    } finally { setLoadingComp(false); }
  };

  React.useEffect(() => { loadProfile(); loadLost(); }, [siteId]);

  const p = profile?.profile as Record<string, unknown> | undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Backlinks</h1>
        <p className="text-sm text-muted-foreground mt-1">Backlink profile, monitoring, toxic detection, competitor analysis, disavow.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Metric label="Total Backlinks" value={p?.totalBacklinks as number ?? "—"} />
        <Metric label="Referring Domains" value={p?.referringDomains as number ?? "—"} />
        <Metric label="Dofollow" value={p?.dofollowCount as number ?? "—"} />
        <Metric label="Avg DA" value={p?.avgDomainAuthority ? Math.round(p.avgDomainAuthority as number) : "—"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ToolCard title="Backlink Profile" description="Full backlink profile with anchor text + linking domains">
          <RunButton onClick={loadProfile} loading={loading}>Refresh Profile</RunButton>
          {profile && p && (
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Dofollow / Nofollow</span><span className="text-foreground">{p.dofollowCount as number} / {p.nofollowCount as number}</span></div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Top Anchors</div>
                {(p.topAnchorTexts as Array<Record<string, unknown>>)?.slice(0, 5).map((a, i) => (
                  <div key={i} className="flex justify-between py-0.5"><span className="text-foreground/80 truncate">{a.anchor as string}</span><span className="text-muted-foreground">{a.count as number}</span></div>
                ))}
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Top Linking Domains</div>
                {(p.topLinkingDomains as string[])?.slice(0, 5).map((d, i) => <div key={i} className="text-foreground/80">{d}</div>)}
              </div>
            </div>
          )}
        </ToolCard>

        <ToolCard title="Toxic Backlinks" description="Scan for spammy/toxic links that could hurt rankings">
          <RunButton onClick={loadToxic} loading={loadingToxic}>Scan Toxic Links</RunButton>
          {toxic && (
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Total checked</span><span className="text-foreground">{toxic.totalChecked as number}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Toxic found</span><span className="text-red-400 font-semibold">{toxic.toxicCount as number}</span></div>
              {(toxic.toxicLinks as Array<Record<string, unknown>>)?.slice(0, 3).map((l, i) => (
                <div key={i} className="flex items-center gap-2 py-1 border-t border-white/[0.04]">
                  <AlertTriangle className="h-3 w-3 text-red-400 shrink-0" />
                  <span className="text-foreground/80 truncate">{l.sourceDomain as string}</span>
                  <span className="text-red-400 ml-auto">{l.toxicityScore as number}</span>
                </div>
              ))}
              {toxic.toxicCount as number > 0 && (
                <div className="text-[11px] text-amber-300 mt-2">{toxic.recommendation as string}</div>
              )}
            </div>
          )}
        </ToolCard>

        <ToolCard title="Lost Backlinks" description="Backlinks that used to point to your site but no longer do">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Last 90 days</span>
          </div>
          {lost && (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Lost count</span><span className="text-red-400 font-semibold">{lost.lostCount as number}</span></div>
              {(lost.lostBacklinks as Array<Record<string, unknown>>)?.slice(0, 5).map((l, i) => (
                <div key={i} className="flex items-center gap-2 py-1 border-t border-white/[0.04]">
                  <X className="h-3 w-3 text-red-400 shrink-0" />
                  <span className="text-foreground/80 truncate">{l.sourceDomain as string}</span>
                  <span className="text-muted-foreground ml-auto text-[10px]">{l.anchorText as string}</span>
                </div>
              ))}
              {lost.lostCount as number === 0 && <div className="text-emerald-300">No lost backlinks in this period</div>}
            </div>
          )}
        </ToolCard>

        <ToolCard title="Competitor Backlinks" description="Analyze a competitor's backlink profile + find link-building opportunities">
          <div className="flex gap-2">
            <Input value={competitorDomain} onChange={(e) => setCompetitorDomain(e.target.value)} placeholder="competitor.com" className="bg-background border-white/[0.08] text-sm" />
            <RunButton onClick={loadComp} loading={loadingComp}>Analyze</RunButton>
          </div>
          {compBacklinks && (
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Competitor total</span><span className="text-foreground">{(compBacklinks.competitor as Record<string, unknown>)?.totalBacklinks as number}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Opportunities</span><span className="text-emerald-400 font-semibold">{(compBacklinks.opportunities as Record<string, unknown>)?.count as number}</span></div>
              <div className="text-[11px] text-emerald-300 mt-2">{(compBacklinks.opportunities as Record<string, unknown>)?.note as string}</div>
              {((compBacklinks.opportunities as Record<string, unknown>)?.domains as Array<Record<string, unknown>>)?.slice(0, 3).map((d, i) => (
                <div key={i} className="flex items-center gap-2 py-1 border-t border-white/[0.04]">
                  <Plus className="h-3 w-3 text-emerald-400 shrink-0" />
                  <span className="text-foreground/80 truncate">{d.domain as string}</span>
                  <span className="text-muted-foreground ml-auto">DA {d.authority as number}</span>
                </div>
              ))}
            </div>
          )}
        </ToolCard>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Keyword Research View
// ═══════════════════════════════════════════════════════════════════════════

export function KeywordResearchView({ siteId }: { siteId: string }) {
  const [seed, setSeed] = React.useState("");
  const [volume, setVolume] = React.useState<Record<string, unknown> | null>(null);
  const [loadingVol, setLoadingVol] = React.useState(false);
  const [paa, setPaa] = React.useState<Record<string, unknown> | null>(null);
  const [loadingPaa, setLoadingPaa] = React.useState(false);
  const [autocomplete, setAutocomplete] = React.useState<Record<string, unknown> | null>(null);
  const [loadingAc, setLoadingAc] = React.useState(false);
  const [lsi, setLsi] = React.useState<Record<string, unknown> | null>(null);
  const [loadingLsi, setLoadingLsi] = React.useState(false);
  const [gap, setGap] = React.useState<Record<string, unknown> | null>(null);
  const [loadingGap, setLoadingGap] = React.useState(false);
  const [competitors, setCompetitors] = React.useState("ahrefs.com\nsemrush.com");

  const runVolume = async () => {
    if (!seed) return;
    setLoadingVol(true);
    try {
      const r = await callTool<Record<string, unknown>>("sage.keywords.volume", { siteId, keywords: [seed] });
      setVolume(r);
    } finally { setLoadingVol(false); }
  };

  const runPaa = async () => {
    if (!seed) return;
    setLoadingPaa(true);
    try {
      const r = await callTool<Record<string, unknown>>("sage.keywords.paa", { keyword: seed, depth: 10 });
      setPaa(r);
    } finally { setLoadingPaa(false); }
  };

  const runAc = async () => {
    if (!seed) return;
    setLoadingAc(true);
    try {
      const r = await callTool<Record<string, unknown>>("sage.keywords.autocomplete", { keyword: seed });
      setAutocomplete(r);
    } finally { setLoadingAc(false); }
  };

  const runLsi = async () => {
    if (!seed) return;
    setLoadingLsi(true);
    try {
      const r = await callTool<Record<string, unknown>>("sage.keywords.lsi", { keyword: seed });
      setLsi(r);
    } finally { setLoadingLsi(false); }
  };

  const runGap = async () => {
    const comps = competitors.split("\n").map((c) => c.trim()).filter(Boolean);
    if (comps.length === 0) return;
    setLoadingGap(true);
    try {
      const r = await callTool<Record<string, unknown>>("sage.keywords.gap", { siteId, competitors: comps, limit: 20 });
      setGap(r);
    } finally { setLoadingGap(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Keyword Research</h1>
        <p className="text-sm text-muted-foreground mt-1">Volume, difficulty, autocomplete, PAA, LSI, gap analysis — all the keyword research tools.</p>
      </div>

      {/* Seed input */}
      <Card className="p-4 bg-white/[0.02] border-white/[0.06]">
        <Label className="text-xs text-foreground">Seed Keyword</Label>
        <div className="flex gap-2 mt-1">
          <Input value={seed} onChange={(e) => setSeed(e.target.value)} placeholder="ai seo" className="bg-background border-white/[0.08] text-sm" onKeyDown={(e) => e.key === "Enter" && runVolume()} />
          <RunButton onClick={runVolume} loading={loadingVol}><Search className="h-3.5 w-3.5" /> Research</RunButton>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Volume + Difficulty */}
        <ToolCard title="Volume & Difficulty" description="Search volume, CPC, competition, difficulty score">
          {volume && (
            <div className="space-y-2">
              {(volume.keywords as Array<Record<string, unknown>>).map((kw, i) => (
                <div key={i} className="grid grid-cols-2 gap-2 text-xs">
                  <Metric label="Keyword" value={kw.keyword as string} />
                  <Metric label="Volume" value={kw.searchVolume as number} />
                  <Metric label="Difficulty" value={`${kw.difficulty as number}/100`} sub={kw.difficulty as number < 30 ? "Easy" : kw.difficulty as number < 60 ? "Medium" : "Hard"} />
                  <Metric label="CPC" value={`$${kw.cpc as number}`} />
                  <Metric label="Intent" value={kw.intent as string} />
                </div>
              ))}
            </div>
          )}
        </ToolCard>

        {/* People Also Ask */}
        <ToolCard title="People Also Ask" description="Questions Google shows in PAA boxes — perfect for FAQ content">
          <RunButton onClick={runPaa} loading={loadingPaa} className="mb-2">Get PAA Questions</RunButton>
          {paa && (
            <div className="space-y-1.5">
              {(paa.questions as string[])?.map((q, i) => (
                <div key={i} className="text-xs text-foreground/80 py-1 border-t border-white/[0.04] first:border-0">? {q}</div>
              ))}
            </div>
          )}
        </ToolCard>

        {/* Autocomplete */}
        <ToolCard title="Autocomplete Suggestions" description="Long-tail variations people actually search">
          <RunButton onClick={runAc} loading={loadingAc} className="mb-2">Get Suggestions</RunButton>
          {autocomplete && (
            <div className="flex flex-wrap gap-1">
              {(autocomplete.suggestions as string[])?.map((s, i) => (
                <span key={i} className="text-[10px] bg-white/[0.04] px-2 py-0.5 rounded text-foreground/80">{s}</span>
              ))}
            </div>
          )}
        </ToolCard>

        {/* LSI Keywords */}
        <ToolCard title="LSI Keywords" description="Semantically related terms for topical relevance">
          <RunButton onClick={runLsi} loading={loadingLsi} className="mb-2">Get LSI Keywords</RunButton>
          {lsi && (
            <div className="flex flex-wrap gap-1">
              {(lsi.lsiKeywords as string[])?.map((k, i) => (
                <span key={i} className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded">{k}</span>
              ))}
            </div>
          )}
        </ToolCard>

        {/* Keyword Gap */}
        <ToolCard title="Keyword Gap Analysis" description="Find keywords competitors rank for but you don't" className="lg:col-span-2">
          <Label className="text-xs text-foreground">Competitors (one per line)</Label>
          <textarea value={competitors} onChange={(e) => setCompetitors(e.target.value)} rows={3} className="mt-1 w-full rounded-md border border-white/[0.08] bg-background px-3 py-2 text-xs font-mono resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
          <div className="mt-2"><RunButton onClick={runGap} loading={loadingGap}>Find Gap Keywords</RunButton></div>
          {gap && (
            <div className="mt-3">
              <div className="text-xs text-muted-foreground mb-2">{gap.gapCount as number} gap keywords found</div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="text-[10px] uppercase tracking-wider text-muted-foreground border-b border-white/[0.04]">
                    <tr><th className="text-left py-1.5 px-2">Keyword</th><th className="text-right py-1.5 px-2">Volume</th><th className="text-right py-1.5 px-2">Difficulty</th><th className="text-right py-1.5 px-2">Top Pos</th></tr>
                  </thead>
                  <tbody>
                    {(gap.gapKeywords as Array<Record<string, unknown>>)?.slice(0, 10).map((k, i) => (
                      <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.01]">
                        <td className="py-1.5 px-2 text-foreground">{k.keyword as string}</td>
                        <td className="py-1.5 px-2 text-right font-mono text-muted-foreground">{k.volume as number}</td>
                        <td className="py-1.5 px-2 text-right font-mono text-amber-300">{k.difficulty as number}</td>
                        <td className="py-1.5 px-2 text-right font-mono text-emerald-300">#{k.topPosition as number}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </ToolCard>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Competitors View
// ═══════════════════════════════════════════════════════════════════════════

export function CompetitorsView({ siteId }: { siteId: string }) {
  const [domain, setDomain] = React.useState("");
  const [overview, setOverview] = React.useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [contentGaps, setContentGaps] = React.useState<Record<string, unknown> | null>(null);
  const [loadingGaps, setLoadingGaps] = React.useState(false);
  const [battlecard, setBattlecard] = React.useState<Record<string, unknown> | null>(null);
  const [loadingBattle, setLoadingBattle] = React.useState(false);

  const analyze = async () => {
    if (!domain) return;
    setLoading(true);
    try {
      const [ov, gaps, bc] = await Promise.all([
        callTool<Record<string, unknown>>("sage.competitor.overview", { siteId, domain }),
        callTool<Record<string, unknown>>("sage.competitor.content.gaps", { siteId, competitors: [domain], limit: 15 }),
        callTool<Record<string, unknown>>("sage.competitor.battlecard", { siteId, competitorDomain: domain }),
      ]);
      setOverview(ov);
      setContentGaps(gaps);
      setBattlecard(bc);
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Competitor Analysis</h1>
        <p className="text-sm text-muted-foreground mt-1">Domain overview, content gaps, battlecards, traffic estimates.</p>
      </div>

      <Card className="p-4 bg-white/[0.02] border-white/[0.06]">
        <Label className="text-xs text-foreground">Competitor Domain</Label>
        <div className="flex gap-2 mt-1">
          <Input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="ahrefs.com" className="bg-background border-white/[0.08] text-sm" onKeyDown={(e) => e.key === "Enter" && analyze()} />
          <RunButton onClick={analyze} loading={loading}><Search className="h-3.5 w-3.5" /> Analyze</RunButton>
        </div>
      </Card>

      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Metric label="Est. Traffic" value={(overview.overview as Record<string, unknown>)?.estimatedTraffic as number ?? "—"} />
          <Metric label="Keywords" value={(overview.overview as Record<string, unknown>)?.totalKeywords as number ?? "—"} />
          <Metric label="Backlinks" value={(overview.overview as Record<string, unknown>)?.totalBacklinks as number ?? "—"} />
          <Metric label="Domain Authority" value={(overview.overview as Record<string, unknown>)?.domainAuthority as number ?? "—"} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {battlecard && (
          <ToolCard title="Battlecard" description="Side-by-side comparison vs your site">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-md bg-emerald-500/10 border border-emerald-500/20 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-emerald-300 mb-2">You</div>
                  {Object.entries((battlecard.battlecard as Record<string, Record<string, unknown>>)?.you as Record<string, unknown>).filter(([k]) => k !== "domain").map(([k, v]) => (
                    <div key={k} className="flex justify-between py-0.5"><span className="text-muted-foreground capitalize">{k.replace(/([A-Z])/g, " $1").trim()}</span><span className="text-foreground">{String(v)}</span></div>
                  ))}
                </div>
                <div className="rounded-md bg-red-500/10 border border-red-500/20 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-red-300 mb-2">Competitor</div>
                  {Object.entries((battlecard.battlecard as Record<string, Record<string, unknown>>)?.competitor as Record<string, unknown>).filter(([k]) => k !== "domain").map(([k, v]) => (
                    <div key={k} className="flex justify-between py-0.5"><span className="text-muted-foreground capitalize">{k.replace(/([A-Z])/g, " $1").trim()}</span><span className="text-foreground">{String(v)}</span></div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-emerald-300 mb-1">Opportunities</div>
                {((battlecard.battlecard as Record<string, Record<string, unknown>>)?.opportunities as string[])?.map((o, i) => (
                  <div key={i} className="text-xs text-foreground/80 py-0.5">→ {o}</div>
                ))}
              </div>
            </div>
          </ToolCard>
        )}

        {contentGaps && (
          <ToolCard title="Content Gaps" description="Topics competitor covers but you don't">
            <div className="text-xs text-muted-foreground mb-2">{contentGaps.gapCount as number} gaps found</div>
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {(contentGaps.contentGaps as Array<Record<string, unknown>>)?.map((g, i) => (
                <div key={i} className="flex items-start gap-2 text-xs py-1.5 border-t border-white/[0.04] first:border-0">
                  <span className={cn("text-[9px] px-1 py-0.5 rounded shrink-0", g.priority === "high" ? "bg-red-500/15 text-red-300" : g.priority === "medium" ? "bg-amber-500/15 text-amber-300" : "bg-white/[0.04] text-muted-foreground")}>{g.priority as string}</span>
                  <span className="text-foreground/80 flex-1">{g.topic as string}</span>
                  <span className="text-muted-foreground shrink-0">{g.volume as number}/mo</span>
                </div>
              ))}
            </div>
          </ToolCard>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SERP Features View
// ═══════════════════════════════════════════════════════════════════════════

export function SerpFeaturesView({ siteId }: { siteId: string }) {
  const [keyword, setKeyword] = React.useState("");
  const [detected, setDetected] = React.useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [sov, setSov] = React.useState<Record<string, unknown> | null>(null);
  const [loadingSov, setLoadingSov] = React.useState(false);
  const [winning, setWinning] = React.useState<Record<string, unknown> | null>(null);
  const [loadingWin, setLoadingWin] = React.useState(false);

  const detect = async () => {
    if (!keyword) return;
    setLoading(true);
    try {
      const r = await callTool<Record<string, unknown>>("sage.serp.features.detect", { siteId, keyword });
      setDetected(r);
    } finally { setLoading(false); }
  };

  const loadSov = async () => {
    setLoadingSov(true);
    try {
      const r = await callTool<Record<string, unknown>>("sage.serp.features.sov", { siteId });
      setSov(r);
    } finally { setLoadingSov(false); }
  };

  const loadWinning = async () => {
    setLoadingWin(true);
    try {
      const r = await callTool<Record<string, unknown>>("sage.serp.features.winning", { siteId });
      setWinning(r);
    } finally { setLoadingWin(false); }
  };

  React.useEffect(() => { loadSov(); loadWinning(); }, [siteId]);

  const featureColors: Record<string, string> = {
    featured_snippet: "text-emerald-300 bg-emerald-500/10",
    people_also_ask: "text-cyan-300 bg-cyan-500/10",
    image_pack: "text-violet-300 bg-violet-500/10",
    video_carousel: "text-rose-300 bg-rose-500/10",
    local_pack: "text-amber-300 bg-amber-500/10",
    shopping: "text-blue-300 bg-blue-500/10",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">SERP Features</h1>
        <p className="text-sm text-muted-foreground mt-1">Detect, track, and win SERP features — featured snippets, PAA, image packs, more.</p>
      </div>

      {/* Detect */}
      <ToolCard title="Detect SERP Features" description="See which features appear for a keyword + how to win them">
        <div className="flex gap-2">
          <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="ai seo platform" className="bg-background border-white/[0.08] text-sm" onKeyDown={(e) => e.key === "Enter" && detect()} />
          <RunButton onClick={detect} loading={loading}><Search className="h-3.5 w-3.5" /> Detect</RunButton>
        </div>
        {detected && (
          <div className="mt-3 space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {(detected.featuresDetected as string[])?.map((f) => (
                <span key={f} className={cn("text-[10px] px-2 py-0.5 rounded font-medium", featureColors[f] || "bg-white/[0.04] text-muted-foreground")}>{f.replace(/_/g, " ")}</span>
              ))}
            </div>
            <div className="text-xs text-muted-foreground">Your position: <span className="text-emerald-300 font-semibold">#{detected.yourPosition as number}</span></div>
            <div className="space-y-1">
              {(detected.opportunities as Array<Record<string, unknown>>)?.map((o, i) => (
                <div key={i} className="text-xs text-foreground/80">→ <span className="text-emerald-300 capitalize">{(o.feature as string).replace(/_/g, " ")}</span>: {o.recommendation as string}</div>
              ))}
            </div>
          </div>
        )}
      </ToolCard>

      {/* SOV */}
      {sov && (
        <ToolCard title="SERP Feature Share-of-Voice" description="What % of your keywords have each feature + what % you occupy">
          <RunButton onClick={loadSov} loading={loadingSov} className="mb-3">Refresh SOV</RunButton>
          <div className="space-y-2">
            {(sov.featureSOV as Array<Record<string, unknown>>)?.map((f) => (
              <div key={f.feature as string} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground capitalize">{(f.feature as string).replace(/_/g, " ")}</span>
                  <span className="text-muted-foreground">{f.youWinCount as number}/{f.presentOnKeywords as number} won ({f.youWinPercent as number}%)</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden flex">
                  <div className="bg-emerald-500" style={{ width: `${(f.youWinCount as number) / (f.presentOnKeywords as number) * 100}%` }} />
                  <div className="bg-white/[0.1] flex-1" />
                </div>
              </div>
            ))}
          </div>
        </ToolCard>
      )}

      {/* Winning */}
      {winning && (
        <ToolCard title="Features You're Winning" description="SERP features your site currently occupies">
          <RunButton onClick={loadWinning} loading={loadingWin} className="mb-3">Refresh Wins</RunButton>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2 text-xs">
              {(Object.entries(winning.winsByFeature as Record<string, number>) as Array<[string, number]>).map(([feature, count]) => (
                <div key={feature} className="rounded-md bg-emerald-500/10 border border-emerald-500/20 p-2 text-center">
                  <div className="text-lg font-display font-bold text-emerald-300">{count}</div>
                  <div className="text-[9px] text-muted-foreground capitalize">{feature.replace(/_/g, " ")}</div>
                </div>
              ))}
            </div>
            {(winning.wins as Array<Record<string, unknown>>)?.slice(0, 5).map((w, i) => (
              <div key={i} className="flex items-center gap-2 text-xs py-1 border-t border-white/[0.04]">
                <Check className="h-3 w-3 text-emerald-400 shrink-0" />
                <span className="text-foreground capitalize">{(w.feature as string).replace(/_/g, " ")}</span>
                <span className="text-muted-foreground truncate flex-1">{w.keyword as string}</span>
                <span className="text-emerald-300">#{w.yourPosition as number}</span>
              </div>
            ))}
          </div>
        </ToolCard>
      )}
    </div>
  );
}
