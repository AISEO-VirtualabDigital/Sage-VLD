"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Sparkles, ArrowRight, Building2, Zap, KeyRound, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Plan {
  id: string;
  name: string;
  icon: typeof Zap;
  tagline: string;
  monthly: number;
  credits: number;
  features: string[];
  cta: string;
  featured?: boolean;
  badge?: string;
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free · BYOK",
    icon: KeyRound,
    tagline: "Bring your own DataForSEO + LLM API keys. Full platform access. Pay wholesale data costs only.",
    monthly: 0,
    credits: 0,
    features: [
      "1 site · 100 tracked keywords",
      "BYOK DataForSEO + LLM keys",
      "Google + Bing rank tracking",
      "All 3 content generators (5/mo)",
      "Site audit engine (weekly)",
      "Schema + llms.txt automation",
      "MCP server + REST API",
      "Community support",
    ],
    cta: "Start free — add your keys",
  },
  {
    id: "pro",
    name: "Pro",
    icon: Sparkles,
    tagline: "For growing teams that want full AI SEO workflows + GEO tracking without surprise invoices.",
    monthly: 49,
    credits: 30,
    features: [
      "5 sites · 1,000 tracked keywords",
      "Includes $30/mo usage credits",
      "BYOK optional (cheaper if you do)",
      "Unlimited AI content generation",
      "AI Citation Tracker (5 engines)",
      "Brand Brain + Version Control",
      "Competitive AI Battlecards",
      "AI internal linking + auto-fix PRs",
      "Priority support (4h SLA)",
    ],
    cta: "Start 14-day free trial",
    featured: true,
    badge: "Most popular",
  },
  {
    id: "agency",
    name: "Agency",
    icon: Building2,
    tagline: "For agencies and enterprises managing multiple client sites at scale. White-label everything.",
    monthly: 149,
    credits: 100,
    features: [
      "Unlimited sites · 10,000 keywords",
      "Includes $100/mo usage credits",
      "Everything in Pro, plus:",
      "White-label dashboard + reports",
      "Client workspaces + permissions",
      "Bulk CSV automation",
      "SOC 2 Type II + DPAs",
      "Dedicated success manager",
      "99.9% uptime SLA",
    ],
    cta: "Talk to sales",
  },
];

const wholesaleUsage = [
  { operation: "Keyword track (per keyword, per day)", cost: "$0.004", note: "Google + Bing" },
  { operation: "SERP lookup (per query)", cost: "$0.002", note: "Top 100 results" },
  { operation: "AI citation check (per query, per engine)", cost: "$0.008", note: "ChatGPT, Perplexity, AIO, SearchGPT" },
  { operation: "Site audit (per page crawled)", cost: "$0.001", note: "Includes CWV + JS render" },
  { operation: "Content gap analysis (per draft)", cost: "$0.04", note: "vs top 10 SERPs" },
  { operation: "AI content generation (per draft)", cost: "$0.02", note: "LLM cost · BYOK bypasses" },
  { operation: "Schema validation (per URL)", cost: "$0.0005", note: "Rich Results check" },
  { operation: "Backlink lookup (per URL)", cost: "$0.006", note: "Real-time index" },
];

export function Pricing() {
  const [annual, setAnnual] = React.useState(true);

  return (
    <section
      id="pricing"
      className="relative py-20 lg:py-28 border-y border-white/[0.05] bg-white/[0.01]"
      aria-labelledby="pricing-heading"
    >
      <div
        className="aurora bg-emerald-500/15"
        style={{ top: "20%", left: "30%", width: "500px", height: "500px" }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-[11px] font-medium text-emerald-300 uppercase tracking-wider">
            Pricing · Hybrid BYOK
          </div>
          <h2
            id="pricing-heading"
            className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground text-balance"
          >
            A flat platform fee. <span className="text-gradient-emerald">Wholesale data costs.</span> Zero markup.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-pretty">
            Ahrefs charges $129/mo because they pre-pay for data and resell it at 4× markup. Sage
            passes raw DataForSEO costs through at wholesale. Bring your own key on Free, or use our
            metered credits on Pro/Agency — either way, you see the exact cost of every operation.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.02] p-1">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-medium transition-colors",
                !annual ? "bg-emerald-500 text-emerald-950" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-medium transition-colors inline-flex items-center gap-1.5",
                annual ? "bg-emerald-500 text-emerald-950" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Annual
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full",
                  annual ? "bg-emerald-950/20 text-emerald-950" : "bg-emerald-500/15 text-emerald-300"
                )}
              >
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={cn(
                "relative rounded-2xl border p-6 sm:p-7 flex flex-col",
                plan.featured
                  ? "border-emerald-500/40 bg-emerald-500/[0.05] glow-emerald lg:scale-[1.03] lg:-my-2"
                  : "border-white/[0.08] bg-white/[0.02]"
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500 text-emerald-950">
                    <Sparkles className="h-3 w-3 fill-emerald-950" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2.5 mb-2">
                <div
                  className={cn(
                    "inline-flex items-center justify-center h-9 w-9 rounded-lg",
                    plan.featured
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-white/[0.04] text-muted-foreground"
                  )}
                >
                  <plan.icon className="h-4 w-4" />
                </div>
                <h3 className="text-xl font-display font-bold text-foreground">{plan.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground text-pretty min-h-[60px]">{plan.tagline}</p>

              <div className="mt-5 mb-1 flex items-baseline gap-1">
                <span className="text-4xl font-display font-bold text-foreground">
                  ${annual && plan.monthly > 0 ? Math.round(plan.monthly * 0.8) : plan.monthly}
                </span>
                <span className="text-sm text-muted-foreground">/mo</span>
                {plan.monthly > 0 && annual && (
                  <span className="ml-2 text-[10px] text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    billed annually
                  </span>
                )}
                {plan.monthly === 0 && (
                  <span className="ml-2 text-[10px] text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    forever free
                  </span>
                )}
              </div>
              {plan.credits > 0 && (
                <p className="text-xs text-emerald-300/90 mb-4">
                  + ${plan.credits}/mo wholesale data credits included
                </p>
              )}
              {plan.credits === 0 && (
                <p className="text-xs text-muted-foreground mb-4">
                  Pay-as-you-go at exact wholesale cost
                </p>
              )}

              <Button
                asChild
                className={cn(
                  "w-full h-11 font-semibold",
                  plan.featured
                    ? "bg-emerald-500 text-emerald-950 hover:bg-emerald-400 shadow-[0_0_30px_-8px] shadow-emerald-500/60"
                    : "bg-white/[0.04] text-foreground hover:bg-white/[0.08] border border-white/[0.08]"
                )}
              >
                <Link href="#">
                  {plan.cta}
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>

              <ul className="mt-6 space-y-2.5 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                    <Check
                      className={cn(
                        "h-4 w-4 mt-0.5 shrink-0",
                        plan.featured ? "text-emerald-400" : "text-emerald-400/80"
                      )}
                    />
                    <span className="text-pretty">{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Wholesale usage transparency table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <div className="rounded-2xl border border-white/[0.08] glass overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2.5">
              <Calculator className="h-4 w-4 text-emerald-400" />
              <div>
                <div className="text-sm font-semibold text-foreground">
                  Wholesale data costs — what you actually pay
                </div>
                <div className="text-xs text-muted-foreground">
                  No markup. Same rates DataForSEO charges us. BYOK on Free = these rates direct.
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] text-[10px] uppercase tracking-wider text-muted-foreground">
                    <th className="text-left font-medium px-5 py-2.5">Operation</th>
                    <th className="text-right font-medium px-5 py-2.5">Cost</th>
                    <th className="text-left font-medium px-5 py-2.5">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {wholesaleUsage.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.01] transition-colors"
                    >
                      <td className="px-5 py-2.5 text-foreground/90">{row.operation}</td>
                      <td className="px-5 py-2.5 text-right font-mono text-emerald-300 font-semibold">
                        {row.cost}
                      </td>
                      <td className="px-5 py-2.5 text-xs text-muted-foreground">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground text-center">
            <span className="text-foreground/80">Math example:</span> Tracking 1,000 keywords daily
            for a month ≈ 30,000 keyword-days × $0.004 = <span className="text-emerald-300 font-semibold">$120/mo wholesale</span>.
            Ahrefs charges $129/mo for the same. Sage Pro ($49) + $30 credits = $79 all-in — and you
            also get GEO tracking, AI content, and the MCP server.
          </p>
        </motion.div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          All plans include the MCP server (28 tools), REST API, webhooks, and unlimited team
          members. Need on-prem or 50K+ keywords?{" "}
          <Link href="#" className="text-emerald-300 hover:text-emerald-200 underline underline-offset-2">
            Talk to us
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
