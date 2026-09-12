/**
 * Sage MCP Server — JSON-RPC 2.0 entrypoint.
 *
 * POST /api/mcp
 *   Body: { jsonrpc: "2.0", method, params, id }
 *
 * Methods:
 *   - initialize         → server info + capabilities
 *   - tools/list         → array of tool metadata
 *   - tools/call         → execute a tool by name with args
 *   - ping               → { pong: true }
 *
 * Usage from Claude Desktop / Cursor / any MCP client:
 *   Configure HTTP transport → POST https://your-sage.app/api/mcp
 */
import { NextRequest, NextResponse } from "next/server";
import {
  type JsonRpcRequest,
  type JsonRpcResponse,
  type ToolContext,
  tools,
  getToolByName,
  listToolMetadata,
  makeJsonRpcError,
  makeJsonRpcResult,
} from "@/lib/mcp/tools";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SERVER_INFO = {
  name: "sage-mcp-server",
  version: "1.0.0-phase1",
  description:
    "Sage by VirtuaLab Digital — AI-Visibility-first, agent-native SEO platform. Phase 1 ships 5 read-only tools across sites, keywords, rankings, citations, and audits.",
  vendor: "VirtuaLab Digital",
  homepage: "https://sage.virtualab.digital",
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

  // Batch support
  if (Array.isArray(body)) {
    const results = await Promise.all(body.map((r) => handleSingle(r, req)));
    return NextResponse.json(results);
  }

  const result = await handleSingle(body, req);
  const status = result.error ? 400 : 200;
  return NextResponse.json(result, { status });
}

export async function GET(req: NextRequest) {
  // Friendly landing — points to /api/mcp/tools for the REST list
  const url = req.nextUrl.clone();
  url.pathname = "/api/mcp/tools";
  return NextResponse.json({
    server: SERVER_INFO,
    endpoints: {
      jsonrpc: "POST /api/mcp",
      toolsList: "GET /api/mcp/tools",
      callToolRest: "GET|POST /api/mcp/<tool-name>",
    },
    toolCount: tools.length,
    tools: tools.map((t) => t.name),
  });
}

async function handleSingle(req: JsonRpcRequest, httpReq: NextRequest): Promise<JsonRpcResponse> {
  const { id, method, params } = req;
  const ctx: ToolContext = {
    requestId: crypto.randomUUID(),
    // TODO: resolve userId from Authorization header / session cookie
    userId: undefined,
  };

  try {
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
        return makeJsonRpcResult(id, {
          tools: listToolMetadata(),
        });

      case "tools/call": {
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
        const args = p.arguments || {};
        const result = await tool.handler(args, ctx);
        return makeJsonRpcResult(id, {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
          structuredContent: result,
          isError: false,
        });
      }

      case "resources/list":
        return makeJsonRpcResult(id, { resources: [] });

      case "prompts/list":
        return makeJsonRpcResult(id, { prompts: [] });

      default:
        return makeJsonRpcError(id, -32601, `Method not found: '${method}'`, {
          supported: ["initialize", "ping", "tools/list", "tools/call", "resources/list", "prompts/list"],
        });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const stack = err instanceof Error ? err.stack : undefined;
    return makeJsonRpcError(id, -32603, `Internal error: ${message}`, { stack });
  }
}
