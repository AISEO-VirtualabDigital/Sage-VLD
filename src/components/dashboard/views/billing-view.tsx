"use client";

import * as React from "react";
import { CreditCard, Zap, ExternalLink, Loader2, Check, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DEMO_KEY = "sage_live_demo_key_0000000000000000";

export function BillingView() {
  const [loading, setLoading] = React.useState<"pro" | "agency" | "portal" | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleUpgrade = async (plan: "pro" | "agency", interval: "month" | "year") => {
    setLoading(plan);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, interval }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(null);
    }
  };

  const handlePortal = async () => {
    setLoading("portal");
    setError(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Portal failed");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading("portal");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-emerald-400" />
          Billing & Plan
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Hybrid pricing: flat platform fee + wholesale data credits. BYOK optional on all tiers.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/[0.04] p-3 text-xs text-red-300">
          {error}
        </div>
      )}

      {/* Current plan + credits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="p-5 bg-white/[0.02] border-white/[0.06]">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Current plan</div>
          <div className="text-2xl font-display font-bold text-foreground">Free · BYOK</div>
          <div className="text-xs text-muted-foreground mt-1">$0/mo · pay wholesale data costs only</div>
          <div className="mt-3 text-[11px] text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded px-2 py-1 inline-block">
            BYOK active · DataForSEO + LLM keys configured
          </div>
        </Card>
        <Card className="p-5 bg-white/[0.02] border-white/[0.06]">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Credits balance</div>
          <div className="text-2xl font-display font-bold text-foreground">$0.00</div>
          <div className="text-xs text-muted-foreground mt-1">Free plan includes $0 credits · BYOK bypasses</div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Zap className="h-3 w-3 text-emerald-400" />
            Upgrade to Pro for $30/mo included credits
          </div>
        </Card>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Free */}
        <Card className="p-6 bg-white/[0.02] border-white/[0.06] flex flex-col">
          <div className="text-sm font-display font-bold text-foreground">Free · BYOK</div>
          <div className="text-xs text-muted-foreground mt-1">Current plan</div>
          <div className="mt-4 text-3xl font-display font-bold text-foreground">$0<span className="text-sm text-muted-foreground font-normal">/mo</span></div>
          <div className="text-[11px] text-emerald-300 mt-1">Pay wholesale data costs only</div>
          <ul className="mt-4 space-y-1.5 flex-1">
            {["1 site · 100 keywords", "BYOK DataForSEO + LLM keys", "All 3 generators (5/mo)", "MCP server + REST API"].map((f) => (
              <li key={f} className="text-xs text-foreground/80 flex items-start gap-1.5">
                <Check className="h-3 w-3 text-emerald-400 mt-0.5 shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <Button variant="outline" disabled className="mt-4 border-white/[0.08] text-muted-foreground">
            Current plan
          </Button>
        </Card>

        {/* Pro */}
        <Card className="p-6 bg-emerald-500/[0.04] border-emerald-500/30 flex flex-col glow-emerald">
          <div className="flex items-center justify-between">
            <div className="text-sm font-display font-bold text-foreground">Pro</div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-emerald-950">
              Recommended
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">For growing teams</div>
          <div className="mt-4 text-3xl font-display font-bold text-foreground">$49<span className="text-sm text-muted-foreground font-normal">/mo</span></div>
          <div className="text-[11px] text-emerald-300 mt-1">+$30/mo wholesale credits included</div>
          <ul className="mt-4 space-y-1.5 flex-1">
            {["5 sites · 1,000 keywords", "Unlimited AI content generation", "AI Citation Tracker (5 engines)", "Brand Brain + Version Control", "Competitive AI Battlecards", "Priority support (4h SLA)"].map((f) => (
              <li key={f} className="text-xs text-foreground/80 flex items-start gap-1.5">
                <Check className="h-3 w-3 text-emerald-400 mt-0.5 shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <Button
            onClick={() => handleUpgrade("pro", "month")}
            disabled={loading !== null}
            className="mt-4 bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
          >
            {loading === "pro" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
            {loading === "pro" ? "Redirecting..." : "Upgrade to Pro"}
          </Button>
        </Card>

        {/* Agency */}
        <Card className="p-6 bg-white/[0.02] border-white/[0.06] flex flex-col">
          <div className="text-sm font-display font-bold text-foreground">Agency</div>
          <div className="text-xs text-muted-foreground mt-1">For agencies at scale</div>
          <div className="mt-4 text-3xl font-display font-bold text-foreground">$149<span className="text-sm text-muted-foreground font-normal">/mo</span></div>
          <div className="text-[11px] text-emerald-300 mt-1">+$100/mo wholesale credits included</div>
          <ul className="mt-4 space-y-1.5 flex-1">
            {["Unlimited sites · 10,000 keywords", "White-label dashboard + reports", "Client workspaces + permissions", "Bulk CSV automation", "SOC 2 Type II + DPAs", "Dedicated success manager"].map((f) => (
              <li key={f} className="text-xs text-foreground/80 flex items-start gap-1.5">
                <Check className="h-3 w-3 text-emerald-400 mt-0.5 shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <Button
            onClick={() => handleUpgrade("agency", "month")}
            disabled={loading !== null}
            variant="outline"
            className="mt-4 border-white/[0.08]"
          >
            {loading === "agency" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <TrendingUp className="h-3.5 w-3.5" />}
            {loading === "agency" ? "Redirecting..." : "Upgrade to Agency"}
          </Button>
        </Card>
      </div>

      {/* Manage subscription */}
      <Card className="p-5 bg-white/[0.02] border-white/[0.06]">
        <h3 className="text-sm font-semibold text-foreground mb-2">Manage subscription</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Already subscribed? Open the Stripe customer portal to update payment methods, change plans, view invoices, or cancel.
        </p>
        <Button onClick={handlePortal} disabled={loading === "portal"} variant="outline" className="border-white/[0.08]">
          {loading === "portal" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ExternalLink className="h-3.5 w-3.5" />}
          Open Stripe portal
        </Button>
      </Card>

      {/* Wholesale rates reference */}
      <Card className="p-5 bg-white/[0.02] border-white/[0.06]">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4 text-emerald-400" />
          Wholesale data rates (what you actually pay)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {[
            ["Keyword track (per keyword/day)", "$0.004"],
            ["SERP lookup (per query)", "$0.002"],
            ["AI citation check (per query/engine)", "$0.008"],
            ["Site audit (per page)", "$0.001"],
            ["Content gap analysis (per draft)", "$0.04"],
            ["AI content generation (per draft)", "$0.02"],
            ["Schema validation (per URL)", "$0.0005"],
            ["Backlink lookup (per URL)", "$0.006"],
          ].map(([op, cost]) => (
            <div key={op} className="flex items-center justify-between px-3 py-1.5 rounded-md bg-white/[0.02] border border-white/[0.04]">
              <span className="text-muted-foreground">{op}</span>
              <span className="font-mono text-emerald-300 font-semibold">{cost}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground mt-3">
          No markup. Same rates DataForSEO charges. BYOK on Free = these rates direct from your DataForSEO account.
        </p>
      </Card>
    </div>
  );
}
