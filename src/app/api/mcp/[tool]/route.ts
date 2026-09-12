/**
 * GET  /api/mcp/<tool-name>?args...    → call tool with query params as args
 * POST /api/mcp/<tool-name>            → call tool with JSON body as args
 *
 * Example:
 *   curl /api/mcp/sage.sites.list
 *   curl '/api/mcp/sage.keywords.list?siteId=abc123'
 *   curl -X POST /api/mcp/sage.rankings.get -d '{"keywordId":"xyz","days":7}'
 */
import { NextRequest, NextResponse } from "next/server";
import { getToolByName, type ToolContext } from "@/lib/mcp/tools";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tool: string }> }
) {
  const { tool: toolName } = await params;
  const tool = getToolByName(toolName);
  if (!tool) {
    return NextResponse.json(
      { error: `Tool '${toolName}' not found`, hint: "GET /api/mcp/tools to list available tools" },
      { status: 404 }
    );
  }

  // Convert query params to args. Coerce numeric-looking strings to numbers.
  const args: Record<string, unknown> = {};
  const sp = req.nextUrl.searchParams;
  for (const [k, v] of sp.entries()) {
    if (v === "true") args[k] = true;
    else if (v === "false") args[k] = false;
    else if (v === "null") args[k] = null;
    else if (/^-?\d+$/.test(v)) args[k] = Number(v);
    else args[k] = v;
  }

  const ctx: ToolContext = { requestId: crypto.randomUUID() };
  try {
    const result = await tool.handler(args, ctx);
    return NextResponse.json({
      tool: tool.name,
      args,
      result,
    });
  } catch (err) {
    return NextResponse.json(
      {
        tool: tool.name,
        args,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tool: string }> }
) {
  const { tool: toolName } = await params;
  const tool = getToolByName(toolName);
  if (!tool) {
    return NextResponse.json(
      { error: `Tool '${toolName}' not found`, hint: "GET /api/mcp/tools to list available tools" },
      { status: 404 }
    );
  }

  let args: Record<string, unknown> = {};
  try {
    args = await req.json();
  } catch {
    // Empty body is fine — call with no args
  }

  const ctx: ToolContext = { requestId: crypto.randomUUID() };
  try {
    const result = await tool.handler(args, ctx);
    return NextResponse.json({
      tool: tool.name,
      args,
      result,
    });
  } catch (err) {
    return NextResponse.json(
      {
        tool: tool.name,
        args,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
