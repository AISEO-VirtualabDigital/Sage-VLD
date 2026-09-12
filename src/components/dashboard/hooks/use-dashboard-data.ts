/**
 * TanStack Query hooks for the Sage dashboard.
 * Each hook wraps an MCP tool call with caching + invalidation.
 */
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { callTool, type Site, type Keyword, type ContentDraft, type Change, type BrandBrain } from "../api";

// ─── Sites ──────────────────────────────────────────────────────────────────

export function useSites() {
  return useQuery({
    queryKey: ["sites"],
    queryFn: async () => {
      const r = await callTool<{ items: Site[] }>("sage.sites.list");
      return r.items;
    },
  });
}

// ─── Keywords ───────────────────────────────────────────────────────────────

export function useKeywords(siteId: string | null) {
  return useQuery({
    queryKey: ["keywords", siteId],
    queryFn: async () => {
      if (!siteId) return [];
      const r = await callTool<{ items: Keyword[] }>("sage.keywords.list", { siteId, limit: 200 });
      return r.items;
    },
    enabled: !!siteId,
  });
}

export function useAddKeywords() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { siteId: string; keywords: Array<{ term: string; intent?: string }> }) =>
      callTool("sage.keywords.add", vars),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["keywords"] }),
  });
}

// ─── Rankings ───────────────────────────────────────────────────────────────

export function useRankings(keywordId: string | null, days = 30) {
  return useQuery({
    queryKey: ["rankings", keywordId, days],
    queryFn: async () => {
      if (!keywordId) return null;
      return callTool("sage.rankings.get", { keywordId, days });
    },
    enabled: !!keywordId,
  });
}

export function useRefreshRankings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { siteId: string; keywordId?: string }) =>
      callTool("sage.rankings.refresh", vars),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rankings"] });
      qc.invalidateQueries({ queryKey: ["keywords"] });
    },
  });
}

// ─── Citations ──────────────────────────────────────────────────────────────

export function useCitations(siteId: string | null, days = 30) {
  return useQuery({
    queryKey: ["citations", siteId, days],
    queryFn: async () => {
      if (!siteId) return null;
      return callTool("sage.citations.get", { siteId, days });
    },
    enabled: !!siteId,
  });
}

export function useBattlecards(siteId: string | null, days = 30) {
  return useQuery({
    queryKey: ["battlecards", siteId, days],
    queryFn: async () => {
      if (!siteId) return null;
      return callTool("sage.citations.battlecards", { siteId, days });
    },
    enabled: !!siteId,
  });
}

// ─── Audits ─────────────────────────────────────────────────────────────────

export function useLatestAudit(siteId: string | null) {
  return useQuery({
    queryKey: ["audit-latest", siteId],
    queryFn: async () => {
      if (!siteId) return null;
      return callTool("sage.audits.latest", { siteId });
    },
    enabled: !!siteId,
  });
}

export function useRunAudit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { siteId: string }) => callTool("sage.audits.run", vars),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["audit-latest"] }),
  });
}

// ─── Content ────────────────────────────────────────────────────────────────

export function useContentDrafts(siteId: string | null) {
  return useQuery({
    queryKey: ["content", siteId],
    queryFn: async () => {
      if (!siteId) return [];
      const r = await callTool<{ items: ContentDraft[] }>("sage.content.list", { siteId, limit: 100 });
      return r.items;
    },
    enabled: !!siteId,
  });
}

export function useGenerateContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      type: "homepage" | "services" | "blog";
      siteId: string;
      targetKeyword: string;
      serviceName?: string;
      title?: string;
      location?: string;
    }) => {
      const toolName =
        vars.type === "homepage"
          ? "sage.content.generate.homepage"
          : vars.type === "services"
          ? "sage.content.generate.services"
          : "sage.content.generate.blog";
      const { type: _type, ...args } = vars;
      return callTool(toolName, args);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["content"] }),
  });
}

// ─── Changes (Version Control) ──────────────────────────────────────────────

export function useChanges(siteId: string | null) {
  return useQuery({
    queryKey: ["changes", siteId],
    queryFn: async () => {
      if (!siteId) return [];
      const r = await callTool<{ items: Change[] }>("sage.changes.list", { siteId, limit: 100 });
      return r.items;
    },
    enabled: !!siteId,
  });
}

export function useRollback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { changeId: string; reason?: string }) =>
      callTool("sage.changes.rollback", vars),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["changes"] }),
  });
}

export function useRecordChange() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      siteId: string;
      url: string;
      field: string;
      before?: string;
      after: string;
      impactRankingDelta?: number;
      impactTrafficDelta?: number;
    }) => callTool("sage.changes.record", vars),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["changes"] }),
  });
}

// ─── Brand Brain ────────────────────────────────────────────────────────────

export function useBrandBrain(siteId: string | null) {
  return useQuery({
    queryKey: ["brandbrain", siteId],
    queryFn: async () => {
      if (!siteId) return null;
      const r = await callTool<{ brandBrain: BrandBrain | null }>("sage.brandbrain.get", {
        siteId,
        includeFiles: true,
      });
      return r.brandBrain;
    },
    enabled: !!siteId,
  });
}

export function useUpdateBrandBrain() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      siteId: string;
      voiceDoc?: string;
      styleGuide?: string;
      bannedPhrases?: string[];
      glossary?: Record<string, string>;
    }) => callTool("sage.brandbrain.update", vars),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["brandbrain"] }),
  });
}

export function useAddBrandBrainFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      siteId: string;
      filename: string;
      content: string;
      type: string;
    }) => callTool("sage.brandbrain.files.add", vars),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["brandbrain"] }),
  });
}

// ─── Analytics ──────────────────────────────────────────────────────────────

export function useGsc(siteId: string | null, days = 28) {
  return useQuery({
    queryKey: ["gsc", siteId, days],
    queryFn: async () => {
      if (!siteId) return null;
      return callTool("sage.analytics.gsc", { siteId, days, limit: 50 });
    },
    enabled: !!siteId,
  });
}

export function useDecay(siteId: string | null, days = 90) {
  return useQuery({
    queryKey: ["decay", siteId, days],
    queryFn: async () => {
      if (!siteId) return null;
      return callTool("sage.analytics.decay", { siteId, days, threshold: 20 });
    },
    enabled: !!siteId,
  });
}

// ─── Internal Links ─────────────────────────────────────────────────────────

export function useInternalLinks(siteId: string | null) {
  return useQuery({
    queryKey: ["internal-links", siteId],
    queryFn: async () => {
      if (!siteId) return null;
      return callTool("sage.links.internal", { siteId, limit: 20 });
    },
    enabled: !!siteId,
  });
}

// ─── llms.txt ───────────────────────────────────────────────────────────────

export function useLlmsTxt(siteId: string | null) {
  return useQuery({
    queryKey: ["llms-txt", siteId],
    queryFn: async () => {
      if (!siteId) return null;
      return callTool("sage.llmstxt.generate", { siteId });
    },
    enabled: !!siteId,
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// Manual Tools (Phase 4)
// ═══════════════════════════════════════════════════════════════════════════

// ─── Meta Editor ────────────────────────────────────────────────────────────

export function useMetaList(siteId: string | null) {
  return useQuery({
    queryKey: ["meta-list", siteId],
    queryFn: async () => {
      if (!siteId) return [];
      const r = await callTool<{ items: Array<Record<string, unknown>> }>("sage.meta.list", { siteId });
      return r.items;
    },
    enabled: !!siteId,
  });
}

export function useMetaEdit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: Record<string, unknown>) => callTool("sage.meta.edit", vars),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["meta-list"] }),
  });
}

// ─── Redirects ──────────────────────────────────────────────────────────────

export function useRedirectList(siteId: string | null) {
  return useQuery({
    queryKey: ["redirect-list", siteId],
    queryFn: async () => {
      if (!siteId) return [];
      const r = await callTool<{ items: Array<Record<string, unknown>> }>("sage.redirect.list", { siteId });
      return r.items;
    },
    enabled: !!siteId,
  });
}

export function useRedirectCreate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: Record<string, unknown>) => callTool("sage.redirect.create", vars),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["redirect-list"] }),
  });
}

export function useRedirectDelete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: Record<string, unknown>) => callTool("sage.redirect.delete", vars),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["redirect-list"] }),
  });
}

export function useMonitor404(siteId: string | null) {
  return useQuery({
    queryKey: ["monitor-404", siteId],
    queryFn: async () => {
      if (!siteId) return [];
      const r = await callTool<{ items: Array<Record<string, unknown>> }>("sage.monitor.404", { siteId });
      return r.items;
    },
    enabled: !!siteId,
  });
}

// ─── Bot Blocker ────────────────────────────────────────────────────────────

export function useBotBlockerList(siteId: string | null) {
  return useQuery({
    queryKey: ["bot-blocker", siteId],
    queryFn: async () => {
      if (!siteId) return null;
      return callTool("sage.bot.blocker.list", { siteId });
    },
    enabled: !!siteId,
  });
}

export function useBotBlockerSet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { siteId: string; botName: string; action: "block" | "allow" }) =>
      callTool("sage.bot.blocker.set", vars),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bot-blocker"] }),
  });
}
