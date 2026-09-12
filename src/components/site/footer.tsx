"use client";

import * as React from "react";
import Link from "next/link";
import { LogoMark } from "./logo";
import { Twitter, Github, Linkedin, Rss } from "lucide-react";

const footerNav = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Dashboard", href: "#dashboard" },
      { label: "Pricing", href: "#pricing" },
      { label: "Compare", href: "#compare" },
      { label: "MCP server", href: "#" },
      { label: "REST API", href: "#" },
    ],
  },
  {
    title: "AI SEO",
    links: [
      { label: "AI Visibility / GEO", href: "#" },
      { label: "AI Content Generator", href: "#" },
      { label: "AI Schema Markup", href: "#" },
      { label: "AI Internal Linking", href: "#" },
      { label: "llms.txt Generator", href: "#" },
      { label: "Site Audit Engine", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Blog", href: "#" },
      { label: "SEO Playbook 2026", href: "#" },
      { label: "MCP Inspector", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About VirtuaLab", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Security · SOC 2", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-white/[0.06] bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5" aria-label="Sage by VirtuaLab Digital — home">
              <LogoMark size={36} />
              <div className="flex flex-col leading-none">
                <span className="text-xl font-display font-bold tracking-tight text-foreground">Sage</span>
                <span className="text-[10px] font-medium text-emerald-400/80 tracking-wide uppercase">
                  by VirtuaLab Digital
                </span>
              </div>
            </Link>
            <p className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-xs text-pretty">
              The AI-native SEO platform built for the agentic web. Audit, optimize, write, and
              track — all powered by AI.
            </p>

            {/* Social */}
            <div className="mt-6 flex items-center gap-2">
              {[
                { icon: Twitter, label: "Twitter / X", href: "#" },
                { icon: Github, label: "GitHub", href: "#" },
                { icon: Linkedin, label: "LinkedIn", href: "#" },
                { icon: Rss, label: "Blog RSS", href: "#" },
              ].map((s, i) => (
                <Link
                  key={i}
                  href={s.href}
                  aria-label={s.label}
                  className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-white/[0.06] bg-white/[0.02] text-muted-foreground hover:text-emerald-300 hover:border-emerald-500/30 hover:bg-emerald-500/[0.06] transition-colors"
                >
                  <s.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>

            {/* Compliance badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              {["SOC 2 Type II", "GDPR", "ISO 27001"].map((b) => (
                <span
                  key={b}
                  className="text-[10px] font-medium px-2 py-1 rounded-md border border-white/[0.06] bg-white/[0.02] text-muted-foreground"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {footerNav.map((col, i) => (
            <nav key={i} aria-label={col.title}>
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3.5">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-emerald-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* SEO content row */}
        <div className="mt-14 pt-8 border-t border-white/[0.06]">
          <p className="text-xs text-muted-foreground leading-relaxed max-w-4xl text-pretty">
            <span className="font-semibold text-foreground">Sage by VirtuaLab Digital</span> is an
            AI-native SEO platform that unifies on-page SEO, technical audits, schema markup
            generation, AI content writing, rank tracking, AI-search visibility (GEO), competitor
            intelligence, backlink monitoring, and agentic MCP/REST API access. Built as a modern
            alternative to Yoast, Rank Math, AIOSEO, Ahrefs, and Open SEO — Sage works on WordPress,
            Shopify, Webflow, Next.js, Astro, and any HTML stack. Free 14-day trial on every plan.
          </p>
        </div>

        {/* Bottom row */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.04]">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} VirtuaLab Digital. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-emerald-300 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-emerald-300 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-emerald-300 transition-colors">Cookies</Link>
            <span className="hidden sm:inline text-muted-foreground/50">·</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-emerald" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
