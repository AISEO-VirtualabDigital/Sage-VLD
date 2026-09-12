"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  Search,
  Bot,
  FileText,
  Home,
  Briefcase,
  ArrowUpRight,
  CircleDot,
  Check,
  AlertTriangle,
  X,
  Plus,
  Zap,
  KeyRound,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type Tab = "rankings" | "content" | "audit";

const rankingData = [
  { day: "Mon", google: 24, bing: 31, traffic: 1820 },
  { day: "Tue", google: 22, bing: 28, traffic: 2100 },
  { day: "Wed", google: 19, bing: 25, traffic: 2480 },
  { day: "Thu", google: 18, bing: 23, traffic: 2620 },
  { day: "Fri", google: 15, bing: 21, traffic: 3100 },
  { day: "Sat", google: 13, bing: 18, traffic: 3420 },
  { day: "Sun", google: 11, bing: 15, traffic: 3980 },
];

const aiVisibilityData = [
  { engine: "ChatGPT", visibility: 68, delta: +12 },
  { engine: "Perplexity", visibility: 54, delta: +9 },
  { engine: "Google AIO", visibility: 41, delta: +6 },
  { engine: "SearchGPT", visibility: 28, delta: +5 },
  { engine: "Claude", visibility: 22, delta: +3 },
];

const topKeywords = [
  { kw: "ai seo platform", google: 3, bing: 5, prev: 11, vol: "8.1K" },
  { kw: "geo tracking tool", google: 1, bing: 2, prev: 4, vol: "2.4K" },
  { kw: "llms.txt generator", google: 2, bing: 4, prev: 7, vol: "1.9K" },
  { kw: "ai content seo", google: 5, bing: 8, prev: 9, vol: "12K" },
  { kw: "schema markup ai", google: 4, bing: 6, prev: 14, vol: "3.6K" },
];

const auditChecks = [
  { label: "Title tags optimized", status: "pass", count: 142 },
  { label: "Missing meta descriptions", status: "fail", count: 7 },
  { label: "Schema markup valid", status: "pass", count: 96 },
  { label: "Core Web Vitals (good)", status: "pass", count: 88 },
  { label: "Broken internal links", status: "warn", count: 3 },
  { label: "Image alt text missing", status: "fail", count: 12 },
];

const generators = [
  {
    id: "home",
    icon: Home,
    title: "Home Page Generator",
    sample: "Stop selling dashboards. Start shipping rankings.",
    meta: "Hero · Value props · FAQ schema · Org schema",
    eeat: 94,
    seo: 91,
    gap: 88,
  },
  {
    id: "services",
    icon: Briefcase,
    title: "Services Generator",
    sample: "AI SEO services built for agencies scaling 10–100 client sites.",
    meta: "Service schema · LocalBusiness · Pricing tiers",
    eeat: 89,
    seo: 87,
    gap: 84,
  },
  {
    id: "blog",
    icon: FileText,
    title: "Blog Post Generator",
    sample: "# The 2026 Guide to AI-Visibility (GEO) — From llms.txt to NLWeb",
    meta: "Article schema · 2,400 words · 4 internal links",
    eeat: 96,
    seo: 93,
    gap: 91,
  },
];

const blogDraft = `# The 2026 Guide to AI-Visibility (GEO)

SEO is no longer about keyword stuffing. It's about AI-grounded, intent-matched, schema-rich content that both Google and AI engines like ChatGPT can cite.

## Why AI Visibility Matters
Your customers ask ChatGPT and Perplexity for recommendations, not just Google. If your brand isn't cited, you lose the click.`;

export function DashboardPreview() {
  const [tab, setTab] = React.useState<Tab>("rankings");
  const [typed, setTyped] = React.useState("");
  const [score, setScore] = React.useState(0);
  const [activeGen, setActiveGen] = React.useState<"home" | "services" | "blog">("blog");

  // Typewriter for content editor preview
  React.useEffect(() => {
    if (tab !== "content") return;
    setTyped("");
    let i = 0;
    const interval = setInterval(() => {
      i += 2;
      setTyped(blogDraft.slice(0, i));
      if (i >= blogDraft.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [tab, activeGen]);

  // Animate audit score on tab enter
  React.useEffect(() => {
    if (tab !== "audit") return;
    setScore(0);
    let v = 0;
    const interval = setInterval(() => {
      v += 2;
      setScore(v);
      if (v >= 94) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [tab]);

  return (
    <div className="relative rounded-2xl border border-white/[0.08] glass-strong shadow-2xl shadow-black/40 overflow-hidden">
      {/* Window chrome */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/70" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/70" />
          </div>
          <div className="ml-3 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] text-[11px] text-muted-foreground font-mono">
            <Search className="h-3 w-3" />
            app.sage.com/dashboard
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <KeyRound className="h-3 w-3 text-emerald-400" />
            BYOK active
          </span>
          <span className="text-white/10">·</span>
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        </div>
      </div>

      {/* App body */}
      <div className="grid grid-cols-12 min-h-[480px]">
        {/* Sidebar */}
        <aside className="hidden md:flex md:col-span-2 flex-col gap-1 border-r border-white/[0.06] bg-white/[0.01] p-3">
          {[
            { icon: TrendingUp, label: "Rankings", tab: "rankings" as Tab },
            { icon: Sparkles, label: "Generators", tab: "content" as Tab },
            { icon: FileText, label: "Site Audit", tab: "audit" as Tab },
            { icon: Bot, label: "AI Visibility", tab: "rankings" as Tab },
            { icon: Search, label: "Keywords", tab: "rankings" as Tab },
            { icon: Home, label: "Brand Brain", tab: "content" as Tab },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => setTab(item.tab)}
              className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors text-left ${
                item.tab === tab
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
              }`}
            >
              <item.icon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          ))}
          <div className="mt-auto pt-3 border-t border-white/[0.06]">
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2.5">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-300 mb-1">
                <Zap className="h-3 w-3" /> Usage this month
              </div>
              <div className="text-[10px] text-muted-foreground">$18.40 / $30 credits</div>
              <div className="mt-1.5 h-1 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-emerald-400 w-[61%]" />
              </div>
              <div className="mt-1 text-[9px] text-muted-foreground/70">BYOK bypasses credits</div>
            </div>
          </div>
        </aside>

        {/* Main panel */}
        <div className="col-span-12 md:col-span-10 p-4 sm:p-5 space-y-4">
          {/* Tab header */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-lg p-1">
              {([
                ["rankings", "Rank Tracking"],
                ["content", "Generators"],
                ["audit", "Site Audit"],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`relative px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    tab === key ? "text-emerald-950" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === key && (
                    <motion.span
                      layoutId="tab-bg"
                      className="absolute inset-0 rounded-md bg-emerald-400"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative">{label}</span>
                </button>
              ))}
            </div>
            <button className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-md px-2.5 py-1.5 hover:bg-emerald-500/15 transition-colors">
              <Plus className="h-3 w-3" /> New project
            </button>
          </div>

          {/* Content per tab */}
          {tab === "rankings" && <RankingsPanel />}
          {tab === "content" && (
            <ContentPanel typed={typed} activeGen={activeGen} setActiveGen={setActiveGen} />
          )}
          {tab === "audit" && <AuditPanel score={score} />}
        </div>
      </div>
    </div>
  );
}

function RankingsPanel() {
  return (
    <>
      {/* Top metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {[
          { label: "Google avg. pos", value: "11.2", delta: "-9.4", up: true },
          { label: "Bing avg. pos", value: "15.4", delta: "-7.1", up: true },
          { label: "Organic traffic", value: "39.8K", delta: "+118%", up: true },
          { label: "AI visibility", value: "44%", delta: "+34%", up: true },
        ].map((m, i) => (
          <div
            key={i}
            className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"
          >
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
              {m.label}
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg font-display font-bold text-foreground">{m.value}</span>
              <span
                className={`text-[10px] font-semibold inline-flex items-center ${
                  m.up ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {m.up ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
                {m.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + AI visibility side panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-xs font-semibold text-foreground">Ranking trend · Google + Bing</div>
              <div className="text-[10px] text-muted-foreground">Last 7 days · all tracked keywords</div>
            </div>
            <div className="inline-flex items-center gap-3 text-[10px]">
              <span className="inline-flex items-center gap-1 text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Google
              </span>
              <span className="inline-flex items-center gap-1 text-cyan-300">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> Bing
              </span>
            </div>
          </div>
          <div className="h-[180px] -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rankingData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
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
                <XAxis
                  dataKey="day"
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  reversed
                  domain={[1, 35]}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(11,17,32,0.95)",
                    border: "1px solid rgba(52,211,153,0.3)",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                  labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                />
                <Area
                  type="monotone"
                  dataKey="google"
                  stroke="#34D399"
                  strokeWidth={2}
                  fill="url(#colorGoogle)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#34D399", stroke: "#0B1120", strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="bing"
                  stroke="#22D3EE"
                  strokeWidth={2}
                  fill="url(#colorBing)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#22D3EE", stroke: "#0B1120", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Visibility side panel */}
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Bot className="h-3.5 w-3.5 text-emerald-400" /> AI Citations
            </div>
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider">GEO</span>
          </div>
          <div className="space-y-2">
            {aiVisibilityData.map((item) => (
              <div key={item.engine}>
                <div className="flex items-center justify-between text-[10px] mb-0.5">
                  <span className="text-muted-foreground">{item.engine}</span>
                  <span className="inline-flex items-center gap-1 font-semibold">
                    <span className="text-foreground">{item.visibility}%</span>
                    <span className="text-emerald-400 inline-flex items-center">
                      <ArrowUpRight className="h-2.5 w-2.5" />
                      {item.delta}
                    </span>
                  </span>
                </div>
                <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.visibility}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top keywords table */}
      <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="px-3 py-2 border-b border-white/[0.06] flex items-center justify-between">
          <div className="text-xs font-semibold text-foreground">Top moving keywords</div>
          <span className="text-[10px] text-muted-foreground">5 of 1,284</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-white/[0.04]">
                <th className="text-left font-medium px-3 py-1.5">Keyword</th>
                <th className="text-right font-medium px-3 py-1.5">
                  <span className="text-emerald-300">Google</span>
                </th>
                <th className="text-right font-medium px-3 py-1.5">
                  <span className="text-cyan-300">Bing</span>
                </th>
                <th className="text-right font-medium px-3 py-1.5">Prev</th>
                <th className="text-right font-medium px-3 py-1.5 hidden sm:table-cell">Vol</th>
                <th className="text-right font-medium px-3 py-1.5">Δ</th>
              </tr>
            </thead>
            <tbody>
              {topKeywords.map((k, i) => (
                <tr
                  key={i}
                  className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02]"
                >
                  <td className="px-3 py-1.5 font-medium text-foreground">{k.kw}</td>
                  <td className="px-3 py-1.5 text-right font-mono font-semibold text-emerald-300">{k.google}</td>
                  <td className="px-3 py-1.5 text-right font-mono font-semibold text-cyan-300">{k.bing}</td>
                  <td className="px-3 py-1.5 text-right font-mono text-muted-foreground">{k.prev}</td>
                  <td className="px-3 py-1.5 text-right font-mono text-muted-foreground hidden sm:table-cell">{k.vol}</td>
                  <td className="px-3 py-1.5 text-right">
                    <span className="inline-flex items-center text-emerald-400 font-mono text-[10px]">
                      <ArrowUpRight className="h-2.5 w-2.5" />
                      {k.prev - k.google}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function ContentPanel({
  typed,
  activeGen,
  setActiveGen,
}: {
  typed: string;
  activeGen: "home" | "services" | "blog";
  setActiveGen: (g: "home" | "services" | "blog") => void;
}) {
  const active = generators.find((g) => g.id === activeGen)!;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      {/* Editor */}
      <div className="lg:col-span-2 rounded-lg border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        {/* Generator switcher */}
        <div className="px-3 py-2 border-b border-white/[0.06] flex items-center gap-1.5 overflow-x-auto">
          {generators.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGen(g.id as "home" | "services" | "blog")}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium whitespace-nowrap transition-colors ${
                activeGen === g.id
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  : "text-muted-foreground hover:bg-white/[0.04] border border-transparent"
              }`}
            >
              <g.icon className="h-3 w-3" />
              {g.title.replace(" Generator", "")}
            </button>
          ))}
        </div>

        {/* Draft content */}
        <div className="px-3 py-2 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <FileText className="h-3 w-3" />
            <span className="font-mono">
              {activeGen === "blog" ? "ai-visibility-2026.md" : activeGen === "home" ? "index.md" : "services/seo.md"}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded">
            <Sparkles className="h-2.5 w-2.5" /> De-AI · E-E-A-T · SEO scored
          </span>
        </div>

        {/* Editor body */}
        <div className="p-3 min-h-[220px] font-mono text-[11px] leading-relaxed text-foreground/90 whitespace-pre-wrap">
          {activeGen === "blog" ? (
            <>
              {typed}
              <span className="inline-block w-1.5 h-3 bg-emerald-400 ml-0.5 animate-pulse align-middle" />
            </>
          ) : (
            <div className="space-y-2 font-sans">
              <div className="text-sm font-display font-bold text-foreground">{active.sample}</div>
              <div className="text-[10px] text-muted-foreground">{active.meta}</div>
              <div className="mt-3 text-[10px] text-muted-foreground italic">
                Draft ready — run De-AI humanizer + scoring pipeline →
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scoring panel */}
      <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 space-y-3">
        <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" /> Scoring suite
        </div>

        {/* Three score gauges */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "E-E-A-T", val: active.eeat, color: "#34D399" },
            { label: "SEO", val: active.seo, color: "#22D3EE" },
            { label: "Gap", val: active.gap, color: "#A78BFA" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="relative h-12 w-12 mx-auto">
                <svg viewBox="0 0 36 36" className="h-12 w-12 -rotate-90">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                  <motion.circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke={s.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="94.2"
                    initial={{ strokeDashoffset: 94.2 }}
                    animate={{ strokeDashoffset: 94.2 - (94.2 * s.val) / 100 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-display font-bold text-foreground">{s.val}</span>
                </div>
              </div>
              <div className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Checks list */}
        <div className="space-y-1.5 text-[10px]">
          {[
            { label: "De-AI humanized", val: "Pass · 0 em-dashes", ok: true },
            { label: "Search intent match", val: "Informational", ok: true },
            { label: "Readability (Flesch)", val: "62 · Standard", ok: true },
            { label: "Brand Brain ground", val: "voice_v3.json", ok: true },
            { label: "Content gap vs top 10", val: "2 missing topics", ok: false },
            { label: "Schema (Article)", val: "Auto-attached", ok: true },
            { label: "llms.txt citation", val: "Ready", ok: true },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-muted-foreground">{item.label}</span>
              <span
                className={`inline-flex items-center gap-1 font-medium ${
                  item.ok ? "text-emerald-300" : "text-amber-300"
                }`}
              >
                {item.ok ? <Check className="h-2.5 w-2.5" /> : <AlertTriangle className="h-2.5 w-2.5" />}
                {item.val}
              </span>
            </div>
          ))}
        </div>

        <button className="w-full inline-flex items-center justify-center gap-1.5 bg-emerald-500 text-emerald-950 hover:bg-emerald-400 text-[11px] font-semibold py-1.5 rounded-md transition-colors">
          <Sparkles className="h-3 w-3" /> Generate optimized version
        </button>
      </div>
    </div>
  );
}

function AuditPanel({ score }: { score: number }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      {/* Score gauge */}
      <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 flex flex-col items-center justify-center">
        <div className="relative h-32 w-32">
          <svg viewBox="0 0 36 36" className="h-32 w-32 -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="#34D399"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="97.4"
              strokeDashoffset={97.4 - (97.4 * score) / 100}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-display font-bold text-foreground">{score}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">/ 100</span>
          </div>
        </div>
        <div className="mt-3 text-xs font-semibold text-emerald-300">Good · Top 12% of audited sites</div>
        <div className="text-[10px] text-muted-foreground">Last audit: 2 min ago</div>
      </div>

      {/* Checks list */}
      <div className="lg:col-span-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
        <div className="flex items-center justify-between mb-2.5">
          <div className="text-xs font-semibold text-foreground">Audit checks · 358-point engine</div>
          <span className="text-[10px] text-muted-foreground">JS/SSR · CWV · Schema · 24h refresh</span>
        </div>
        <div className="space-y-1.5">
          {auditChecks.map((c, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-2">
                {c.status === "pass" && (
                  <span className="h-5 w-5 rounded-full bg-emerald-500/15 inline-flex items-center justify-center">
                    <Check className="h-3 w-3 text-emerald-400" />
                  </span>
                )}
                {c.status === "fail" && (
                  <span className="h-5 w-5 rounded-full bg-red-500/15 inline-flex items-center justify-center">
                    <X className="h-3 w-3 text-red-400" />
                  </span>
                )}
                {c.status === "warn" && (
                  <span className="h-5 w-5 rounded-full bg-amber-500/15 inline-flex items-center justify-center">
                    <AlertTriangle className="h-3 w-3 text-amber-400" />
                  </span>
                )}
                <span className="text-[11px] font-medium text-foreground">{c.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground font-mono">{c.count} pages</span>
                {c.status !== "pass" && (
                  <button className="text-[10px] text-emerald-300 hover:text-emerald-200 font-medium">
                    Auto-fix PR →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
