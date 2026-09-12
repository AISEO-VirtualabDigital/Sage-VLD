"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  content: string;
}

const posts: BlogPost[] = [
  {
    slug: "ai-visibility-geo-2026",
    title: "AI Visibility (GEO) in 2026: How to Get Cited by ChatGPT, Perplexity & Google AI Overviews",
    excerpt: "60% of informational queries now end on Google without a click. If AI engines don't cite you, you lose. Here's how to win AI share-of-voice.",
    category: "AI Visibility",
    readTime: "8 min read",
    date: "2026-09-12",
    content: `# AI Visibility (GEO) in 2026

60% of informational queries now end on Google without a click — the answer is generated in-place by an AI engine. If your brand isn't cited inside ChatGPT, Perplexity, or Google AI Overviews, you lose the impression.

## What is GEO?

Generative Engine Optimization (GEO) is the practice of optimizing your content so AI engines cite your brand as a source. It's the successor to traditional SEO, focused on AI engines rather than just Google.

## Why it matters

Your customers ask ChatGPT and Perplexity for recommendations — not just Google. Recent studies show AI Overviews appear in 50%+ of Google searches. If your brand isn't cited, you're invisible.

## 5 tactics to win AI citations

### 1. Generate llms.txt
The llms.txt file tells AI engines what your site is about and which pages to cite. It's like robots.txt for AI. Sage auto-generates this for you.

### 2. Write quotable passages
AI engines cite concise, factual statements. Add 40-50 word definitions near the top of your content. Use clear, quotable language.

### 3. Use NLWeb schema aggregation
NLWeb schema-graph aggregation makes your content machine-discoverable. Combine all your JSON-LD into one deduplicated graph that AI agents can read in one request.

### 4. Track your AI share-of-voice
You can't improve what you don't measure. Track how often AI engines cite you across ChatGPT, Perplexity, Google AI Overviews, SearchGPT, and Claude.

### 5. Compare against competitors
Use AI battlecards to see where competitors get cited and you don't. Close the content gaps.

## How Sage helps

Sage tracks your AI visibility across 5 engines, generates llms.txt automatically, and scores your content for AI citability. Start your free trial today.`,
  },
  {
    slug: "google-bing-dual-tracking",
    title: "Why You Need Bing Rank Tracking (It Powers ChatGPT Search)",
    excerpt: "Bing powers ChatGPT's web search, Microsoft Copilot, and Edge voice search. If you're not tracking Bing, you're blind to how AI engines perceive you.",
    category: "Rank Tracking",
    readTime: "6 min read",
    date: "2026-09-10",
    content: `# Why You Need Bing Rank Tracking

Most SEO tools track Google only. But Bing powers ChatGPT's web search, Microsoft Copilot, and a growing share of voice search via Edge. If you're not tracking Bing, you're blind to how AI engines that ingest Bing's index perceive you.

## The Bing-AI connection

When you ask ChatGPT a question, it searches the web using Bing. If your site ranks well on Bing, ChatGPT is more likely to cite you. This makes Bing rank tracking critical for AI visibility.

## How to track both

Sage tracks Google + Bing natively on every plan — including the free BYOK tier. You see both engines side-by-side in one dashboard, with daily position updates and trend charts.

## What to look for

1. **Position gaps**: Keywords where you rank on Google but not Bing (or vice versa)
2. **SERP feature differences**: Bing shows different features than Google
3. **Bing-specific opportunities**: Less competition on Bing for some keywords

## Start tracking

Add your keywords once, Sage tracks them on both engines automatically. No extra cost, no extra setup.`,
  },
  {
    slug: "byok-seo-pricing",
    title: "BYOK SEO: How Bring-Your-Own-Key Pricing Crushes Ahrefs & Semrush",
    excerpt: "Ahrefs charges $129/mo because they pre-pay for data and resell it at 4x markup. Sage passes raw DataForSEO costs through at wholesale. Here's the math.",
    category: "Pricing",
    readTime: "5 min read",
    date: "2026-09-08",
    content: `# BYOK SEO Pricing Explained

Ahrefs charges $129/mo because they pre-pay for data and resell it at 4x markup. Sage passes raw DataForSEO costs through at wholesale — you pay the exact same rate DataForSEO charges.

## How BYOK works

Bring Your Own Key (BYOK) means you supply your own DataForSEO + LLM API keys. Sage charges $0 platform fee — you pay DataForSEO and your LLM provider directly at their wholesale rates.

## The math

Tracking 1,000 keywords daily for a month:
- 30,000 keyword-days x $0.004 = **$120/mo wholesale**
- Ahrefs charges $129/mo for the same data
- Sage Pro ($49) + $30 credits = **$79 all-in**

And you also get GEO tracking, AI content generation, and the MCP server.

## Transparent wholesale rates

Sage publishes exact wholesale rates:
- Keyword track: $0.004 per keyword per day
- SERP lookup: $0.002 per query
- AI citation check: $0.008 per query per engine
- Site audit: $0.001 per page
- AI content generation: $0.02 per draft

No markup. Same rates DataForSEO charges.

## When to use BYOK vs credits

- **Free tier**: BYOK only — pay wholesale direct
- **Pro tier ($49)**: $30 credits included, BYOK optional
- **Agency tier ($149)**: $100 credits included, BYOK optional

BYOK is always cheaper if you track a lot. Credits are more convenient for casual use.`,
  },
];

export function BlogList() {
  return (
    <section className="py-20 lg:py-28 border-y border-white/[0.05] bg-white/[0.01]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-[11px] font-medium text-emerald-300 uppercase tracking-wider">
            Blog & Resources
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground text-balance">
            SEO insights from the <span className="text-gradient-emerald">Sage team</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-pretty">
            Deep dives on AI visibility, GEO, dual-engine tracking, BYOK pricing, and the future of SEO.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              href={`#blog-${post.slug}`}
              className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 hover:border-emerald-500/30 hover:bg-white/[0.04] transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {post.category}
                </span>
                <span className="text-[10px] text-muted-foreground inline-flex items-center gap-1">
                  <Clock className="h-2.5 w-2.5" />
                  {post.readTime}
                </span>
              </div>
              <h3 className="text-lg font-display font-semibold text-foreground group-hover:text-emerald-300 transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3 text-pretty">
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground inline-flex items-center gap-1">
                  <Calendar className="h-2.5 w-2.5" />
                  {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
                <ArrowRight className="h-4 w-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline" className="border-white/[0.08] bg-white/[0.02]">
            <Link href="#">
              View all posts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function getBlogPosts() {
  return posts;
}
