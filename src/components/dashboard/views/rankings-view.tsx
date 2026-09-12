"use client";

import * as React from "react";
import { Plus, RefreshCw, TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  useKeywords,
  useRankings,
  useAddKeywords,
  useRefreshRankings,
} from "../hooks/use-dashboard-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RankingsView({ siteId }: { siteId: string }) {
  const { data: keywords, isLoading } = useKeywords(siteId);
  const [selectedKw, setSelectedKw] = React.useState<string | null>(null);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const refreshAll = useRefreshRankings();

  // Auto-select first keyword
  React.useEffect(() => {
    if (!selectedKw && keywords && keywords.length > 0) {
      setSelectedKw(keywords[0].id);
    }
  }, [keywords, selectedKw]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Rankings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Google + Bing dual-core tracking · {keywords?.length ?? 0} keywords
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refreshAll.mutate({ siteId })}
            disabled={refreshAll.isPending}
            className="border-white/[0.08] bg-white/[0.02]"
          >
            {refreshAll.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            Refresh all
          </Button>
          <Button
            size="sm"
            onClick={() => setShowAddForm((v) => !v)}
            className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
          >
            <Plus className="h-3.5 w-3.5" />
            Add keywords
          </Button>
        </div>
      </div>

      {showAddForm && <AddKeywordsForm siteId={siteId} onDone={() => setShowAddForm(false)} />}

      {refreshAll.data && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] p-3 text-xs text-emerald-200">
          ✓ Refreshed {refreshAll.data.rankingsCreated} rankings across {refreshAll.data.keywordsChecked} keywords
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Keyword list */}
        <div className="lg:col-span-1 rounded-lg border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="px-3 py-2.5 border-b border-white/[0.06] text-xs font-semibold text-foreground">
            Keywords
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {isLoading && (
              <div className="p-4 text-center text-xs text-muted-foreground">Loading...</div>
            )}
            {!isLoading && keywords?.length === 0 && (
              <div className="p-4 text-center text-xs text-muted-foreground">No keywords yet</div>
            )}
            {keywords?.map((kw) => (
              <button
                key={kw.id}
                onClick={() => setSelectedKw(kw.id)}
                className={`w-full text-left px-3 py-2 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors ${
                  selectedKw === kw.id ? "bg-emerald-500/10" : ""
                }`}
              >
                <div className="text-sm font-medium text-foreground truncate">{kw.term}</div>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
                  <span className="px-1.5 py-0.5 rounded bg-white/[0.04] capitalize">{kw.intent}</span>
                  {kw.cluster && <span>· {kw.cluster}</span>}
                  {kw.volume && <span>· {kw.volume.toLocaleString()}/mo</span>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Trend chart + table */}
        <div className="lg:col-span-2 space-y-4">
          <RankingChart keywordId={selectedKw} />
        </div>
      </div>
    </div>
  );
}

function RankingChart({ keywordId }: { keywordId: string | null }) {
  const { data, isLoading } = useRankings(keywordId, 30);

  if (!keywordId) {
    return (
      <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-8 text-center text-sm text-muted-foreground">
        Select a keyword to view its ranking trend
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-8 text-center text-sm text-muted-foreground">
        Loading rankings...
      </div>
    );
  }

  const engines = data?.engines || [];
  const history = data?.history || [];

  // Group history by date for chart
  const byDate: Record<string, { date: string; google?: number; bing?: number }> = {};
  for (const r of history) {
    const date = new Date(r.checkedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (!byDate[date]) byDate[date] = { date };
    if (r.engine === "google") byDate[date].google = r.position;
    if (r.engine === "bing") byDate[date].bing = r.position;
  }
  const chartData = Object.values(byDate);

  return (
    <>
      {/* Engine summary cards */}
      <div className="grid grid-cols-2 gap-3">
        {engines.map((e) => (
          <div key={e.engine} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`h-2 w-2 rounded-full ${e.engine === "google" ? "bg-emerald-400" : "bg-cyan-400"}`}
              />
              <span className="text-xs font-semibold text-foreground capitalize">{e.engine}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-display font-bold text-foreground">{e.currentPosition ?? "—"}</span>
              <span
                className={`text-xs font-semibold inline-flex items-center ${
                  e.delta > 0 ? "text-emerald-400" : e.delta < 0 ? "text-red-400" : "text-muted-foreground"
                }`}
              >
                {e.delta > 0 ? <TrendingUp className="h-3 w-3 mr-0.5" /> : e.delta < 0 ? <TrendingDown className="h-3 w-3 mr-0.5" /> : <Minus className="h-3 w-3 mr-0.5" />}
                {e.delta > 0 ? "+" : ""}{e.delta} pos
              </span>
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              best: {e.bestPosition ?? "—"} · {e.dataPoints} data points
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="text-xs font-semibold text-foreground mb-3">Position trend (last 30 days)</div>
        <div className="h-[240px] -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="colorGoogle" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34D399" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#34D399" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBing" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} reversed domain={[1, "auto"]} />
              <Tooltip
                contentStyle={{ background: "rgba(11,17,32,0.95)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: "8px", fontSize: "11px" }}
              />
              <Area type="monotone" dataKey="google" stroke="#34D399" strokeWidth={2} fill="url(#colorGoogle)" dot={false} />
              <Area type="monotone" dataKey="bing" stroke="#22D3EE" strokeWidth={2} fill="url(#colorBing)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

function AddKeywordsForm({ siteId, onDone }: { siteId: string; onDone: () => void }) {
  const [text, setText] = React.useState("");
  const [intent, setIntent] = React.useState("informational");
  const addKeywords = useAddKeywords();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const terms = text
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean)
      .map((term) => ({ term, intent }));
    if (terms.length === 0) return;
    await addKeywords.mutateAsync({ siteId, keywords: terms });
    setText("");
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] p-4 space-y-3">
      <div>
        <Label className="text-xs text-foreground">Keywords (one per line)</Label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder={"ai seo platform\ngeo tracking tool\nllms.txt generator"}
          className="mt-1 w-full rounded-md border border-white/[0.08] bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
        />
      </div>
      <div className="flex items-end gap-3">
        <div>
          <Label className="text-xs text-foreground">Intent (applies to all)</Label>
          <select
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            className="mt-1 block rounded-md border border-white/[0.08] bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
          >
            <option value="informational">informational</option>
            <option value="commercial">commercial</option>
            <option value="transactional">transactional</option>
            <option value="navigational">navigational</option>
          </select>
        </div>
        <div className="flex-1" />
        <Button type="button" variant="ghost" size="sm" onClick={onDone}>
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={addKeywords.isPending || !text.trim()}
          className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
        >
          {addKeywords.isPending ? "Adding..." : "Add keywords"}
        </Button>
      </div>
    </form>
  );
}
