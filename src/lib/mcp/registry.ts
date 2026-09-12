/**
 * Sage MCP Server — Tool Registry
 *
 * Combines read + write tools and exposes helpers used by API routes.
 */
import type { ToolDef, ToolContext, JsonRpcResponse } from "./types";
import { makeJsonRpcError, makeJsonRpcResult } from "./types";
import { readTools } from "./tools-read";
import { writeTools } from "./tools-write";
import { manualTools } from "./tools-manual";
import { backlinkTools } from "./tools-backlinks";
import { keywordResearchTools } from "./tools-keywords";
import { competitorTools } from "./tools-competitors";
import { serpFeatureTools } from "./tools-serp-features";

export const tools: ToolDef[] = [
  ...readTools,
  ...writeTools,
  ...manualTools,
  ...backlinkTools,
  ...keywordResearchTools,
  ...competitorTools,
  ...serpFeatureTools,
];

export function getToolByName(name: string): ToolDef | undefined {
  return tools.find((t) => t.name === name);
}

export function listToolMetadata() {
  return tools.map((t) => ({
    name: t.name,
    description: t.description,
    inputSchema: t.inputSchema,
    readOnly: t.readOnly,
    category: t.category,
  }));
}

export function listToolsByCategory() {
  const groups: Record<string, ToolDef[]> = {};
  for (const t of tools) {
    if (!groups[t.category]) groups[t.category] = [];
    groups[t.category].push(t);
  }
  return Object.entries(groups).map(([category, items]) => ({
    category,
    count: items.length,
    tools: items.map((t) => ({
      name: t.name,
      description: t.description,
      readOnly: t.readOnly,
    })),
  }));
}

export { makeJsonRpcError, makeJsonRpcResult };
export type { ToolDef, ToolContext, JsonRpcResponse };
