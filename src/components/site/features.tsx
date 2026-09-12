"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Search,
  Bot,
  Home,
  Briefcase,
  FileText,
  Sparkles,
  Brain,
  GitBranch,
  Swords,
  ShieldCheck,
  Code2,
  Link2,
  Plug,
  BadgeCheck,
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

interface FeatureGroup {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  features: Feature[];
}

const groups: FeatureGroup[] = [
  {
    id: "engines",
    label: "Core engines",
    title: "Multi-engine rank + citation tracking",
    subtitle:
      "Legacy SEO tools treat Google as the only search engine. Sage tracks both classical SERPs and the new AI engines side-by-side — because that's where your customers actually ask questions in 2026.",
    features: [
      {
        icon: Search,
        title: "Google + Bing Dual-Core Tracking",
        description:
          "Native rank tracking across both search ecosystems. Daily positions, SERP features (featured snippets, People Also Ask, image pack, local pack), device + location granularity, and intent classification for every keyword.",
        bullets: [
          "Google + Bing daily refresh",
          "Device + location precision",
          "SERP feature attribution",
          "Intent + topic clustering (TF-IDF + K-means)",
        ],
        featured: true,
      },
      {
        icon: Bot,
        title: "AI Citation Tracker (GEO)",
        description:
          "Real-time monitoring of brand mentions, citation frequency, and Share-of-Voice across ChatGPT, Google AI Overviews, Perplexity, and SearchGPT. Backed by automated llms.txt generation and NLWeb schema-graph aggregation.",
        bullets: [
          "4 AI engines + SearchGPT",
          "Citation SOV % over time",
          "llms.txt + NLWeb automation",
          "Per-query citation log",
        ],
        badge: "Moat",
        featured: true,
      },
    ],
  },
  {
    id: "generators",
    label: "Content engines",
    title: "Three specialized AI generators — not one generic blob",
    subtitle:
      "Every generator ships with an automated De-AI humanizer (zero robotic em-dashes, zero filler patterns), an E-E-A-T Scorer, an SEO Scorer, and a live Content Gap Analyzer comparing your draft against the top 10 ranking SERPs.",
    features: [
      {
        icon: Home,
        title: "Home Page Generator",
        description:
          "Architected for high conversion and core keyword dominance. Generates hero copy, value props, social proof blocks, FAQ schema, and organization schema — all grounded in your Brand Brain so it sounds like your team wrote it.",
        bullets: [
          "Conversion-architected hero",
          "Auto FAQ + Organization schema",
          "Brand-Brain grounded drafts",
          "E-E-A-T scored (0–100)",
        ],
      },
      {
        icon: Briefcase,
        title: "Services Generator",
        description:
          "Conversion-focused service pages built for local and national organic capture. Generates service H1/H2 structure, pricing tiers, benefit stacks, Service schema, and LocalBusiness schema for multi-location businesses.",
        bullets: [
          "Local + national SEO structure",
          "Service + LocalBusiness schema",
          "Pricing tier + benefit blocks",
          "Multi-location variants",
        ],
      },
      {
        icon: FileText,
        title: "Blog Post Generator",
        description:
          "Long-form, authoritative content engine. Generates 2,000–4,000 word articles with proper H2/H3 hierarchy, internal link suggestions, Article schema, and a Content Gap Analyzer report showing exactly which semantic topics your draft is missing vs the top 10.",
        bullets: [
          "2,000–4,000 word drafts",
          "Content Gap vs top 10 SERPs",
          "Article schema auto-attached",
          "De-AI humanizer pass",
        ],
        featured: true,
      },
      {
        icon: BadgeCheck,
        title: "De-AI Humanizer + Scoring Suite",
        description:
          "Every draft from every generator runs through the same pipeline: an automated humanizer that strips AI watermarks and robotic em-dashes, an E-E-A-T Scorer, an SEO Scorer, and a Content Gap Detector. All on a 0–100 scale with actionable fix lists.",
        bullets: [
          "Strips AI watermarks + em-dashes",
          "E-E-A-T Scorer (Experience, Expertise, Authority, Trust)",
          "SEO Scorer (intent, density, readability)",
          "Content Gap vs top 10 SERPs",
        ],
        badge: "Standard on all 3",
      },
    ],
  },
  {
    id: "moat",
    label: "Moat",
    title: "The features competitors can't copy in a quarter",
    subtitle:
      "Brand Brain grounds every generation in your voice. SEO Version Control gives you one-click rollback. Competitive AI Battlecards show how AI engines perceive you vs your rivals. The MCP server turns Sage into an agent skill, not a dashboard.",
    features: [
      {
        icon: Brain,
        title: "Brand Brain",
        description:
          "A context-file repository — brand voice, style guides, internal link maps, banned phrases, approved terminology — that grounds every AI output. Upload once; every Home, Services, and Blog draft inherits it. No more re-prompting.",
        bullets: [
          "Brand voice + style guides",
          "Internal link graph map",
          "Banned-phrase + glossary",
          "Versioned + team-editable",
        ],
        badge: "Moat",
        featured: true,
      },
      {
        icon: GitBranch,
        title: "SEO Version Control",
        description:
          "Every metadata change, schema update, redirect rule, and content edit is committed to a versioned timeline. See the impact-over-time chart for any change. One-click rollback to any prior state — no Git knowledge required.",
        bullets: [
          "Change history per URL",
          "Impact-over-time tracking",
          "One-click rollback",
          "Diff view for any field",
        ],
        badge: "Moat",
        featured: true,
      },
      {
        icon: Swords,
        title: "Competitive AI Battlecards",
        description:
          "Instant insights into how AI engines perceive you versus your top 3 competitors. See which brands get cited most often, for which queries, and which content gaps are letting rivals steal your AI share-of-voice.",
        bullets: [
          "Side-by-side AI SOV %",
          "Per-query citation winners",
          "Rival content gap reports",
          "Weekly delta alerts",
        ],
        badge: "Moat",
      },
      {
        icon: Code2,
        title: "Schema & GEO Automation",
        description:
          "Advanced structured data builder with 30+ schema types, conditional templates, and automated llms.txt + NLWeb schema-graph aggregation. Validates against Google's Rich Results Test on every publish.",
        bullets: [
          "30+ schema types",
          "Conditional templates",
          "llms.txt + NLWeb aggregation",
          "Auto Rich Results validation",
        ],
      },
      {
        icon: ShieldCheck,
        title: "Cloud Site Audit Engine",
        description:
          "Crawler handling Core Web Vitals, broken links, duplicate content, and JS/SSR rendering checks. Runs continuously on a 24h refresh with severity scoring and one-click auto-fix PRs shipped straight to your repo.",
        bullets: [
          "358 checks, 24h refresh",
          "JS/SSR rendering checks",
          "Auto-fix PRs to GitHub",
          "Page-level severity",
        ],
      },
      {
        icon: Link2,
        title: "AI Internal Linking & Link Health",
        description:
          "Context-aware internal link suggestions, orphaned-content rescue, link-rot detection, and bulk updates. Reads your full site graph and suggests the highest-context links with anchor text matching your target keywords.",
        bullets: [
          "Context-aware suggestions",
          "Orphaned-content rescue",
          "Link-rot detection",
          "Bulk apply + undo",
        ],
      },
      {
        icon: Plug,
        title: "MCP Server + REST API",
        description:
          "Sage exposes 28 MCP tools so Claude Code, Cursor, or your custom agent can audit, generate, apply schema, and ship fixes programmatically. No UI needed — run Sage from your CI/CD pipeline.",
        bullets: [
          "28 MCP tools, OAuth + BYOK",
          "REST + webhooks",
          "5 starter Agent Skills (npx add)",
          "GitHub Action ready",
        ],
        badge: "For agents",
        featured: true,
      },
      {
        icon: Sparkles,
        title: "Analytics Sync + Decay Detection",
        description:
          "Native Google Search Console + GA4 integration with per-URL attribution and content-decay detection. Sage flags pages losing traffic before you notice, with root-cause analysis and a one-click refresh plan.",
        bullets: [
          "GSC + GA4 per-URL attribution",
          "Content-decay alerts",
          "Root-cause analysis",
          "Auto refresh plans",
        ],
      },
    ],
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
            that actually move rankings into a single AI-first platform. Edge-native on Cloudflare
            Workers + D1. BYOK DataForSEO. No bloated WordPress plugins, no per-feature upsells.
          </p>
        </div>

        {/* Render each group */}
        <div className="mt-16 space-y-16 lg:space-y-24">
          {groups.map((group) => (
            <div key={group.id} className="relative">
              {/* Group header */}
              <div className="max-w-3xl mb-8">
                <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-300 mb-3">
                  <span className="h-px w-6 bg-emerald-500/60" />
                  {group.label}
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-foreground text-balance">
                  {group.title}
                </h3>
                <p className="mt-3 text-sm sm:text-base text-muted-foreground text-pretty">
                  {group.subtitle}
                </p>
              </div>

              {/* Feature grid */}
              <div
                className={cn(
                  "grid gap-4",
                  group.features.length === 2 && "grid-cols-1 md:grid-cols-2",
                  group.features.length === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
                  group.features.length === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
                  group.features.length > 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                )}
              >
                {group.features.map((feature, i) => (
                  <FeatureCard key={i} feature={feature} index={i} />
                ))}
              </div>
            </div>
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
      transition={{ duration: 0.4, delay: (index % 4) * 0.05 }}
      className={cn(
        "group relative rounded-xl border p-5 sm:p-6 transition-all duration-300 flex flex-col",
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
      <h4 className="text-base font-display font-semibold text-foreground">{feature.title}</h4>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed text-pretty flex-1">
        {feature.description}
      </p>

      {/* Bullets */}
      <ul className="mt-4 space-y-1.5">
        {feature.bullets.map((b, i) => (
          <li key={i} className="flex items-center gap-2 text-xs text-foreground/80">
            <span className="h-1 w-1 rounded-full bg-emerald-400 shrink-0" />
            {b}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
