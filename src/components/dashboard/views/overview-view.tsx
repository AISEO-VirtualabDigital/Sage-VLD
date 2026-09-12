"use client";

import * as React from "react";
import Link from "next/link";
import { TrendingUp, Bot, FileText, ShieldCheck, ArrowUpRight, Activity, Zap } from "lucide-react";
import { useLatestAudit, useCitations, useKeywords, useChanges, useContentDrafts } from "../hooks/use-dashboard-data";
import { Card } from "@/components/ui/card";

export function OverviewView({ siteId, onView }: { siteId: string; onView: (v: string) => void }) {
  const { data: audit } = useLatestAudit(siteId);
  const { data: citations } = useCitations(siteId, 30);
  const { data: keywords } = useKeywords(siteId);
  const { data: changes } = useChanges(siteId);
  const { data: drafts } = useContentDrafts(siteId);

  const auditScore = audit?.audit?.score ?? null;
  const aiSov = citations?.overallSovPercent ?? 0;
  const keywordCount = keywords?.length ?? 0;
  const changeCount = changes?.length ?? 0;
  const draftCount = drafts?.length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Site health, AI visibility, and recent activity at a glance.
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          label="Audit Score"
          value={auditScore !== null ? `${auditScore}/100` : "—"}
          icon={ShieldCheck}
          accent="emerald"
          onClick={() => onView("audits")}
        />
        <MetricCard
          label="AI Visibility (SOV)"
          value={`${aiSov}%`}
          icon={Bot}
          accent="cyan"
          sub={`${citations?.totalCited ?? 0}/${citations?.totalChecks ?? 0} citations`}
          onClick={() => onView("citations")}
        />
        <MetricCard
          label="Tracked Keywords"
          value={String(keywordCount)}
          icon={TrendingUp}
          accent="violet"
          sub="Google + Bing"
          onClick={() => onView("rankings")}
        />
        <MetricCard
          label="Content Drafts"
          value={String(draftCount)}
          icon={FileText}
          accent="amber"
          sub={`${changeCount} changes logged`}
          onClick={() => onView("content")}
        />
      </div>

      {/* Two-column: audit summary + recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5 bg-white/[0.02] border-white/[0.06]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Site Health</h3>
            <button
              onClick={() => onView("audits")}
              className="text-[11px] text-emerald-300 hover:text-emerald-200 inline-flex items-center gap-0.5"
            >
              View all <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
          {audit?.audit ? (
            <div className="flex items-center gap-4">
              <ScoreGauge score={audit.audit.score} size={80} />
              <div className="flex-1 space-y-1.5">
                <div className="text-xs text-muted-foreground">
                  {audit.audit.pagesCrawled} pages crawled
                </div>
                <div className="flex gap-3 text-xs">
                  <span className="text-red-400">{audit.summary.fail} fail</span>
                  <span className="text-amber-400">{audit.summary.warn} warn</span>
                  <span className="text-emerald-400">{audit.summary.pass} pass</span>
                </div>
                {audit.summary.autoFixAvailable > 0 && (
                  <div className="text-[11px] text-emerald-300 inline-flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    {audit.summary.autoFixAvailable} auto-fixes available
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground py-6 text-center">No audit run yet</div>
          )}
        </Card>

        <Card className="p-5 bg-white/[0.02] border-white/[0.06]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
            <button
              onClick={() => onView("changes")}
              className="text-[11px] text-emerald-300 hover:text-emerald-200 inline-flex items-center gap-0.5"
            >
              View all <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-2.5">
            {(changes || []).slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center gap-3 text-xs">
                <div
                  className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                    c.rolledBack ? "bg-muted-foreground" : "bg-emerald-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-foreground font-medium">{c.field}</span>
                  <span className="text-muted-foreground"> on </span>
                  <span className="text-foreground/80 font-mono truncate">{c.url}</span>
                </div>
                {c.impactRankingDelta !== null && (
                  <span
                    className={`font-mono ${
                      c.impactRankingDelta < 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {c.impactRankingDelta > 0 ? "+" : ""}
                    {c.impactRankingDelta} pos
                  </span>
                )}
                {c.rolledBack && (
                  <span className="text-[10px] text-muted-foreground bg-white/[0.04] px-1.5 py-0.5 rounded">
                    rolled back
                  </span>
                )}
              </div>
            ))}
            {(!changes || changes.length === 0) && (
              <div className="text-sm text-muted-foreground py-6 text-center">No changes logged yet</div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <Card className="p-5 bg-white/[0.02] border-white/[0.06]">
        <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <QuickAction label="Run Audit" icon={ShieldCheck} onClick={() => onView("audits")} />
          <QuickAction label="Add Keywords" icon={TrendingUp} onClick={() => onView("rankings")} />
          <QuickAction label="Generate Content" icon={FileText} onClick={() => onView("content")} />
          <QuickAction label="View AI Citations" icon={Bot} onClick={() => onView("citations")} />
        </div>
      </Card>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  accent,
  sub,
  onClick,
}: {
  label: string;
  value: string;
  icon: typeof TrendingUp;
  accent: "emerald" | "cyan" | "violet" | "amber";
  sub?: string;
  onClick?: () => void;
}) {
  const accentColors = {
    emerald: "text-emerald-400 bg-emerald-500/10",
    cyan: "text-cyan-400 bg-cyan-500/10",
    violet: "text-violet-400 bg-violet-500/10",
    amber: "text-amber-400 bg-amber-500/10",
  };
  return (
    <button
      onClick={onClick}
      className="text-left rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.04] hover:border-white/[0.12] transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
          {label}
        </span>
        <span className={`inline-flex items-center justify-center h-7 w-7 rounded-md ${accentColors[accent]}`}>
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="text-xl font-display font-bold text-foreground">{value}</div>
      {sub && <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>}
    </button>
  );
}

function ScoreGauge({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * score) / 100;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="4"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#34D399"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-display font-bold text-foreground">{score}</span>
      </div>
    </div>
  );
}

function QuickAction({ label, icon: Icon, onClick }: { label: string; icon: typeof TrendingUp; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2.5 rounded-md border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-emerald-500/30 transition-colors text-sm text-left"
    >
      <Icon className="h-4 w-4 text-emerald-400 shrink-0" />
      <span className="text-foreground/90">{label}</span>
    </button>
  );
}
