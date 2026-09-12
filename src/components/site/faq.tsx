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
    q: "What does 'AI-Visibility-first' actually mean?",
    a: "It means Sage is built around the assumption that 60%+ of informational queries in 2026 end on Google without a click — the answer is generated in-place by an AI engine. We track your visibility across Google, Bing, ChatGPT, Perplexity, Google AI Overviews, SearchGPT, and Claude, generate llms.txt + NLWeb schema to make your content AI-citable, and run a Content Gap Analyzer against top SERPs so your drafts include the topics AI engines actually cite.",
  },
  {
    q: "Why does Sage track Bing natively when most tools ignore it?",
    a: "Bing powers ChatGPT's web search, Microsoft Copilot, and a growing share of voice-search via Edge. If you're not tracking Bing, you're blind to how AI engines that ingest Bing's index perceive you. Sage tracks Google + Bing daily on every plan — including the free BYOK tier — at the same wholesale cost (≈ $0.004 per keyword-day per engine).",
  },
  {
    q: "How does BYOK (Bring Your Own Key) pricing work?",
    a: "On the Free tier, you bring your own DataForSEO API key (for rank tracking, SERP lookups, audits) and your own LLM API key (for content generation — OpenAI, Anthropic, etc.). Sage charges $0 platform fee — you pay DataForSEO and your LLM provider directly at their wholesale rates. On Pro ($49/mo) and Agency ($149/mo), we include usage credits ($30 and $100 respectively) and you can still BYOK to bypass credits entirely. We publish our exact wholesale rates in a transparent cost table on the pricing page.",
  },
  {
    q: "What's the difference between the 3 content generators?",
    a: "Home Page Generator outputs hero copy, value props, social proof blocks, and Organization + FAQ schema — built for conversion on your root domain. Services Generator outputs service H1/H2 structure, pricing tiers, benefit stacks, and Service + LocalBusiness schema for local and national SEO. Blog Post Generator outputs 2,000–4,000 word long-form articles with proper H2/H3 hierarchy, Article schema, internal link suggestions, and a Content Gap report vs the top 10 SERPs. All three run the same De-AI humanizer + E-E-A-T Scorer + SEO Scorer pipeline.",
  },
  {
    q: "What does the De-AI humanizer actually do?",
    a: "Every draft from every generator runs through a humanizer that strips AI watermarks: robotic em-dashes (—), repetitive sentence openers, ChatGPT's telltale transitions ('moreover', 'in conclusion', 'it's worth noting'), bulleted-list padding, and filler phrases. The output reads like a human wrote it. Combined with the Brand Brain (your voice + style guide), drafts come out sounding like your team — not like a chatbot. Each draft shows a humanize-pass diff so you can see exactly what was stripped.",
  },
  {
    q: "What is the Brand Brain and how does it ground generations?",
    a: "Brand Brain is a versioned context-file repository: your brand voice doc, style guide, banned-phrase list, approved glossary, internal link map, and tone examples. Every Home, Services, and Blog generation pulls from your Brand Brain before producing output, so drafts inherit your voice without re-prompting. Team-editable, version-controlled, and exposed via MCP so your AI agents can read it too.",
  },
  {
    q: "How does SEO Version Control work?",
    a: "Every metadata change, schema update, redirect rule, content edit, and internal-link insertion is committed to a per-URL version timeline. You see a Git-style diff for any field, an impact-over-time chart showing what happened to rankings + traffic after the change, and a one-click rollback button. No Git knowledge required — works from the dashboard, the REST API, or via MCP. Many customers wire it into their CI pipeline so every deploy creates a Sage version snapshot automatically.",
  },
  {
    q: "What is the MCP server and what can my AI agent do with it?",
    a: "The Model Context Protocol server exposes 28 Sage tools to any MCP-compatible agent (Claude Code, Cursor, Cline, custom agents). Your agent can run audits, generate content via any of the 3 generators, query keyword rankings on Google + Bing, pull AI-citation reports, apply schema, ship auto-fix PRs, read the Brand Brain, and trigger SEO Version Control rollbacks — all without touching the Sage UI. We publish 5 starter Agent Skills installable via `npx skills add` and a free MCP inspector in the docs.",
  },
  {
    q: "Do you offer white-label / agency features?",
    a: "Yes. The Agency plan ($149/mo) includes white-labeled dashboards, client workspaces with granular permissions, bulk CSV automation, custom branded PDF reports, Competitive AI Battlecards for client-vs-rival benchmarks, and a dedicated success manager. We also offer SOC 2 Type II reports and DPAs for enterprise customers. BYOK is supported on all tiers — agencies often BYOK DataForSEO and pass the wholesale savings through to clients.",
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
