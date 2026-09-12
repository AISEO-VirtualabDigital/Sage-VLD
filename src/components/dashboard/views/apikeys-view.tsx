"use client";

import * as React from "react";
import { KeyRound, Copy, Check, Terminal, Bot } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DEMO_KEY = "sage_live_demo_key_0000000000000000";
const MCP_URL = "https://sage.virtualab.digital/api/mcp";

export function ApiKeysView() {
  const [copied, setCopied] = React.useState<string | null>(null);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const claudeConfig = JSON.stringify(
    {
      mcpServers: {
        sage: {
          url: MCP_URL,
          headers: { Authorization: `Bearer ${DEMO_KEY}` },
        },
      },
    },
    null,
    2
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <KeyRound className="h-6 w-6 text-emerald-400" />
          API & MCP
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Connect AI agents (Claude Desktop, Cursor, Cline) to Sage via MCP. 28 tools across 8 categories.
        </p>
      </div>

      {/* API key */}
      <Card className="p-5 bg-white/[0.02] border-white/[0.06]">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Your API key</div>
        <div className="flex items-center gap-2">
          <code className="flex-1 px-3 py-2 rounded-md bg-background border border-white/[0.08] text-sm font-mono text-emerald-300 break-all">
            {DEMO_KEY}
          </code>
          <Button size="sm" variant="outline" onClick={() => copy(DEMO_KEY, "key")} className="border-white/[0.08]">
            {copied === "key" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
        </div>
        <div className="text-[11px] text-muted-foreground mt-2">
          Read tools (16) work without auth. Write tools (12) require this Bearer token.
        </div>
      </Card>

      {/* MCP server info */}
      <Card className="p-5 bg-white/[0.02] border-white/[0.06]">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">MCP server endpoint</div>
        <div className="flex items-center gap-2">
          <code className="flex-1 px-3 py-2 rounded-md bg-background border border-white/[0.08] text-sm font-mono text-foreground break-all">
            {MCP_URL}
          </code>
          <Button size="sm" variant="outline" onClick={() => copy(MCP_URL, "url")} className="border-white/[0.08]">
            {copied === "url" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
        </div>
        <div className="mt-3 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2 mb-1">
            <Terminal className="h-3 w-3" /> Quick test:
          </div>
          <code className="block px-3 py-2 rounded-md bg-background border border-white/[0.08] text-[10px] font-mono text-foreground/80 overflow-x-auto">
            curl -X POST {MCP_URL} -H "Content-Type: application/json" -H "Authorization: Bearer {DEMO_KEY}" -d '{"{"}"jsonrpc":"2.0","method":"tools/list","id":1{"}"}'
          </code>
        </div>
      </Card>

      {/* Claude Desktop config */}
      <Card className="p-5 bg-white/[0.02] border-white/[0.06]">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
          <Bot className="h-3.5 w-3.5 text-emerald-400" />
          Claude Desktop / Cursor config
        </div>
        <div className="text-[11px] text-muted-foreground mb-2">
          Add to <code className="text-foreground/80 font-mono">~/Library/Application Support/Claude/claude_desktop_config.json</code> (macOS) or equivalent:
        </div>
        <div className="relative">
          <pre className="px-3 py-3 rounded-md bg-background border border-white/[0.08] text-[11px] font-mono text-foreground/80 overflow-x-auto">
            {claudeConfig}
          </pre>
          <Button
            size="sm"
            variant="outline"
            onClick={() => copy(claudeConfig, "claude")}
            className="absolute top-2 right-2 h-7 border-white/[0.08]"
          >
            {copied === "claude" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          </Button>
        </div>
      </Card>

      {/* Tool summary */}
      <Card className="p-5 bg-white/[0.02] border-white/[0.06]">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Available tools (28)</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {TOOL_LIST.map((t) => (
            <div key={t.name} className="flex items-center gap-2">
              <span
                className={`h-1.5 w-1.5 rounded-full shrink-0 ${t.write ? "bg-amber-400" : "bg-emerald-400"}`}
              />
              <code className="font-mono text-foreground/80 text-[11px]">{t.name}</code>
              <span className="text-[10px] text-muted-foreground ml-auto">{t.write ? "WRITE" : "READ"}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

const TOOL_LIST = [
  { name: "sage.sites.list", write: false },
  { name: "sage.sites.create", write: true },
  { name: "sage.sites.delete", write: true },
  { name: "sage.keywords.list", write: false },
  { name: "sage.keywords.add", write: true },
  { name: "sage.rankings.get", write: false },
  { name: "sage.rankings.refresh", write: true },
  { name: "sage.citations.get", write: false },
  { name: "sage.citations.battlecards", write: false },
  { name: "sage.llmstxt.generate", write: false },
  { name: "sage.content.generate.homepage", write: true },
  { name: "sage.content.generate.services", write: true },
  { name: "sage.content.generate.blog", write: true },
  { name: "sage.content.score", write: false },
  { name: "sage.content.humanize", write: false },
  { name: "sage.content.list", write: false },
  { name: "sage.audits.latest", write: false },
  { name: "sage.audits.run", write: true },
  { name: "sage.links.internal", write: false },
  { name: "sage.schema.generate", write: false },
  { name: "sage.changes.list", write: false },
  { name: "sage.changes.rollback", write: true },
  { name: "sage.changes.record", write: true },
  { name: "sage.brandbrain.get", write: false },
  { name: "sage.brandbrain.update", write: true },
  { name: "sage.brandbrain.files.add", write: true },
  { name: "sage.analytics.gsc", write: false },
  { name: "sage.analytics.decay", write: false },
];
