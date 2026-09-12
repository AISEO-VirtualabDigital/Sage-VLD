"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play, Star, TrendingUp, Bot, Zap } from "lucide-react";
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
            New: AI Visibility / GEO tracking + MCP server is live
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
            The AI-native{" "}
            <span className="text-gradient-emerald text-glow">SEO platform</span>
            <br className="hidden sm:block" /> built for the agentic web
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 max-w-2xl text-balance text-base sm:text-lg lg:text-xl text-muted-foreground text-pretty"
          >
            Sage audits your site, writes optimized content, generates schema, tracks AI-search
            visibility (GEO), and ships technical fixes — automatically. Built by SEO engineers who
            got tired of bloated WordPress plugins.
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
                Start 14-day free trial
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
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

          {/* Trust line */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
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
              <span>No credit card required</span>
            </div>
            <span className="hidden sm:inline text-white/10">|</span>
            <div className="inline-flex items-center gap-1.5">
              <Bot className="h-3.5 w-3.5 text-emerald-400" />
              <span>MCP & REST API included</span>
            </div>
          </motion.div>

          {/* Quick stat strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-white/[0.06] glass max-w-3xl"
          >
            {[
              { icon: TrendingUp, value: "10K+", label: "Sites optimized" },
              { icon: Bot, value: "2.4M", label: "Keywords tracked" },
              { icon: Sparkles, value: "1.8M", label: "AI articles shipped" },
              { icon: Star, value: "4.9/5", label: "Customer rating" },
            ].map((stat, i) => (
              <div key={i} className="px-5 py-4 bg-white/[0.01]">
                <stat.icon className="h-4 w-4 text-emerald-400/80 mb-1.5" />
                <div className="text-xl sm:text-2xl font-display font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
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
