/**
 * GET  /api/mcp/<tool-name>?args...    → call tool with query params as args
 * POST /api/mcp/<tool-name>            → call tool with JSON body as args
 *
 * Auth:
 *   - Read tools (readOnly: true): no auth required (demo mode)
 *   - Write tools (readOnly: false): requires Authorization: Bearer sage_live_...
 */
import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/lib/mcp/auth";
import { getToolByName, type ToolContext } from "@/lib/mcp/registry";

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

  // Auth gate
  const authMode = tool.readOnly ? "read" : "write";
  const auth = await authenticate(req, authMode);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error, tool: toolName, authMode }, { status: auth.code });
  }

  // Parse args from query
  const args: Record<string, unknown> = {};
  const sp = req.nextUrl.searchParams;
  for (const [k, v] of sp.entries()) {
    if (v === "true") args[k] = true;
    else if (v === "false") args[k] = false;
    else if (v === "null") args[k] = null;
    else if (/^-?\d+$/.test(v)) args[k] = Number(v);
    else args[k] = v;
  }

  // Special: for array-typed params (like keywords.add), parse JSON
  const arrayParams = (tool.inputSchema.properties as Record<string, { type?: string }>);
  for (const [k, def] of Object.entries(arrayParams)) {
    if (def.type === "array" && typeof args[k] === "string") {
      try { args[k] = JSON.parse(args[k] as string); } catch { /* leave as string */ }
    }
    if (def.type === "object" && typeof args[k] === "string") {
      try { args[k] = JSON.parse(args[k] as string); } catch { /* leave as string */ }
    }
  }

  const ctx: ToolContext = {
    userId: auth.userId,
    apiKey: auth.apiKey,
    demo: auth.demo,
    requestId: crypto.randomUUID(),
  };

  try {
    const result = await tool.handler(args, ctx);
    return NextResponse.json({ tool: tool.name, args, authMode: ctx.demo ? "demo" : "authenticated", result });
  } catch (err) {
    return NextResponse.json(
      { tool: tool.name, args, error: err instanceof Error ? err.message : "Unknown error" },
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

  // Auth gate
  const authMode = tool.readOnly ? "read" : "write";
  const auth = await authenticate(req, authMode);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error, tool: toolName, authMode }, { status: auth.code });
  }

  let args: Record<string, unknown> = {};
  try {
    args = await req.json();
  } catch {
    // Empty body is fine
  }

  const ctx: ToolContext = {
    userId: auth.userId,
    apiKey: auth.apiKey,
    demo: auth.demo,
    requestId: crypto.randomUUID(),
  };

  try {
    const result = await tool.handler(args, ctx);
    return NextResponse.json({ tool: tool.name, args, authMode: ctx.demo ? "demo" : "authenticated", result });
  } catch (err) {
    return NextResponse.json(
      { tool: tool.name, args, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
