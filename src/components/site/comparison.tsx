"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Row {
  category: string;
  feature: string;
  sage: string | boolean;
  yoast: string | boolean;
  rankmath: string | boolean;
  ahrefs: string | boolean;
}

const rows: Row[] = [
  {
    category: "AI capabilities",
    feature: "AI content generator",
    sage: "Site-grounded",
    yoast: "Basic",
    rankmath: "Basic",
    ahrefs: false,
  },
  {
    category: "AI capabilities",
    feature: "AI schema markup generator",
    sage: "30+ types",
    yoast: false,
    rankmath: "Limited",
    ahrefs: false,
  },
  {
    category: "AI capabilities",
    feature: "AI internal linking",
    sage: "Context-aware",
    yoast: false,
    rankmath: "Link Genius",
    ahrefs: false,
  },
  {
    category: "AI Visibility",
    feature: "GEO / AI-engine citation tracking",
    sage: "5 engines",
    yoast: "Beta",
    rankmath: "Beta",
    ahrefs: false,
  },
  {
    category: "AI Visibility",
    feature: "llms.txt auto-generation",
    sage: true,
    yoast: "Roadmap",
    rankmath: "Beta",
    ahrefs: false,
  },
  {
    category: "AI Visibility",
    feature: "NLWeb / schema aggregation",
    sage: true,
    yoast: "Beta",
    rankmath: false,
    ahrefs: false,
  },
  {
    category: "Platform",
    feature: "Works on any CMS / stack",
    sage: true,
    yoast: "WordPress only",
    rankmath: "WordPress only",
    ahrefs: true,
  },
  {
    category: "Platform",
    feature: "MCP server for AI agents",
    sage: "28 tools",
    yoast: "Abilities API",
    rankmath: "OAuth MCP",
    ahrefs: false,
  },
  {
    category: "Platform",
    feature: "REST API + webhooks",
    sage: true,
    yoast: false,
    rankmath: false,
    ahrefs: "Limited",
  },
  {
    category: "Rank tracking",
    feature: "Daily refresh (all plans)",
    sage: true,
    yoast: "Weekly",
    rankmath: "Weekly",
    ahrefs: "Daily (Pro+)",
  },
  {
    category: "Rank tracking",
    feature: "Local + map pack tracking",
    sage: true,
    yoast: "Add-on",
    rankmath: true,
    ahrefs: true,
  },
  {
    category: "Audits",
    feature: "Continuous audit (24h refresh)",
    sage: "358 checks",
    yoast: "On-demand",
    rankmath: "On-demand",
    ahrefs: "On-demand",
  },
  {
    category: "Audits",
    feature: "Auto-fix pull requests",
    sage: true,
    yoast: false,
    rankmath: false,
    ahrefs: false,
  },
  {
    category: "Pricing",
    feature: "Free tier",
    sage: "1 site · 50 KWs",
    yoast: false,
    rankmath: "1 site",
    ahrefs: false,
  },
  {
    category: "Pricing",
    feature: "Starting paid plan",
    sage: "$29/mo",
    yoast: "$99/yr",
    rankmath: "$79/yr",
    ahrefs: "$129/mo",
  },
];

function renderCell(value: string | boolean) {
  if (value === true) return <Check className="h-4 w-4 text-emerald-400 mx-auto" />;
  if (value === false) return <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />;
  return <span className="text-xs text-muted-foreground">{value}</span>;
}

export function Comparison() {
  const [category, setCategory] = React.useState<string>("All");
  const categories = ["All", ...Array.from(new Set(rows.map((r) => r.category)))];
  const filtered = category === "All" ? rows : rows.filter((r) => r.category === category);

  return (
    <section
      id="compare"
      className="relative py-20 lg:py-28"
      aria-labelledby="compare-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-[11px] font-medium text-emerald-300 uppercase tracking-wider">
            Compare
          </div>
          <h2
            id="compare-heading"
            className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground text-balance"
          >
            Sage vs the old guard
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-pretty">
            Yoast and Rank Math are great WordPress plugins. Ahrefs is a great backlink database.
            Sage is the only platform built AI-native from day one — and the only one tracking your
            visibility inside AI engines.
          </p>
        </div>

        {/* Category filter */}
        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                category === c
                  ? "bg-emerald-500 text-emerald-950 border-emerald-500"
                  : "border-white/[0.08] bg-white/[0.02] text-muted-foreground hover:text-foreground hover:border-white/[0.15]"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Table */}
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6 rounded-2xl border border-white/[0.08] overflow-hidden glass"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left text-xs font-semibold text-foreground px-5 py-4 sticky left-0 bg-background/80 backdrop-blur-sm">
                    Capability
                  </th>
                  <th className="text-center text-xs font-semibold px-5 py-4 bg-emerald-500/[0.06] border-x border-emerald-500/20">
                    <div className="inline-flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Sage
                    </div>
                  </th>
                  <th className="text-center text-xs font-semibold text-muted-foreground px-5 py-4">Yoast</th>
                  <th className="text-center text-xs font-semibold text-muted-foreground px-5 py-4">Rank Math</th>
                  <th className="text-center text-xs font-semibold text-muted-foreground px-5 py-4">Ahrefs</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.01] transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="text-sm font-medium text-foreground">{row.feature}</div>
                      {category === "All" && (
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mt-0.5">
                          {row.category}
                        </div>
                      )}
                    </td>
                    <td className="text-center px-5 py-3 bg-emerald-500/[0.04] border-x border-emerald-500/10">
                      {renderCell(row.sage)}
                    </td>
                    <td className="text-center px-5 py-3">{renderCell(row.yoast)}</td>
                    <td className="text-center px-5 py-3">{renderCell(row.rankmath)}</td>
                    <td className="text-center px-5 py-3">{renderCell(row.ahrefs)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <p className="mt-4 text-xs text-muted-foreground">
          <Minus className="inline h-3 w-3 mr-1" />
          Feature data verified against official docs as of Sep 2026. Pricing reflects vendor-published
          entry plans. Sage includes unlimited AI content generation on all paid tiers.
        </p>
      </div>
    </section>
  );
}
