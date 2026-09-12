"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, LifeBuoy } from "lucide-react";

const faqs = [
  {
    q: "What makes Sage different from Yoast or Rank Math?",
    a: "Yoast and Rank Math are WordPress plugins focused on on-page SEO for a single CMS. Sage is an AI-native platform that works across any stack, tracks AI-search visibility (GEO) — how often your brand shows up in ChatGPT, Perplexity, and Google AI Overviews — and ships agentic workflows via an MCP API so AI agents can run SEO for you. It also includes unlimited AI content generation, which Yoast and Rank Math meter per-post.",
  },
  {
    q: "Does Sage work on non-WordPress sites?",
    a: "Yes. Sage is CMS-agnostic. Connect any site via a 4KB JavaScript snippet, sitemap URL, or our REST/MCP API. We have native integrations for WordPress, Shopify, Webflow, Next.js, Astro, and static HTML. You can also use Sage purely as an API — many teams run it from CI/CD pipelines with no UI at all.",
  },
  {
    q: "What is GEO (Generative Engine Optimization) and why should I care?",
    a: "GEO is the practice of optimizing your content so AI engines like ChatGPT, Perplexity, Google AI Overviews, Claude, and Grok cite your brand as a source. Recent studies show 60% of informational queries now end on Google without a click — the answer is generated in-place. If your brand isn't cited inside those AI answers, you lose the impression. Sage tracks your visibility across 5 AI engines, generates llms.txt files, and scores how 'AI-citable' your content is.",
  },
  {
    q: "Can I use Sage with my existing SEO tools?",
    a: "Yes. Sage integrates with Google Search Console, GA4, Ahrefs, DataForSEO, WordPress, Shopify, Webflow, Zapier, Slack, and GitHub. The MCP API also lets you connect Sage to any AI agent (Claude, Cursor, ChatGPT) or custom workflow. Many of our customers use Sage alongside Ahrefs for backlink research — Sage handles the audits, content, rank tracking, and AI visibility.",
  },
  {
    q: "Is there a free trial or free tier?",
    a: "Every paid plan starts with a 14-day free trial — no credit card required. The Starter plan also includes a permanent free tier limited to 1 site and 50 tracked keywords. You can stay on the free tier indefinitely; we'll never auto-bill you.",
  },
  {
    q: "How accurate is the AI content generator?",
    a: "Sage's AI is trained on top-ranking pages in your niche and grounded in your existing site content, so it produces factually accurate, on-brand copy that already matches search intent. Every generated piece includes a content score (0–100), readability analysis (Flesch), internal-link suggestions, and a one-click humanize pass. We do not generate generic ChatGPT-style fluff — every draft cites real URLs from your site.",
  },
  {
    q: "What does the MCP server actually do?",
    a: "The Model Context Protocol server exposes 28 Sage tools to any MCP-compatible AI agent (Claude Desktop, Cursor, Cline, etc.). Your agent can run audits, generate content, query keyword rankings, apply schema, ship auto-fix PRs, and pull AI-visibility reports — all without touching the Sage UI. We publish a free MCP inspector and starter prompts in our docs.",
  },
  {
    q: "Do you offer white-label / agency features?",
    a: "Yes. The Agency plan ($249/mo) includes white-labeled dashboards, client workspaces with granular permissions, bulk CSV automation, custom branded PDF reports, and a dedicated success manager. We also offer SOC 2 Type II reports and DPAs for enterprise customers.",
  },
];

export function FAQ() {
  return (
    <section
      id="faq"
      className="relative py-20 lg:py-28 border-y border-white/[0.05] bg-white/[0.01]"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-[11px] font-medium text-emerald-300 uppercase tracking-wider">
            FAQ
          </div>
          <h2
            id="faq-heading"
            className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground text-balance"
          >
            Questions, answered
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-pretty">
            Everything you need to know before swapping your current SEO stack for Sage.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
          className="mt-12"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-5 first:mt-0 overflow-hidden"
              >
                <AccordionTrigger className="text-left text-sm sm:text-base font-display font-semibold text-foreground hover:no-underline py-5 hover:text-emerald-300 transition-colors">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5 text-pretty">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Support CTA */}
        <div className="mt-10 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-500/15 text-emerald-300 shrink-0">
            <LifeBuoy className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-display font-semibold text-foreground">
              Still have questions?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Our SEO engineers reply in under 4 hours, every weekday. No chatbots, no tiers.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/[0.04] text-emerald-200 hover:bg-emerald-500/[0.1] hover:text-emerald-100 h-11"
          >
            <Link href="#">
              Talk to an SEO engineer
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
