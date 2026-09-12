"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Sparkles, ArrowRight, Building2, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Plan {
  id: string;
  name: string;
  icon: typeof Zap;
  tagline: string;
  monthly: number;
  annual: number;
  features: string[];
  cta: string;
  featured?: boolean;
}

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    icon: Zap,
    tagline: "For solo founders and small blogs getting started with AI-driven SEO.",
    monthly: 29,
    annual: 23,
    features: [
      "1 site · 50 tracked keywords",
      "AI content generator (10 articles/mo)",
      "358-point site audit (weekly)",
      "Schema markup generator",
      "Rank tracking (Google + Bing)",
      "Community support",
    ],
    cta: "Start free trial",
  },
  {
    id: "pro",
    name: "Pro",
    icon: Sparkles,
    tagline: "For growing teams that need full AI SEO workflows + GEO tracking.",
    monthly: 89,
    annual: 71,
    features: [
      "5 sites · 1,000 tracked keywords",
      "Unlimited AI content generation",
      "AI Visibility / GEO tracking (5 engines)",
      "AI internal linking + auto-fix PRs",
      "Competitor intelligence (5 rivals)",
      "llms.txt + NLWeb schema automation",
      "MCP server + REST API access",
      "Priority support (4h SLA)",
    ],
    cta: "Start free trial",
    featured: true,
  },
  {
    id: "agency",
    name: "Agency",
    icon: Building2,
    tagline: "For agencies and enterprises managing multiple client sites at scale.",
    monthly: 249,
    annual: 199,
    features: [
      "Unlimited sites · 10,000 keywords",
      "Everything in Pro, plus:",
      "White-label dashboard + reports",
      "Client workspaces + permissions",
      "Bulk CSV automation",
      "Backlink monitor + auto-disavow",
      "Dedicated success manager",
      "99.9% uptime SLA + SOC 2",
    ],
    cta: "Talk to sales",
  },
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
            Pricing
          </div>
          <h2
            id="pricing-heading"
            className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground text-balance"
          >
            One price. <span className="text-gradient-emerald">Every AI feature.</span> No upsells.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-pretty">
            We benchmarked Yoast ($99/yr), Rank Math ($79/yr), and Ahrefs ($129/mo) — then packed
            every capability into a single plan. Cancel anytime. 14-day free trial on every tier.
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
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500 text-emerald-950">
                    <Star className="h-3 w-3 fill-emerald-950" />
                    Most popular
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
              <p className="text-sm text-muted-foreground text-pretty min-h-[40px]">{plan.tagline}</p>

              <div className="mt-5 mb-5 flex items-baseline gap-1">
                <span className="text-4xl font-display font-bold text-foreground">
                  ${annual ? plan.annual : plan.monthly}
                </span>
                <span className="text-sm text-muted-foreground">/mo</span>
                {annual && (
                  <span className="ml-2 text-[10px] text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    billed annually
                  </span>
                )}
              </div>

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

        <p className="mt-10 text-center text-xs text-muted-foreground">
          All plans include the MCP server, REST API, webhooks, and unlimited team members. Need
          on-prem or 50K+ keywords?{" "}
          <Link href="#" className="text-emerald-300 hover:text-emerald-200 underline underline-offset-2">
            Talk to us
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
