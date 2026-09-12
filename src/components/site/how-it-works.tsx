"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { KeyRound, Cpu, ListChecks, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: KeyRound,
    title: "Connect your site + BYOK keys",
    description:
      "Drop in a URL or install our lightweight snippet — works on WordPress, Shopify, Webflow, Next.js, Astro, or any HTML site. Add your own DataForSEO + LLM API keys to pay wholesale data costs, or use our metered credits on Pro. Connects in under 60 seconds.",
    detail: "1-click installs · BYOK or credits · sitemap auto-discovery",
  },
  {
    icon: Cpu,
    title: "AI analyzes everything across Google, Bing + AI engines",
    description:
      "Sage runs a 358-point audit, crawls your content, decodes competitors, tracks rankings on Google + Bing, and benchmarks your AI visibility across ChatGPT, Perplexity, Google AI Overviews, SearchGPT, and Claude. All in the background, edge-native on Cloudflare Workers + D1.",
    detail: "358-point audit · 5 AI engines tracked · competitor reverse-engineering",
  },
  {
    icon: ListChecks,
    title: "Generate content + ship prioritized fixes",
    description:
      "Use the Home, Services, or Blog generator — each grounded in your Brand Brain, humanized via De-AI, and scored on E-E-A-T + SEO + Content Gap. Every audit issue is ranked by traffic impact; Sage ships auto-fix pull requests and AI drafts ready to review in one click.",
    detail: "3 generators · Brand Brain grounded · auto-fix PRs",
  },
  {
    icon: TrendingUp,
    title: "Watch rankings + AI citations climb — with rollback",
    description:
      "Daily rank tracking across Google + Bing, plus weekly AI-citation reports showing where your brand now appears inside AI engines. Every change is committed to SEO Version Control — see impact-over-time and one-click rollback any metadata, schema, or content edit.",
    detail: "daily refresh · AI citation reports · one-click rollback",
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
            AI-generated content and technical fixes on day one — and pay only for the data they
            actually use.
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
