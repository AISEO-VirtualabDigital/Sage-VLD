/**
 * GET /api/mcp/tools
 * REST list of all Sage MCP tools — for easy curl inspection.
 */
import { NextResponse } from "next/server";
import { listToolMetadata, tools } from "@/lib/mcp/tools";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    server: "sage-mcp-server",
    version: "1.0.0-phase1",
    toolCount: tools.length,
    tools: listToolMetadata(),
    usage: {
      restCall: "GET /api/mcp/<tool-name>?arg1=val1&arg2=val2",
      restCallPost: "POST /api/mcp/<tool-name>  body: {\"arg1\":\"val1\"}",
      jsonrpc: 'POST /api/mcp  body: {"jsonrpc":"2.0","method":"tools/call","params":{"name":"<tool>","arguments":{}},"id":1}',
    },
  });
}
