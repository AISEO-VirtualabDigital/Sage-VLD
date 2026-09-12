"use client";

import * as React from "react";
import { BarChart3, TrendingDown, AlertTriangle, ArrowUpRight } from "lucide-react";
import { useGsc, useDecay } from "../hooks/use-dashboard-data";
import { Card } from "@/components/ui/card";

export function AnalyticsView({ siteId }: { siteId: string }) {
  const { data: gsc, isLoading: gscLoading } = useGsc(siteId, 28);
  const { data: decay, isLoading: decayLoading } = useDecay(siteId, 90);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-emerald-400" />
          Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Google Search Console data + content decay detection (simulated in demo).
        </p>
      </div>

      {/* GSC summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 bg-white/[0.02] border-white/[0.06]">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Clicks (28d)</div>
          <div className="text-2xl font-display font-bold text-foreground mt-1">
            {gsc?.totals.clicks.toLocaleString() ?? "—"}
          </div>
        </Card>
        <Card className="p-4 bg-white/[0.02] border-white/[0.06]">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Impressions</div>
          <div className="text-2xl font-display font-bold text-foreground mt-1">
            {gsc?.totals.impressions.toLocaleString() ?? "—"}
          </div>
        </Card>
        <Card className="p-4 bg-white/[0.02] border-white/[0.06]">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Avg CTR</div>
          <div className="text-2xl font-display font-bold text-foreground mt-1">
            {gsc?.totals.avgCtr ? `${gsc.totals.avgCtr}%` : "—"}
          </div>
        </Card>
      </div>

      {/* GSC table */}
      <Card className="bg-white/[0.02] border-white/[0.06] overflow-hidden">
        <div className="px-4 py-2.5 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-foreground">Top pages by performance</h3>
        </div>
        {gscLoading ? (
          <div className="p-6 text-center text-sm text-muted-foreground">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-[10px] uppercase tracking-wider text-muted-foreground border-b border-white/[0.04]">
                <tr>
                  <th className="text-left font-medium px-4 py-2">URL</th>
                  <th className="text-right font-medium px-4 py-2">Clicks</th>
                  <th className="text-right font-medium px-4 py-2">Impr.</th>
                  <th className="text-right font-medium px-4 py-2">CTR</th>
                  <th className="text-right font-medium px-4 py-2">Pos</th>
                </tr>
              </thead>
              <tbody>
                {gsc?.rows.map((r, i) => (
                  <tr key={i} className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.01]">
                    <td className="px-4 py-2">
                      <div className="text-foreground truncate max-w-[240px]">{r.title}</div>
                      <div className="text-[10px] text-muted-foreground font-mono truncate max-w-[240px]">{r.url}</div>
                    </td>
                    <td className="px-4 py-2 text-right font-mono text-foreground">{r.clicks.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right font-mono text-muted-foreground">{r.impressions.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right font-mono text-muted-foreground">{r.ctr}%</td>
                    <td className="px-4 py-2 text-right font-mono text-emerald-300">{r.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Content decay */}
      <Card className="bg-white/[0.02] border-white/[0.06] overflow-hidden">
        <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-foreground">Content decay detection (90 days)</h3>
        </div>
        {decayLoading ? (
          <div className="p-6 text-center text-sm text-muted-foreground">Loading...</div>
        ) : !decay || decay.decayedPageCount === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            ✓ No content decay detected · {decay?.totalPublishedPages ?? 0} pages healthy
          </div>
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {decay.recommendations.map((rec, i) => (
              <div key={i} className="px-4 py-3">
                <div className="flex items-start gap-3">
                  <span
                    className={`inline-flex items-center justify-center h-6 px-2 rounded text-[10px] font-bold uppercase shrink-0 ${
                      rec.priority === "critical"
                        ? "bg-red-500/15 text-red-400"
                        : rec.priority === "high"
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-yellow-500/15 text-yellow-400"
                    }`}
                  >
                    {rec.priority}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{rec.title}</div>
                    <div className="text-[10px] text-muted-foreground font-mono truncate">{rec.url}</div>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px]">
                      <span className="text-red-400 inline-flex items-center">
                        <TrendingDown className="h-3 w-3 mr-0.5" />
                        {rec.trafficDropPct}% traffic drop
                      </span>
                      <span className="text-muted-foreground">{rec.ageDays}d old</span>
                      <span className="text-muted-foreground">SEO {rec.currentSeoScore}/100 · Gap {rec.currentGapScore}/100</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1.5">{rec.recommendation}</div>
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
