"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Bot,
  TrendingUp,
  Code2,
  FileSearch,
  Link2,
  Target,
  ShieldCheck,
  Plug,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: string[];
  badge?: string;
  featured?: boolean;
}

const features: Feature[] = [
  {
    icon: Sparkles,
    title: "AI Content Generator",
    description:
      "Generate SEO-optimized articles, meta tags, FAQs, and image alt text that match search intent — grounded in your existing site content so it stays factually accurate and on-brand.",
    bullets: ["Site-grounded drafts", "Readability + intent score", "One-click humanize pass"],
    badge: "Most used",
    featured: true,
  },
  {
    icon: Bot,
    title: "AI Visibility / GEO Tracking",
    description:
      "See how often your brand is cited in ChatGPT, Perplexity, Google AI Overviews, Claude, and Grok. Sage auto-generates llms.txt and scores your content for AI citability.",
    bullets: ["5 AI engines tracked", "Citation share over time", "llms.txt auto-generator"],
    badge: "New",
    featured: true,
  },
  {
    icon: TrendingUp,
    title: "Rank Tracking",
    description:
      "Daily rank tracking across desktop, mobile, and local packs — for any country, city, or language. Trigger alerts on volatility and watch competitors side-by-side.",
    bullets: ["Daily + on-demand refresh", "Local + map pack", "Competitor overlay"],
  },
  {
    icon: Code2,
    title: "AI Schema Markup",
    description:
      "Auto-generate JSON-LD for Articles, Products, FAQ, HowTo, Breadcrumbs, Organization, and 30+ schema types — with conditional rules per page template and AI-suggested properties.",
    bullets: ["30+ schema types", "Conditional templates", "Zero invalid markup"],
  },
  {
    icon: FileSearch,
    title: "Site Audit Engine",
    description:
      "358-point technical SEO audit that runs continuously — Core Web Vitals, broken links, missing meta, redirect chains, indexability, structured data errors, and one-click auto-fixes.",
    bullets: ["358 checks, 24h refresh", "Auto-fix PRs", "Page-level severity"],
  },
  {
    icon: Link2,
    title: "AI Internal Linking",
    description:
      "Sage reads every page on your site and suggests the highest-context internal links — then auto-inserts them with anchor text that matches your target keywords and orphaned-content strategy.",
    bullets: ["Context-aware suggestions", "Orphaned content rescue", "Bulk apply + undo"],
  },
  {
    icon: Target,
    title: "Competitor Intelligence",
    description:
      "Drop in a competitor URL and Sage reverse-engineers their content strategy, keyword gaps, schema patterns, and backlink velocity — then queues the opportunities into your roadmap.",
    bullets: ["Keyword gap analysis", "Content velocity monitor", "Backlink source intel"],
  },
  {
    icon: ShieldCheck,
    title: "Backlink Monitor",
    description:
      "Track every backlink pointing to your site — new, lost, toxic — with auto-disavow file generation. Get alerted the moment a high-authority link disappears or a spammy one appears.",
    bullets: ["Real-time link alerts", "Toxicity scoring", "Auto-disavow exports"],
  },
  {
    icon: Plug,
    title: "MCP & REST API",
    description:
      "Connect Sage to Claude, Cursor, ChatGPT, or any agent via our Model Context Protocol server. Run audits, generate content, and ship fixes programmatically — no UI needed.",
    bullets: ["MCP server + 28 tools", "REST + webhooks", "BYOK LLM support"],
    badge: "For agents",
    featured: true,
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="relative py-20 lg:py-28"
      aria-labelledby="features-heading"
    >
      <div className="absolute inset-0 -z-10 bg-dots mask-radial-faded opacity-50" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-[11px] font-medium text-emerald-300 uppercase tracking-wider">
            Capabilities
          </div>
          <h2
            id="features-heading"
            className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground text-balance"
          >
            Every SEO capability, <span className="text-gradient-emerald">AI-native</span> — in one workspace
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-pretty">
            We benchmarked Yoast, Rank Math, AIOSEO, Open SEO, and SEO Machine — then built the parts
            that actually move rankings into a single AI-first platform. No bloated WordPress plugins,
            no per-feature upsells.
          </p>
        </div>

        {/* Feature grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.06 }}
      className={cn(
        "group relative rounded-xl border p-5 sm:p-6 transition-all duration-300",
        feature.featured
          ? "border-emerald-500/25 bg-emerald-500/[0.04] hover:border-emerald-500/40 hover:bg-emerald-500/[0.07]"
          : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
      )}
    >
      {/* Featured glow */}
      {feature.featured && (
        <div
          className="absolute -inset-px -z-10 rounded-xl bg-gradient-to-b from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-md"
          aria-hidden="true"
        />
      )}

      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div
          className={cn(
            "inline-flex items-center justify-center h-10 w-10 rounded-lg",
            feature.featured
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-white/[0.04] text-emerald-400"
          )}
        >
          <feature.icon className="h-5 w-5" />
        </div>
        {feature.badge && (
          <span
            className={cn(
              "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full",
              feature.featured
                ? "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30"
                : "bg-white/[0.05] text-muted-foreground border border-white/[0.08]"
            )}
          >
            {feature.badge}
          </span>
        )}
      </div>

      {/* Body */}
      <h3 className="text-lg font-display font-semibold text-foreground">{feature.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed text-pretty">
        {feature.description}
      </p>

      {/* Bullets */}
      <ul className="mt-4 space-y-1.5">
        {feature.bullets.map((b, i) => (
          <li key={i} className="flex items-center gap-2 text-xs text-foreground/80">
            <span className="h-1 w-1 rounded-full bg-emerald-400" />
            {b}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
