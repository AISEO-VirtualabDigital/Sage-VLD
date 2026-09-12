"use client";

import * as React from "react";
import { GitBranch, RotateCcw, TrendingUp, TrendingDown, Loader2, History } from "lucide-react";
import { useChanges, useRollback } from "../hooks/use-dashboard-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FIELD_COLORS: Record<string, string> = {
  title: "text-emerald-300 bg-emerald-500/10",
  "meta-description": "text-cyan-300 bg-cyan-500/10",
  schema: "text-violet-300 bg-violet-500/10",
  redirect: "text-amber-300 bg-amber-500/10",
  content: "text-rose-300 bg-rose-500/10",
  h1: "text-emerald-300 bg-emerald-500/10",
  "internal-link": "text-cyan-300 bg-cyan-500/10",
};

export function ChangesView({ siteId }: { siteId: string }) {
  const { data: changes, isLoading } = useChanges(siteId);
  const rollback = useRollback();
  const [confirmId, setConfirmId] = React.useState<string | null>(null);

  const handleRollback = async (changeId: string) => {
    await rollback.mutateAsync({ changeId, reason: "Manual rollback from dashboard" });
    setConfirmId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Version Control</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Every metadata, schema, redirect, and content change — with impact tracking and one-click rollback.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 bg-white/[0.02] border-white/[0.06]">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Total changes</div>
          <div className="text-2xl font-display font-bold text-foreground mt-1">{changes?.length ?? 0}</div>
        </Card>
        <Card className="p-4 bg-white/[0.02] border-white/[0.06]">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Rolled back</div>
          <div className="text-2xl font-display font-bold text-foreground mt-1">
            {changes?.filter((c) => c.rolledBack).length ?? 0}
          </div>
        </Card>
        <Card className="p-4 bg-white/[0.02] border-white/[0.06]">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Avg position delta</div>
          <div className="text-2xl font-display font-bold text-emerald-400 mt-1">
            {changes && changes.length > 0
              ? Math.round(
                  changes
                    .filter((c) => c.impactRankingDelta !== null)
                    .reduce((acc, c) => acc + (c.impactRankingDelta as number), 0) /
                    Math.max(1, changes.filter((c) => c.impactRankingDelta !== null).length)
                )
              : 0}
          </div>
        </Card>
      </div>

      {rollback.data && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] p-3 text-xs text-emerald-200">
          ✓ Rolled back {rollback.data.field} on {rollback.data.url} — restored to previous state
        </div>
      )}

      {/* Timeline */}
      <Card className="bg-white/[0.02] border-white/[0.06] overflow-hidden">
        <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center gap-2">
          <History className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-foreground">Change history</h3>
        </div>

        {isLoading ? (
          <div className="p-6 text-center text-sm text-muted-foreground">Loading...</div>
        ) : !changes || changes.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">No changes logged yet</div>
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {changes.map((c) => (
              <div key={c.id} className="px-4 py-3 hover:bg-white/[0.01]">
                <div className="flex items-start gap-3">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center pt-1">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        c.rolledBack ? "bg-muted-foreground" : "bg-emerald-400"
                      } ring-4 ring-background`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Header row */}
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium ${FIELD_COLORS[c.field] || "text-muted-foreground bg-white/[0.04]"}`}>
                        {c.field}
                      </span>
                      <span className="text-xs text-foreground font-mono truncate">{c.url}</span>
                      {c.rolledBack && (
                        <span className="text-[10px] text-muted-foreground bg-white/[0.04] px-1.5 py-0.5 rounded inline-flex items-center gap-0.5">
                          <RotateCcw className="h-2.5 w-2.5" /> rolled back
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground ml-auto shrink-0">
                        {new Date(c.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {/* Diff */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {c.before !== null && (
                        <div className="rounded border border-red-500/20 bg-red-500/[0.04] px-2 py-1.5">
                          <div className="text-[9px] uppercase tracking-wider text-red-400 mb-0.5">Before</div>
                          <div className="text-[11px] font-mono text-foreground/70 truncate">
                            {c.before || "(empty)"}
                          </div>
                        </div>
                      )}
                      <div className={`rounded border ${c.rolledBack ? "border-muted-foreground/20 bg-white/[0.02]" : "border-emerald-500/20 bg-emerald-500/[0.04]"} px-2 py-1.5`}>
                        <div className={`text-[9px] uppercase tracking-wider mb-0.5 ${c.rolledBack ? "text-muted-foreground" : "text-emerald-400"}`}>
                          After
                        </div>
                        <div className="text-[11px] font-mono text-foreground/80 truncate">
                          {c.after || "(empty)"}
                        </div>
                      </div>
                    </div>

                    {/* Impact + actions */}
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      {c.impactRankingDelta !== null && (
                        <span className={`text-[11px] inline-flex items-center gap-0.5 ${c.impactRankingDelta < 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {c.impactRankingDelta < 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {c.impactRankingDelta > 0 ? "+" : ""}{c.impactRankingDelta} pos
                        </span>
                      )}
                      {c.impactTrafficDelta !== null && (
                        <span className={`text-[11px] ${c.impactTrafficDelta > 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {c.impactTrafficDelta > 0 ? "+" : ""}{c.impactTrafficDelta} clicks/mo
                        </span>
                      )}
                      <div className="flex-1" />
                      {!c.rolledBack && (
                        confirmId === c.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-foreground">Confirm rollback?</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 text-[11px] px-2"
                              onClick={() => setConfirmId(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              className="h-6 text-[11px] px-2 bg-red-500 text-white hover:bg-red-400"
                              onClick={() => handleRollback(c.id)}
                              disabled={rollback.isPending}
                            >
                              {rollback.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3" />}
                              Roll back
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 text-[11px] px-2 text-muted-foreground hover:text-red-400"
                            onClick={() => setConfirmId(c.id)}
                          >
                            <RotateCcw className="h-3 w-3" />
                            Roll back
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
