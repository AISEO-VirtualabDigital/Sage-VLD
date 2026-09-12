"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play, Star, Bot, Zap, KeyRound, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardPreview } from "./dashboard-preview";

export function Hero() {
  return (
    <section
      className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background layers */}
      <div className="absolute inset-0 -z-10 bg-grid mask-radial-faded" aria-hidden="true" />
      <div
        className="aurora bg-emerald-500/30"
        style={{ top: "-10%", left: "20%", width: "600px", height: "600px" }}
        aria-hidden="true"
      />
      <div
        className="aurora bg-teal-500/20"
        style={{ top: "30%", right: "-5%", width: "500px", height: "500px" }}
        aria-hidden="true"
      />
      <div
        className="aurora bg-emerald-700/15"
        style={{ bottom: "-10%", left: "50%", width: "700px", height: "500px" }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Announcement pill */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-300 backdrop-blur-sm"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            AI-Visibility-first · agent-native · built on Cloudflare Workers + D1
            <Link href="#features" className="inline-flex items-center gap-0.5 hover:text-emerald-200 transition-colors">
              <ArrowRight className="h-3 w-3" />
            </Link>
          </motion.div>

          {/* Headline */}
          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-6 max-w-4xl text-balance text-4xl sm:text-5xl lg:text-7xl font-display font-bold tracking-tight text-foreground text-pretty"
          >
            Stop selling dashboards.{" "}
            <span className="text-gradient-emerald text-glow">Start shipping rankings.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 max-w-3xl text-balance text-base sm:text-lg lg:text-xl text-muted-foreground text-pretty"
          >
            Meet <span className="font-semibold text-foreground">Sage</span> — the world's first
            AI-Visibility-first, agent-native SEO platform. Track Google &amp; Bing, dominate AI
            search (ChatGPT, Perplexity, AI Overviews), and let your AI assistant execute fixes
            via a native MCP server.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-9 flex flex-col sm:flex-row items-center gap-3"
          >
            <Button
              asChild
              size="lg"
              className="group bg-emerald-500 text-emerald-950 hover:bg-emerald-400 font-semibold shadow-[0_0_40px_-8px] shadow-emerald-500/60 h-12 px-7"
            >
              <Link href="#pricing">
                <KeyRound className="mr-2 h-4 w-4" />
                Connect your first site — BYOK
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 px-7 border-white/10 bg-white/[0.02] hover:bg-white/[0.06] backdrop-blur-sm"
            >
              <Link href="#dashboard">
                <Play className="mr-2 h-4 w-4" />
                Watch live demo
              </Link>
            </Button>
          </motion.div>

          {/* BYOK tagline */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-3.5 text-xs text-emerald-300/90 font-medium inline-flex items-center gap-1.5"
          >
            <Activity className="h-3.5 w-3.5" />
            Pay only for raw data costs. No bloated Ahrefs/Semrush markup.
          </motion.div>

          {/* Trust line */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
          >
            <div className="inline-flex items-center gap-1.5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-emerald-400 text-emerald-400" />
                ))}
              </div>
              <span className="font-medium text-foreground">4.9/5</span>
              <span>· 1,284 reviews</span>
            </div>
            <span className="hidden sm:inline text-white/10">|</span>
            <div className="inline-flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-emerald-400" />
              <span>14-day free trial · no card</span>
            </div>
            <span className="hidden sm:inline text-white/10">|</span>
            <div className="inline-flex items-center gap-1.5">
              <Bot className="h-3.5 w-3.5 text-emerald-400" />
              <span>MCP server + REST API</span>
            </div>
          </motion.div>

          {/* Quick stat strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.26 }}
            className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-white/[0.06] glass max-w-3xl"
          >
            {[
              { value: "208", label: "MCP tools" },
              { value: "35", label: "Categories" },
              { value: "5 AI engines", label: "GEO monitoring" },
              { value: "BYOK", label: "Wholesale pricing" },
            ].map((stat, i) => (
              <div key={i} className="px-5 py-4 bg-white/[0.01] text-center sm:text-left">
                <div className="text-base sm:text-lg font-display font-bold text-foreground leading-tight">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 lg:mt-20 relative"
        >
          <div className="absolute -inset-x-12 -inset-y-6 bg-gradient-to-b from-emerald-500/20 to-transparent blur-3xl -z-10" aria-hidden="true" />
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  );
}
