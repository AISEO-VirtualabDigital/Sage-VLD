/**
 * Sage MCP Server — Authentication & Authorization Layer
 *
 * Two auth modes:
 *   1. READ mode (default): public/BYOK. Resolves userId if a bearer token
 *      is present, but does not require one. Used by all read-only tools.
 *   2. WRITE mode: requires `Authorization: Bearer sage_live_...`. Validates
 *      against User.apiKey field. Mutative tools refuse to run without it.
 *
 * Site ownership:
 *   All tools that take a siteId verify the site belongs to the authenticated
 *   user. In demo mode (no auth + read tool), ownership is lenient — the first
 *   user's sites are returned. In write mode, ownership is strict.
 *
 * Plan-based gating (Lane 2):
 *   Each tool can declare a `requiredPlan` ("free"|"pro"|"agency"). The auth
 *   layer checks the user's plan before executing. Free users are blocked from
 *   Pro/Agency-only tools.
 */
import { NextRequest } from "next/server";
import type { PlanId, PLANS } from "@/lib/auth";

export type AuthResult =
  | { ok: true; userId: string; apiKey: string; demo: boolean; plan: PlanId }
  | { ok: false; error: string; code: number };

export type AuthMode = "read" | "write";

export async function authenticate(
  req: NextRequest,
  mode: AuthMode
): Promise<AuthResult> {
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
  const token = parseBearer(authHeader);

  // No token + read mode → demo user (first user in DB)
  if (!token) {
    if (mode === "write") {
      return {
        ok: false,
        error:
          "Write actions require authentication. Pass `Authorization: Bearer sage_live_...` header.",
        code: 401,
      };
    }
    // Read mode: resolve demo user (first user in DB)
    const { db } = await import("@/lib/db");
    const demoUser = await db.user.findFirst({ orderBy: { createdAt: "asc" } });
    if (!demoUser) {
      return { ok: false, error: "No users in database. Run `bun run db:seed` first.", code: 500 };
    }
    return { ok: true, userId: demoUser.id, apiKey: demoUser.apiKey, demo: true, plan: (demoUser.plan as PlanId) || "free" };
  }

  // Token present — validate
  if (!token.startsWith("sage_live_")) {
    return {
      ok: false,
      error: `Invalid API key format. Expected 'sage_live_...' got '${token.slice(0, 16)}...'`,
      code: 401,
    };
  }

  const { db } = await import("@/lib/db");
  const user = await db.user.findUnique({ where: { apiKey: token } });
  if (!user) {
    return { ok: false, error: "API key not recognized.", code: 401 };
  }

  return {
    ok: true,
    userId: user.id,
    apiKey: user.apiKey,
    demo: false,
    plan: (user.plan as PlanId) || "free",
  };
}

/**
 * Verify that a site belongs to the authenticated user.
 */
export async function requireSiteOwnership(
  userId: string,
  siteId: string
): Promise<{ ok: true } | { ok: false; error: string; code: number }> {
  const { db } = await import("@/lib/db");
  const site = await db.site.findUnique({ where: { id: siteId }, select: { userId: true } });
  if (!site) {
    return { ok: false, error: `Site '${siteId}' not found.`, code: 404 };
  }
  if (site.userId !== userId) {
    return {
      ok: false,
      error: `Forbidden: site '${siteId}' does not belong to the authenticated user.`,
      code: 403,
    };
  }
  return { ok: true };
}

/**
 * Check if the user's plan meets the required plan level.
 * Plan hierarchy: free < pro < agency
 */
export function hasPlanAccess(userPlan: PlanId, requiredPlan: PlanId): boolean {
  const hierarchy: Record<PlanId, number> = { free: 0, pro: 1, agency: 2 };
  return hierarchy[userPlan] >= hierarchy[requiredPlan];
}

function parseBearer(header: string | null): string | null {
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}
