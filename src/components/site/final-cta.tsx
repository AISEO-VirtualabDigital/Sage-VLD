"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section
      className="relative py-24 lg:py-32 overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Background */}
      <div
        className="aurora bg-emerald-500/30"
        style={{ top: "20%", left: "50%", transform: "translateX(-50%)", width: "700px", height: "500px" }}
        aria-hidden="true"
      />
      <div
        className="aurora bg-teal-500/15"
        style={{ top: "40%", left: "20%", width: "400px", height: "400px" }}
        aria-hidden="true"
      />
      <div
        className="aurora bg-emerald-700/15"
        style={{ top: "30%", right: "10%", width: "400px", height: "400px" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-grid mask-radial-faded opacity-50" aria-hidden="true" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl border border-emerald-500/25 glass-strong p-8 sm:p-12 lg:p-16 text-center overflow-hidden"
        >
          {/* Inner glow */}
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-500/[0.08] via-transparent to-transparent"
            aria-hidden="true"
          />

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-300 backdrop-blur-sm mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            14-day free trial · no credit card
          </div>

          <h2
            id="cta-heading"
            className="text-3xl sm:text-4xl lg:text-6xl font-display font-bold tracking-tight text-foreground text-balance text-pretty"
          >
            Stop selling dashboards.{" "}
            <span className="text-gradient-emerald text-glow">Start shipping rankings.</span>
          </h2>

          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground text-pretty">
            Sage is the AI-Visibility-first, agent-native SEO platform. Track Google + Bing. Dominate
            AI search. Let your agents run fixes via MCP. Pay wholesale data costs — no Ahrefs markup,
            no per-feature upsells, no bloated WordPress plugins.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="group bg-emerald-500 text-emerald-950 hover:bg-emerald-400 font-semibold shadow-[0_0_40px_-8px] shadow-emerald-500/60 h-12 px-7"
            >
              <Link href="#pricing">
                Connect your first site — BYOK
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 px-7 border-white/10 bg-white/[0.02] hover:bg-white/[0.06]"
            >
              <Link href="#features">
                Explore all features
              </Link>
            </Button>
          </div>

          {/* Trust strip */}
          <div className="mt-10 pt-8 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            {[
              "Free BYOK tier forever",
              "Google + Bing daily tracking",
              "5 AI engines monitored",
              "MCP + REST API access",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span className="text-foreground/80">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
