"use client";

import * as React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  TrendingUp,
  Bot,
  FileText,
  ShieldCheck,
  GitBranch,
  Brain,
  BarChart3,
  KeyRound,
  CreditCard,
  Wrench,
  Link2,
  Search,
  Swords,
  Target,
  ArrowLeft,
  Menu,
  X,
  ChevronDown,
  Check,
} from "lucide-react";
import { LogoMark } from "@/components/site/logo";
import { useSites } from "./hooks/use-dashboard-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type ViewId =
  | "overview"
  | "rankings"
  | "citations"
  | "content"
  | "audits"
  | "changes"
  | "brandbrain"
  | "analytics"
  | "backlinks"
  | "keywords"
  | "competitors"
  | "serpfeatures"
  | "manual"
  | "billing"
  | "apikeys";

const navItems: Array<{ id: ViewId; label: string; icon: typeof LayoutDashboard }> = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "rankings", label: "Rankings", icon: TrendingUp },
  { id: "citations", label: "AI Citations", icon: Bot },
  { id: "content", label: "Content", icon: FileText },
  { id: "audits", label: "Audits", icon: ShieldCheck },
  { id: "changes", label: "Version Control", icon: GitBranch },
  { id: "brandbrain", label: "Brand Brain", icon: Brain },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "backlinks", label: "Backlinks", icon: Link2 },
  { id: "keywords", label: "Keyword Research", icon: Search },
  { id: "competitors", label: "Competitors", icon: Swords },
  { id: "serpfeatures", label: "SERP Features", icon: Target },
  { id: "manual", label: "Manual Tools", icon: Wrench },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "apikeys", label: "API & MCP", icon: KeyRound },
];

interface DashboardShellProps {
  view: ViewId;
  onViewChange: (v: ViewId) => void;
  siteId: string | null;
  onSiteChange: (id: string) => void;
  onExit: () => void;
  children: React.ReactNode;
}

export function DashboardShell({
  view,
  onViewChange,
  siteId,
  onSiteChange,
  onExit,
  children,
}: DashboardShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const { data: sites, isLoading: sitesLoading } = useSites();

  const currentSite = sites?.find((s) => s.id === siteId);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-white/[0.06] bg-white/[0.01]">
        <SidebarContent
          view={view}
          onViewChange={onViewChange}
          onExit={onExit}
        />
      </aside>

      {/* Sidebar — mobile drawer */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative w-64 flex flex-col border-r border-white/[0.06] bg-background">
            <button
              className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-white/[0.06]"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent
              view={view}
              onViewChange={(v) => {
                onViewChange(v);
                setMobileSidebarOpen(false);
              }}
              onExit={onExit}
            />
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-14 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl sticky top-0 z-30 flex items-center gap-3 px-4 lg:px-6">
          <button
            className="lg:hidden p-1.5 rounded-md hover:bg-white/[0.06]"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Site selector */}
          <SiteSelector
            sites={sites || []}
            currentSite={currentSite}
            loading={sitesLoading}
            onChange={onSiteChange}
          />

          <div className="flex-1" />

          {/* Right side: API key indicator + exit */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-md px-2.5 py-1">
            <KeyRound className="h-3 w-3" />
            <span className="font-mono">sage_live_demo...</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onExit}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Marketing site</span>
          </Button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  view,
  onViewChange,
  onExit,
}: {
  view: ViewId;
  onViewChange: (v: ViewId) => void;
  onExit: () => void;
}) {
  return (
    <>
      <div className="h-14 flex items-center gap-2.5 px-4 border-b border-white/[0.06]">
        <LogoMark size={28} />
        <div className="flex flex-col leading-none">
          <span className="text-sm font-display font-bold text-foreground">Sage</span>
          <span className="text-[9px] text-emerald-400/80 uppercase tracking-wider">Dashboard</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left",
              view === item.id
                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"
                : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground border border-transparent"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-white/[0.06]">
        <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            Phase 2 · 28 MCP tools
          </div>
          <div className="text-[11px] text-foreground/70 leading-relaxed">
            Agents can drive everything you see here via JSON-RPC at <code className="text-emerald-300 font-mono">/api/mcp</code>.
          </div>
        </div>
      </div>
    </>
  );
}

function SiteSelector({
  sites,
  currentSite,
  loading,
  onChange,
}: {
  sites: Array<{ id: string; name: string; url: string }>;
  currentSite?: { id: string; name: string; url: string };
  loading: boolean;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-colors text-sm"
      >
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        <span className="font-medium text-foreground max-w-[160px] truncate">
          {loading ? "Loading..." : currentSite?.name || "Select site"}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-72 rounded-lg border border-white/[0.08] bg-popover shadow-xl z-50 overflow-hidden">
          <div className="max-h-72 overflow-y-auto p-1">
            {sites.length === 0 && (
              <div className="px-3 py-4 text-xs text-muted-foreground text-center">No sites connected</div>
            )}
            {sites.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  onChange(s.id);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-white/[0.04] transition-colors text-left",
                  currentSite?.id === s.id && "bg-emerald-500/10"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground truncate">{s.name}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{s.url}</div>
                </div>
                {currentSite?.id === s.id && <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
