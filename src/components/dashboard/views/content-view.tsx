"use client";

import * as React from "react";
import { Plus, FileText, Home, Briefcase, Loader2, Sparkles, X } from "lucide-react";
import { useContentDrafts, useGenerateContent } from "../hooks/use-dashboard-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TYPE_ICONS: Record<string, typeof Home> = { home: Home, services: Briefcase, blog: FileText };
const TYPE_COLORS: Record<string, string> = {
  home: "text-emerald-400 bg-emerald-500/10",
  services: "text-cyan-400 bg-cyan-500/10",
  blog: "text-violet-400 bg-violet-500/10",
};

export function ContentView({ siteId }: { siteId: string }) {
  const { data: drafts, isLoading } = useContentDrafts(siteId);
  const [showGen, setShowGen] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Content</h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI-generated drafts · Home, Services, Blog · all humanized + E-E-A-T/SEO/Gap scored
          </p>
        </div>
        <Button onClick={() => setShowGen(true)} className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400">
          <Plus className="h-3.5 w-3.5" />
          Generate content
        </Button>
      </div>

      {showGen && <GenerateForm siteId={siteId} onDone={() => setShowGen(false)} />}

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading drafts...</div>
      ) : drafts && drafts.length === 0 ? (
        <Card className="p-8 text-center bg-white/[0.02] border-white/[0.06]">
          <p className="text-sm text-muted-foreground">No content drafts yet. Click "Generate content" to create your first.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {drafts?.map((d) => {
            const Icon = TYPE_ICONS[d.type] || FileText;
            return (
              <Card key={d.id} className="p-4 bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12] transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <span className={`inline-flex items-center justify-center h-8 w-8 rounded-md ${TYPE_COLORS[d.type] || "bg-white/[0.04] text-muted-foreground"}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground px-1.5 py-0.5 rounded bg-white/[0.04]">
                    {d.status}
                  </span>
                </div>
                <div className="text-sm font-display font-semibold text-foreground line-clamp-2 mb-1">
                  {d.title}
                </div>
                {d.slug && (
                  <div className="text-[10px] text-muted-foreground font-mono truncate mb-3">{d.slug}</div>
                )}

                {/* Score row */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <ScorePill label="E-E-A-T" value={d.eeatScore} />
                  <ScorePill label="SEO" value={d.seoScore} />
                  <ScorePill label="Gap" value={d.gapScore} />
                </div>

                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>v{d.version} · {d.humanized ? "humanized" : "raw"}</span>
                  <span>{new Date(d.updatedAt).toLocaleDateString()}</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ScorePill({ label, value }: { label: string; value: number | null }) {
  const color = value === null ? "text-muted-foreground" : value >= 80 ? "text-emerald-400" : value >= 60 ? "text-amber-400" : "text-red-400";
  return (
    <div className="rounded-md bg-white/[0.03] border border-white/[0.04] px-2 py-1 text-center">
      <div className={`text-sm font-display font-bold ${color}`}>{value ?? "—"}</div>
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function GenerateForm({ siteId, onDone }: { siteId: string; onDone: () => void }) {
  const [type, setType] = React.useState<"home" | "services" | "blog">("blog");
  const [targetKeyword, setTargetKeyword] = React.useState("");
  const [serviceName, setServiceName] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [location, setLocation] = React.useState("");
  const gen = useGenerateContent();
  const [result, setResult] = React.useState<null | { draftId: string; scores: { eeat: number; seo: number; gap: number }; wordCount: number }>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetKeyword) return;
    const args: Record<string, unknown> = { type, siteId, targetKeyword };
    if (type === "services" && serviceName) args.serviceName = serviceName;
    if (type === "blog" && title) args.title = title;
    if (type === "services" && location) args.location = location;
    const r = await gen.mutateAsync(args as Parameters<typeof gen.mutateAsync>[0]);
    setResult({
      draftId: (r as { draftId: string }).draftId,
      scores: (r as { scores: { eeat: number; seo: number; gap: number } }).scores,
      wordCount: (r as { wordCount: number }).wordCount,
    });
  };

  return (
    <Card className="p-5 bg-white/[0.02] border-emerald-500/20 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          Generate new content
        </h3>
        <button onClick={onDone} className="p-1 rounded hover:bg-white/[0.06]">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {result ? (
        <div className="rounded-md border border-emerald-500/20 bg-emerald-500/[0.04] p-4 space-y-2">
          <div className="text-sm font-semibold text-emerald-300">✓ Draft generated</div>
          <div className="text-xs text-muted-foreground">Word count: {result.wordCount}</div>
          <div className="grid grid-cols-3 gap-2">
            <ScorePill label="E-E-A-T" value={result.scores.eeat} />
            <ScorePill label="SEO" value={result.scores.seo} />
            <ScorePill label="Gap" value={result.scores.gap} />
          </div>
          <div className="text-[10px] text-muted-foreground font-mono">draftId: {result.draftId}</div>
          <Button size="sm" variant="outline" onClick={onDone} className="border-white/[0.08]">
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Type selector */}
          <div>
            <Label className="text-xs text-foreground">Content type</Label>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {(["home", "services", "blog"] as const).map((t) => {
                const Icon = TYPE_ICONS[t];
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md border text-xs font-medium capitalize transition-colors ${
                      type === t
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : "border-white/[0.08] bg-white/[0.02] text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label className="text-xs text-foreground">Target keyword *</Label>
            <Input
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
              placeholder="ai seo platform"
              required
              className="mt-1 bg-background border-white/[0.08]"
            />
          </div>

          {type === "services" && (
            <>
              <div>
                <Label className="text-xs text-foreground">Service name *</Label>
                <Input
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="AI SEO Services"
                  required
                  className="mt-1 bg-background border-white/[0.08]"
                />
              </div>
              <div>
                <Label className="text-xs text-foreground">Location (optional)</Label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="San Francisco, CA"
                  className="mt-1 bg-background border-white/[0.08]"
                />
              </div>
            </>
          )}

          {type === "blog" && (
            <div>
              <Label className="text-xs text-foreground">Title (optional — auto-generated if blank)</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="The 2026 Guide to AI-Visibility"
                className="mt-1 bg-background border-white/[0.08]"
              />
            </div>
          )}

          <div className="text-[11px] text-muted-foreground bg-white/[0.02] border border-white/[0.04] rounded p-2">
            Pipeline: draft → De-AI humanizer → E-E-A-T/SEO/Gap score → persist
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={onDone}>Cancel</Button>
            <Button
              type="submit"
              size="sm"
              disabled={gen.isPending || !targetKeyword}
              className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
            >
              {gen.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Sparkles className="h-3.5 w-3.5 mr-1" />}
              {gen.isPending ? "Generating..." : "Generate"}
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
