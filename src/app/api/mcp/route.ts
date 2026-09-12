/**
 * Sage MCP Server — JSON-RPC 2.0 entrypoint
 *
 * POST /api/mcp
 *   Body: { jsonrpc: "2.0", method, params, id }
 *
 * Methods:
 *   - initialize         → server info + capabilities
 *   - tools/list         → array of all 28 tools grouped by category
 *   - tools/call         → execute a tool by name with args
 *   - ping               → { pong: true }
 *
 * Auth:
 *   - Read tools (readOnly: true) run in demo mode without auth
 *   - Write tools (readOnly: false) require `Authorization: Bearer sage_live_...`
 *   - Site ownership is enforced inside each tool handler via ctx.userId
 */
import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/lib/mcp/auth";
import {
  type JsonRpcRequest,
  type JsonRpcResponse,
  type ToolContext,
  tools,
  getToolByName,
  listToolMetadata,
  listToolsByCategory,
  makeJsonRpcError,
  makeJsonRpcResult,
} from "@/lib/mcp/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SERVER_INFO = {
  name: "sage-mcp-server",
  version: "2.0.0-phase2",
  description:
    "Sage by VirtuaLab Digital — AI-Visibility-first, agent-native SEO platform. 28 tools across 8 categories: sites, keywords, citations, content, audits, version control, brand brain, analytics.",
  vendor: "VirtuaLab Digital",
  homepage: "https://sage.virtualab.digital",
  toolCount: tools.length,
  auth: {
    readMode: "public/BYOK — no auth required for read-only tools",
    writeMode: "Bearer sage_live_... — required for all mutative tools",
    header: "Authorization: Bearer sage_live_<your_api_key>",
  },
};

export async function POST(req: NextRequest) {
  let body: JsonRpcRequest | JsonRpcRequest[];
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      makeJsonRpcError(null, -32700, "Parse error: invalid JSON"),
      { status: 400 }
    );
  }

  if (Array.isArray(body)) {
    const results = await Promise.all(body.map((r) => handleSingle(r, req)));
    return NextResponse.json(results);
  }

  const result = await handleSingle(body, req);
  const status = result.error ? (result.error?.code === 401 ? 401 : 400) : 200;
  return NextResponse.json(result, { status });
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    server: SERVER_INFO,
    endpoints: {
      jsonrpc: "POST /api/mcp",
      toolsList: "GET /api/mcp/tools",
      callToolRest: "GET|POST /api/mcp/<tool-name>",
    },
    toolCount: tools.length,
    toolsByCategory: listToolsByCategory(),
    demo: {
      apiKey: "sage_live_demo_key_0000000000000000",
      note: "Use this key in Authorization header for write actions against the demo database.",
    },
  });
}

async function handleSingle(req: JsonRpcRequest, httpReq: NextRequest): Promise<JsonRpcResponse> {
  const { id, method, params } = req;

  // initialize + tools/list + ping don't require auth
  if (method === "initialize" || method === "ping" || method === "tools/list" || method === "resources/list" || method === "prompts/list") {
    return handlePublicMethod(req);
  }

  // tools/call requires auth resolution — read or write depending on the tool
  if (method === "tools/call") {
    return handleToolsCall(req, httpReq);
  }

  return makeJsonRpcError(id, -32601, `Method not found: '${method}'`, {
    supported: ["initialize", "ping", "tools/list", "tools/call", "resources/list", "prompts/list"],
  });
}

async function handlePublicMethod(req: JsonRpcRequest): Promise<JsonRpcResponse> {
  const { id, method } = req;
  switch (method) {
    case "initialize":
      return makeJsonRpcResult(id, {
        protocolVersion: "2024-11-05",
        serverInfo: SERVER_INFO,
        capabilities: {
          tools: { listChanged: false },
          resources: { listChanged: false, subscribe: false },
          prompts: { listChanged: false },
          logging: {},
        },
      });
    case "ping":
      return makeJsonRpcResult(id, { pong: true, timestamp: new Date().toISOString() });
    case "tools/list":
      return makeJsonRpcResult(id, { tools: listToolMetadata() });
    case "resources/list":
      return makeJsonRpcResult(id, { resources: [] });
    case "prompts/list":
      return makeJsonRpcResult(id, { prompts: [] });
    default:
      return makeJsonRpcError(id, -32601, `Method not found: '${method}'`);
  }
}

async function handleToolsCall(req: JsonRpcRequest, httpReq: NextRequest): Promise<JsonRpcResponse> {
  const { id, params } = req;
  const p = (params || {}) as { name?: string; arguments?: Record<string, unknown> };
  const name = p.name;
  if (!name) {
    return makeJsonRpcError(id, -32602, "Invalid params: 'name' required for tools/call");
  }
  const tool = getToolByName(name);
  if (!tool) {
    return makeJsonRpcError(id, -32601, `Method not found: tool '${name}' does not exist`, {
      available: tools.map((t) => t.name),
    });
  }

  // Authenticate — write tools require bearer token, read tools allow demo mode
  const authMode = tool.readOnly ? "read" : "write";
  const auth = await authenticate(httpReq, authMode);
  if (!auth.ok) {
    return makeJsonRpcError(id, -32403, auth.error, { code: auth.code, tool: name, authMode });
  }

  const ctx: ToolContext = {
    userId: auth.userId,
    apiKey: auth.apiKey,
    demo: auth.demo,
    requestId: crypto.randomUUID(),
  };

  try {
    const args = p.arguments || {};
    const result = await tool.handler(args, ctx);
    return makeJsonRpcResult(id, {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result,
      isError: false,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const stack = err instanceof Error ? err.stack : undefined;
    return makeJsonRpcError(id, -32603, `Internal error: ${message}`, { stack, tool: name });
  }
}
