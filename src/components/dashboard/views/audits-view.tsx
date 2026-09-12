"use client";

import * as React from "react";
import { Loader2, Play, Check, AlertTriangle, X, Zap, RefreshCw } from "lucide-react";
import { useLatestAudit, useRunAudit } from "../hooks/use-dashboard-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AuditsView({ siteId }: { siteId: string }) {
  const { data: audit, isLoading } = useLatestAudit(siteId);
  const runAudit = useRunAudit();

  const findings = audit?.findings || { fail: [], warn: [], pass: [] };
  const summary = audit?.summary;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Audits</h1>
          <p className="text-sm text-muted-foreground mt-1">
            358-point cloud crawler · Core Web Vitals, broken links, schema, SSR checks
          </p>
        </div>
        <Button
          onClick={() => runAudit.mutate({ siteId })}
          disabled={runAudit.isPending}
          className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
        >
          {runAudit.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
          Run new audit
        </Button>
      </div>

      {runAudit.data && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] p-3 text-xs text-emerald-200">
          ✓ Audit complete · Score {runAudit.data.score}/100 · {runAudit.data.pagesCrawled} pages crawled ·{" "}
          {runAudit.data.findingsSummary.fail} fail, {runAudit.data.findingsSummary.warn} warn,{" "}
          {runAudit.data.findingsSummary.pass} pass
        </div>
      )}

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading audit...</div>
      ) : !audit?.audit ? (
        <Card className="p-8 text-center bg-white/[0.02] border-white/[0.06]">
          <p className="text-sm text-muted-foreground">No audit run yet. Click "Run new audit" to start.</p>
        </Card>
      ) : (
        <>
          {/* Score + summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="p-5 bg-white/[0.02] border-white/[0.06] flex flex-col items-center justify-center">
              <ScoreGauge score={audit.audit.score} size={120} />
              <div className="mt-3 text-xs font-semibold text-emerald-300">
                {audit.audit.score >= 80 ? "Good" : audit.audit.score >= 60 ? "Needs work" : "Poor"}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {audit.audit.pagesCrawled} pages ·{" "}
                {audit.audit.completedAt
                  ? new Date(audit.audit.completedAt).toLocaleDateString()
                  : "running..."}
              </div>
            </Card>

            <Card className="p-5 bg-white/[0.02] border-white/[0.06] lg:col-span-2">
              <h3 className="text-sm font-semibold text-foreground mb-3">Summary</h3>
              <div className="grid grid-cols-4 gap-3">
                <SummaryStat label="Fail" value={summary?.fail ?? 0} color="text-red-400" />
                <SummaryStat label="Warn" value={summary?.warn ?? 0} color="text-amber-400" />
                <SummaryStat label="Pass" value={summary?.pass ?? 0} color="text-emerald-400" />
                <SummaryStat label="Auto-fix" value={summary?.autoFixAvailable ?? 0} color="text-emerald-300" />
              </div>
              {summary && summary.autoFixAvailable > 0 && (
                <div className="mt-4 rounded-md border border-emerald-500/20 bg-emerald-500/[0.04] p-3 text-xs text-emerald-200 inline-flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5" />
                  {summary.autoFixAvailable} issues have auto-fix available — agents can ship PRs via MCP
                </div>
              )}
            </Card>
          </div>

          {/* Findings by severity */}
          <div className="space-y-4">
            <FindingsGroup
              title="Failures"
              findings={findings.fail || []}
              emptyText="No failures — all checks passed"
              color="red"
            />
            <FindingsGroup
              title="Warnings"
              findings={findings.warn || []}
              emptyText="No warnings"
              color="amber"
            />
            <FindingsGroup
              title="Passing"
              findings={findings.pass || []}
              emptyText="No passing checks"
              color="emerald"
            />
          </div>
        </>
      )}
    </div>
  );
}

function FindingsGroup({
  title,
  findings,
  emptyText,
  color,
}: {
  title: string;
  findings: Array<{ id: string; category: string; severity: string; label: string; pageCount: number; autoFixAvailable: boolean }>;
  emptyText: string;
  color: "red" | "amber" | "emerald";
}) {
  const colors = {
    red: { text: "text-red-400", bg: "bg-red-500/15", icon: X },
    amber: { text: "text-amber-400", bg: "bg-amber-500/15", icon: AlertTriangle },
    emerald: { text: "text-emerald-400", bg: "bg-emerald-500/15", icon: Check },
  };
  const c = colors[color];
  const Icon = c.icon;

  return (
    <Card className="bg-white/[0.02] border-white/[0.06] overflow-hidden">
      <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Icon className={`h-3.5 w-3.5 ${c.text}`} />
          {title}
          <span className="text-xs text-muted-foreground font-normal">({findings.length})</span>
        </h3>
      </div>
      <div className="divide-y divide-white/[0.03]">
        {findings.length === 0 ? (
          <div className="px-4 py-6 text-center text-xs text-muted-foreground">{emptyText}</div>
        ) : (
          findings.map((f) => (
            <div key={f.id} className="px-4 py-2.5 flex items-center gap-3 hover:bg-white/[0.01]">
              <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${c.bg} shrink-0`}>
                <Icon className={`h-3 w-3 ${c.text}`} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-foreground">{f.label}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{f.category}</div>
              </div>
              <div className="text-xs text-muted-foreground font-mono shrink-0">{f.pageCount} pages</div>
              {f.autoFixAvailable && (
                <span className="text-[10px] text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded inline-flex items-center gap-0.5 shrink-0">
                  <Zap className="h-2.5 w-2.5" /> auto-fix
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

function SummaryStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className={`text-2xl font-display font-bold ${color}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function ScoreGauge({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * score) / 100;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
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
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-display font-bold text-foreground">{score}</span>
        <span className="text-[9px] text-muted-foreground uppercase tracking-wider">/100</span>
      </div>
    </div>
  );
}
