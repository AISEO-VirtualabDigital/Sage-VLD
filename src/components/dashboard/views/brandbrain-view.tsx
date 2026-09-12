"use client";

import * as React from "react";
import { Brain, Save, Loader2, Plus, FileText, BookOpen, Ban, Link2 } from "lucide-react";
import {
  useBrandBrain,
  useUpdateBrandBrain,
  useAddBrandBrainFile,
} from "../hooks/use-dashboard-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BrandBrainView({ siteId }: { siteId: string }) {
  const { data: bb, isLoading } = useBrandBrain(siteId);
  const update = useUpdateBrandBrain();
  const addFile = useAddBrandBrainFile();

  const [voiceDoc, setVoiceDoc] = React.useState("");
  const [styleGuide, setStyleGuide] = React.useState("");
  const [bannedText, setBannedText] = React.useState("");
  const [glossaryText, setGlossaryText] = React.useState("");
  const [newFileName, setNewFileName] = React.useState("");
  const [newFileContent, setNewFileContent] = React.useState("");
  const [newFileType, setNewFileType] = React.useState("example");

  // Sync state when data loads
  React.useEffect(() => {
    if (bb) {
      setVoiceDoc(bb.voiceDoc || "");
      setStyleGuide(bb.styleGuide || "");
      const banned = Array.isArray(bb.bannedPhrases) ? bb.bannedPhrases : JSON.parse(bb.bannedPhrases || "[]");
      setBannedText(banned.join("\n"));
      const glossary =
        typeof bb.glossary === "string" ? JSON.parse(bb.glossary || "{}") : bb.glossary || {};
      setGlossaryText(
        Object.entries(glossary)
          .map(([k, v]) => `${k}: ${v}`)
          .join("\n")
      );
    }
  }, [bb]);

  const handleSave = async () => {
    const bannedPhrases = bannedText.split("\n").map((s) => s.trim()).filter(Boolean);
    const glossary: Record<string, string> = {};
    for (const line of glossaryText.split("\n")) {
      const m = line.match(/^([^:]+):\s*(.+)$/);
      if (m) glossary[m[1].trim()] = m[2].trim();
    }
    await update.mutateAsync({ siteId, voiceDoc, styleGuide, bannedPhrases, glossary });
  };

  const handleAddFile = async () => {
    if (!newFileName || !newFileContent) return;
    await addFile.mutateAsync({ siteId, filename: newFileName, content: newFileContent, type: newFileType });
    setNewFileName("");
    setNewFileContent("");
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading Brand Brain...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Brain className="h-6 w-6 text-emerald-400" />
            Brand Brain
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Context repository that grounds every AI generation in your voice.
            {bb && <span className="ml-1 text-emerald-300">· v{bb.version}</span>}
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={update.isPending}
          className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
        >
          {update.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          Save changes
        </Button>
      </div>

      {update.data && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] p-3 text-xs text-emerald-200">
          ✓ Saved · Brand Brain now at v{update.data.version} · all future generations will use updated context
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Voice doc */}
        <Card className="p-4 bg-white/[0.02] border-white/[0.06]">
          <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-2">
            <FileText className="h-3.5 w-3.5 text-emerald-400" />
            Brand Voice
          </Label>
          <textarea
            value={voiceDoc}
            onChange={(e) => setVoiceDoc(e.target.value)}
            rows={6}
            placeholder="Confident + technical. We speak like engineers talking to engineers..."
            className="w-full rounded-md border border-white/[0.08] bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 resize-none"
          />
        </Card>

        {/* Style guide */}
        <Card className="p-4 bg-white/[0.02] border-white/[0.06]">
          <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-2">
            <FileText className="h-3.5 w-3.5 text-cyan-400" />
            Style Guide
          </Label>
          <textarea
            value={styleGuide}
            onChange={(e) => setStyleGuide(e.target.value)}
            rows={6}
            placeholder="Use em-dashes sparingly. Sentence length: 12-22 words avg..."
            className="w-full rounded-md border border-white/[0.08] bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 resize-none"
          />
        </Card>

        {/* Banned phrases */}
        <Card className="p-4 bg-white/[0.02] border-white/[0.06]">
          <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-2">
            <Ban className="h-3.5 w-3.5 text-red-400" />
            Banned Phrases
            <span className="text-[10px] text-muted-foreground font-normal ml-1">(one per line)</span>
          </Label>
          <textarea
            value={bannedText}
            onChange={(e) => setBannedText(e.target.value)}
            rows={6}
            placeholder={"leverage\nsynergy\ngame-changer"}
            className="w-full rounded-md border border-white/[0.08] bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 resize-none"
          />
        </Card>

        {/* Glossary */}
        <Card className="p-4 bg-white/[0.02] border-white/[0.06]">
          <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-2">
            <BookOpen className="h-3.5 w-3.5 text-violet-400" />
            Glossary
            <span className="text-[10px] text-muted-foreground font-normal ml-1">(term: definition)</span>
          </Label>
          <textarea
            value={glossaryText}
            onChange={(e) => setGlossaryText(e.target.value)}
            rows={6}
            placeholder={"GEO: Generative Engine Optimization\nBYOK: Bring Your Own Key\nMCP: Model Context Protocol"}
            className="w-full rounded-md border border-white/[0.08] bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 resize-none"
          />
        </Card>
      </div>

      {/* Files */}
      <Card className="bg-white/[0.02] border-white/[0.06] overflow-hidden">
        <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center gap-2">
          <Link2 className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-foreground">Context files</h3>
          <span className="text-xs text-muted-foreground">({bb?.files?.length ?? 0})</span>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {bb?.files?.map((f) => (
            <div key={f.id} className="px-4 py-2.5 flex items-center gap-3">
              <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-mono text-foreground">{f.filename}</div>
                <div className="text-[10px] text-muted-foreground">
                  {f.type} · {f.content.length} bytes · {new Date(f.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
          {(!bb?.files || bb.files.length === 0) && (
            <div className="px-4 py-6 text-center text-xs text-muted-foreground">No files uploaded yet</div>
          )}
        </div>

        {/* Upload form */}
        <div className="p-3 border-t border-white/[0.06] space-y-2 bg-white/[0.01]">
          <div className="text-xs font-semibold text-foreground">Add new file</div>
          <div className="flex gap-2 flex-wrap">
            <Input
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="filename.md"
              className="flex-1 min-w-[140px] bg-background border-white/[0.08] text-sm"
            />
            <select
              value={newFileType}
              onChange={(e) => setNewFileType(e.target.value)}
              className="rounded-md border border-white/[0.08] bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
            >
              <option value="example">example</option>
              <option value="voice">voice</option>
              <option value="style">style</option>
              <option value="glossary">glossary</option>
              <option value="banned">banned</option>
              <option value="linkmap">linkmap</option>
            </select>
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddFile}
              disabled={addFile.isPending || !newFileName || !newFileContent}
              className="border-white/[0.08]"
            >
              {addFile.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
              Add
            </Button>
          </div>
          <textarea
            value={newFileContent}
            onChange={(e) => setNewFileContent(e.target.value)}
            rows={3}
            placeholder="File contents..."
            className="w-full rounded-md border border-white/[0.08] bg-background px-3 py-2 text-xs font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 resize-none"
          />
        </div>
      </Card>
    </div>
  );
}
