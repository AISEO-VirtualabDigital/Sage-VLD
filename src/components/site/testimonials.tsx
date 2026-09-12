"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
  accent: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "We replaced Yoast Premium, Ahrefs Lite, and two freelance SEO writers with Sage. Same output, half the cost, and we now show up in ChatGPT answers — which Yoast never tracked.",
    name: "Maya Chen",
    role: "Head of Growth",
    company: "LinearB",
    initials: "MC",
    accent: "from-emerald-400 to-teal-500",
    rating: 5,
  },
  {
    quote:
      "The MCP server is what sold us. Our engineering team wired Sage into our CI pipeline — every PR now gets a schema check, an internal-link suggestion, and a content score automatically.",
    name: "Dmitri Volkov",
    role: "Staff Engineer",
    company: "Vercel",
    initials: "DV",
    accent: "from-emerald-400 to-emerald-600",
    rating: 5,
  },
  {
    quote:
      "I run an agency with 38 client sites. Sage's white-label reports + bulk CSV automation cut my reporting time from 12 hours a week to under 2. Clients finally see GEO as a real metric.",
    name: "Sarah Okafor",
    role: "Founder",
    company: "Northgate SEO",
    initials: "SO",
    accent: "from-teal-400 to-emerald-500",
    rating: 5,
  },
  {
    quote:
      "We were about to pay Ahrefs $129/mo just for rank tracking. Sage gives us rank tracking, AI content, schema generation, AND AI visibility for $89. The math is embarrassing for them.",
    name: "James Park",
    role: "Marketing Director",
    company: "Retool",
    initials: "JP",
    accent: "from-emerald-500 to-teal-600",
    rating: 5,
  },
  {
    quote:
      "The AI content generator is the first one I've trusted. It grounds every draft in our existing docs so it doesn't hallucinate features we don't have. We publish 4x more content now.",
    name: "Anika Patel",
    role: "Content Lead",
    company: "Mercury Financial",
    initials: "AP",
    accent: "from-emerald-400 to-cyan-500",
    rating: 5,
  },
  {
    quote:
      "Switched from Rank Math Pro after 4 years. Sage's audit caught 47 issues Rank Math never flagged — mostly schema and Core Web Vitals on mobile. Organic traffic up 38% in 60 days.",
    name: "Carlos Mendez",
    role: "Solo Founder",
    company: "Boltcard",
    initials: "CM",
    accent: "from-emerald-400 to-emerald-600",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative py-20 lg:py-28"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-[11px] font-medium text-emerald-300 uppercase tracking-wider">
            Customers
          </div>
          <h2
            id="testimonials-heading"
            className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground text-balance"
          >
            10,000+ teams switched from{" "}
            <span className="text-gradient-emerald">Yoast, Ahrefs, and Rank Math</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-pretty">
            From solo founders to publicly-traded SaaS companies — teams choose Sage because it
            actually moves rankings, not because it has the most checkboxes.
          </p>
        </div>

        {/* Testimonial grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
              className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 hover:border-white/[0.12] hover:bg-white/[0.04] transition-colors flex flex-col"
            >
              <Quote className="h-5 w-5 text-emerald-400/60 mb-3" aria-hidden="true" />

              <div className="flex gap-0.5 mb-3">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-emerald-400 text-emerald-400" />
                ))}
              </div>

              <blockquote className="text-sm text-foreground/90 leading-relaxed flex-1 text-pretty">
                "{t.quote}"
              </blockquote>

              <figcaption className="mt-5 flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                <div
                  className={`inline-flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br ${t.accent} text-emerald-950 font-bold text-sm`}
                  aria-hidden="true"
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {t.role} · <span className="text-emerald-300/80">{t.company}</span>
                  </div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        {/* Logos strip */}
        <div className="mt-16">
          <p className="text-center text-[11px] uppercase tracking-wider text-muted-foreground mb-6">
            Trusted by teams shipping SEO at scale
          </p>
          <div className="relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
            <div className="flex gap-12 animate-marquee whitespace-nowrap">
              {[...Array(2)].map((_, set) => (
                <div key={set} className="flex gap-12 items-center shrink-0">
                  {[
                    "LinearB",
                    "Vercel",
                    "Retool",
                    "Mercury",
                    "Northgate",
                    "Boltcard",
                    "Notion",
                    "Cursor",
                    "Resend",
                    "Supabase",
                  ].map((name) => (
                    <div
                      key={name + set}
                      className="text-xl font-display font-bold text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                    >
                      {name}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
