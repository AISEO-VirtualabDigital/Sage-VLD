/**
 * Sage MCP Server — Shared Types
 */

export type JsonRpcRequest = {
  jsonrpc: "2.0";
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown> | unknown[];
};

export type JsonRpcResponse = {
  jsonrpc: "2.0";
  id?: string | number | null;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
};

export type ToolContext = {
  userId: string; // always resolved (demo user in read mode without token)
  apiKey?: string;
  demo: boolean; // true when running without explicit auth
  requestId: string;
};

export type JsonSchemaObject = {
  type: "object";
  properties: Record<string, unknown>;
  required?: string[];
  additionalProperties?: boolean;
};

export type ToolDef = {
  name: string;
  description: string;
  inputSchema: JsonSchemaObject;
  outputSchema?: Record<string, unknown>;
  /** true = safe to run without auth (Phase 1 read tools). false = mutative, requires Bearer token. */
  readOnly: boolean;
  /** Optional category label for documentation grouping */
  category: string;
  handler: (args: Record<string, unknown>, ctx: ToolContext) => Promise<unknown>;
};

export function makeJsonRpcError(
  id: string | number | null | undefined,
  code: number,
  message: string,
  data?: unknown
): JsonRpcResponse {
  return { jsonrpc: "2.0", id: id ?? null, error: { code, message, data } };
}

export function makeJsonRpcResult(
  id: string | number | null | undefined,
  result: unknown
): JsonRpcResponse {
  return { jsonrpc: "2.0", id: id ?? null, result };
}
