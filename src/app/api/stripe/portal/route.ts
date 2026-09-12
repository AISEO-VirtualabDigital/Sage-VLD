/**
 * POST /api/stripe/portal
 * Creates a Stripe Billing Portal session for managing an existing subscription.
 *
 * Returns: { url: string } — redirect the browser to this URL
 */
import { NextRequest, NextResponse } from "next/server";
import { createPortalSession } from "@/lib/billing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // In production, get userId from session. For demo, use first user.
    const { db } = await import("@/lib/db");
    const user = await db.user.findFirst({ orderBy: { createdAt: "asc" } });
    if (!user || !user.stripeCustomerId) {
      return NextResponse.json(
        { error: "No active subscription found. Upgrade first." },
        { status: 400 }
      );
    }

    const appUrl = process.env.APP_URL || "http://localhost:3000";
    const { url } = await createPortalSession({
      stripeCustomerId: user.stripeCustomerId,
      returnUrl: `${appUrl}/?view=app&view=billing`,
    });

    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
