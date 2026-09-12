"use client";

import * as React from "react";
import { Bot, ArrowUpRight, Swords, FileText, Copy, Check } from "lucide-react";
import { useCitations, useBattlecards, useLlmsTxt } from "../hooks/use-dashboard-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ENGINE_COLORS: Record<string, string> = {
  chatgpt: "from-emerald-500 to-teal-400",
  perplexity: "from-cyan-500 to-blue-400",
  "google-aio": "from-violet-500 to-purple-400",
  searchgpt: "from-amber-500 to-orange-400",
  claude: "from-rose-500 to-pink-400",
};

export function CitationsView({ siteId }: { siteId: string }) {
  const { data: citations, isLoading } = useCitations(siteId, 30);
  const { data: battlecards } = useBattlecards(siteId, 30);
  const { data: llmsTxt } = useLlmsTxt(siteId);
  const [copied, setCopied] = React.useState(false);

  const copyLlmsTxt = () => {
    if (llmsTxt?.content) {
      navigator.clipboard.writeText(llmsTxt.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">AI Citations (GEO)</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Brand mentions, citation frequency, and Share-of-Voice across 5 AI engines.
        </p>
      </div>

      {/* Overall SOV */}
      <Card className="p-5 bg-white/[0.02] border-white/[0.06]">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              Overall AI Share-of-Voice (30 days)
            </div>
            <div className="text-4xl font-display font-bold text-gradient-emerald">
              {citations?.overallSovPercent ?? 0}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {citations?.totalCited ?? 0} cited out of {citations?.totalChecks ?? 0} checks
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Bot className="h-4 w-4 text-emerald-400" />
            Tracked engines: ChatGPT, Perplexity, Google AI Overviews, SearchGPT, Claude
          </div>
        </div>
      </Card>

      {/* Per-engine breakdown */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Per-engine citation rate</h3>
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {citations?.engines.map((e) => (
              <Card key={e.engine} className="p-4 bg-white/[0.02] border-white/[0.06]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-foreground capitalize">{e.engine}</span>
                  <span className={`h-2 w-2 rounded-full bg-gradient-to-br ${ENGINE_COLORS[e.engine] || "bg-emerald-400"}`} />
                </div>
                <div className="text-2xl font-display font-bold text-foreground">{e.citationRate}%</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {e.cited}/{e.checked} cited
                </div>
                <div className="mt-2 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${ENGINE_COLORS[e.engine] || "bg-emerald-400"}`}
                    style={{ width: `${e.citationRate}%` }}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Battlecards */}
      {battlecards && battlecards.battlecards.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Swords className="h-4 w-4 text-emerald-400" />
            Competitive AI Battlecards
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {battlecards.battlecards.map((card) => (
              <Card key={card.competitor} className="p-4 bg-white/[0.02] border-white/[0.06]">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{card.competitor}</div>
                    <div className="text-[10px] text-muted-foreground">
                      AI SOV: {card.theirAiSov}% · Google: {card.theirGoogleSov}% · Bing: {card.theirBingSov}%
                    </div>
                  </div>
                </div>
                {card.notes && (
                  <div className="text-[11px] text-muted-foreground italic mb-3">{card.notes}</div>
                )}
                <div className="space-y-1.5">
                  {Object.entries(card.perEngine).map(([engine, data]) => (
                    <div key={engine} className="flex items-center gap-2 text-[11px]">
                      <span className="text-muted-foreground w-20 capitalize">{engine}</span>
                      <div className="flex-1 flex gap-1 h-1.5">
                        <div className="bg-emerald-500 rounded-l-full" style={{ width: `${data.ourRate}%` }} />
                        <div className="flex-1 bg-white/[0.06] rounded-r-full" />
                      </div>
                      <span className="text-emerald-300 font-mono w-12 text-right">{data.ourRate}%</span>
                      <span className="text-red-400 font-mono w-12 text-right">{data.theirWinRate}%</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-white/[0.04] text-[10px] text-muted-foreground">
                  Our rate (green) vs their win rate (red)
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* llms.txt generator */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4 text-emerald-400" />
          llms.txt file
        </h3>
        <Card className="bg-white/[0.02] border-white/[0.06] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center justify-between">
            <div className="text-xs text-muted-foreground font-mono">/llms.txt · {llmsTxt?.stats?.bytes ?? 0} bytes</div>
            <Button size="sm" variant="ghost" onClick={copyLlmsTxt} className="h-7 text-xs">
              {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <pre className="p-4 text-[11px] font-mono text-foreground/80 overflow-x-auto max-h-72 whitespace-pre-wrap">
            {llmsTxt?.content || "Loading..."}
          </pre>
        </Card>
      </div>

      {/* Recent citations log */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Recent citations</h3>
        <Card className="bg-white/[0.02] border-white/[0.06] overflow-hidden">
          <div className="max-h-80 overflow-y-auto">
            {citations?.recentCitations.length === 0 && (
              <div className="p-6 text-center text-sm text-muted-foreground">No citations yet</div>
            )}
            {citations?.recentCitations.map((c) => (
              <div key={c.id} className="px-4 py-2.5 border-b border-white/[0.03] last:border-0 flex items-start gap-3">
                <span className={`h-2 w-2 rounded-full mt-1.5 shrink-0 bg-gradient-to-br ${ENGINE_COLORS[c.engine] || "bg-emerald-400"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-foreground">
                    <span className="capitalize">{c.engine}</span>
                    <span className="text-muted-foreground"> · {c.query}</span>
                  </div>
                  {c.citationText && (
                    <div className="text-[11px] text-muted-foreground mt-0.5 truncate">
                      "{c.citationText}"
                    </div>
                  )}
                  {c.citationUrl && (
                    <a href={c.citationUrl} target="_blank" rel="noreferrer" className="text-[10px] text-emerald-300 hover:underline inline-flex items-center gap-0.5 mt-0.5">
                      {c.citationUrl} <ArrowUpRight className="h-2.5 w-2.5" />
                    </a>
                  )}
                </div>
                <div className="text-[10px] text-muted-foreground shrink-0">
                  {new Date(c.checkedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
