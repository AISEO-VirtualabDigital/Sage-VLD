/**
 * GET /api/mcp/tools
 * REST list of all 28 Sage MCP tools — grouped by category for easy browsing.
 */
import { NextResponse } from "next/server";
import { listToolMetadata, listToolsByCategory, tools } from "@/lib/mcp/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    server: "sage-mcp-server",
    version: "2.0.0-phase2",
    toolCount: tools.length,
    readOnlyCount: tools.filter((t) => t.readOnly).length,
    writeCount: tools.filter((t) => !t.readOnly).length,
    auth: {
      read: "No auth required (demo mode returns first user's data)",
      write: "Authorization: Bearer sage_live_... (required for mutative tools)",
      demoKey: "sage_live_demo_key_0000000000000000",
    },
    byCategory: listToolsByCategory(),
    tools: listToolMetadata(),
    usage: {
      restCall: "GET /api/mcp/<tool-name>?arg1=val1&arg2=val2",
      restCallPost: "POST /api/mcp/<tool-name>  body: {\"arg1\":\"val1\"}",
      jsonrpc: 'POST /api/mcp  body: {"jsonrpc":"2.0","method":"tools/call","params":{"name":"<tool>","arguments":{}},"id":1}',
      authHeader: 'curl -H "Authorization: Bearer sage_live_demo_key_0000000000000000" ...',
    },
  });
}
