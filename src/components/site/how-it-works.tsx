"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plug, Cpu, ListChecks, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Plug,
    title: "Connect your site",
    description:
      "Drop in a URL or install our lightweight snippet. Sage works on WordPress, Shopify, Webflow, Next.js, Astro, or any HTML site. No CMS plugin bloat — connects in under 60 seconds.",
    detail: "1-click installs · REST & MCP API · sitemap auto-discovery",
  },
  {
    icon: Cpu,
    title: "AI analyzes everything",
    description:
      "Sage runs a 358-point audit, crawls your content, decodes competitors, and benchmarks your AI visibility across ChatGPT, Perplexity, Google AIO, Claude, and Grok. All in the background.",
    detail: "358-point audit · 5 AI engines tracked · competitor reverse-engineering",
  },
  {
    icon: ListChecks,
    title: "Get prioritized fixes",
    description:
      "Every issue is ranked by traffic impact and effort. Sage ships auto-fix pull requests for technical SEO and AI-generated content drafts for on-page — both ready to review in one click.",
    detail: "Impact-scored queue · auto-fix PRs · AI content drafts",
  },
  {
    icon: TrendingUp,
    title: "Watch rankings + AI visibility climb",
    description:
      "Daily rank tracking across desktop, mobile, and local — plus weekly AI-citation reports showing where your brand now appears inside AI engines. ROI measured in clicks, not vanity metrics.",
    detail: "daily refresh · AI citation reports · ROI attribution",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative py-20 lg:py-28 border-y border-white/[0.05] bg-white/[0.01]"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-[11px] font-medium text-emerald-300 uppercase tracking-wider">
            How it works
          </div>
          <h2
            id="how-heading"
            className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground text-balance"
          >
            From signup to first ranking win in{" "}
            <span className="text-gradient-emerald">under 14 days</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-pretty">
            No 6-week onboarding, no professional services contract. Most teams ship their first
            AI-generated content and technical fixes on day one.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative"
            >
              {/* Connector line (desktop) */}
              {i < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-7 left-[calc(100%-1rem)] w-8 h-px bg-gradient-to-r from-emerald-500/40 to-transparent"
                  aria-hidden="true"
                />
              )}

              {/* Step number + icon */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative inline-flex items-center justify-center h-14 w-14 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-300">
                  <step.icon className="h-6 w-6" />
                  <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-emerald-500 text-emerald-950 text-xs font-bold font-mono inline-flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-display font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed text-pretty">
                {step.description}
              </p>
              <p className="mt-3 text-[11px] text-emerald-300/80 font-medium border-t border-white/[0.05] pt-2.5">
                {step.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
