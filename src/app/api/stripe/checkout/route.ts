/**
 * POST /api/stripe/checkout
 * Creates a Stripe Checkout Session for upgrading to a paid plan.
 *
 * Body: { plan: "pro"|"agency", interval: "month"|"year" }
 * Returns: { url: string } — redirect the browser to this URL
 */
import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession, STRIPE_PRICE_IDS } from "@/lib/billing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const plan = body.plan as "pro" | "agency";
    const interval = (body.interval as "month" | "year") || "month";

    if (!plan || !["pro", "agency"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan. Must be 'pro' or 'agency'." }, { status: 400 });
    }

    const priceId =
      plan === "pro"
        ? interval === "year"
          ? STRIPE_PRICE_IDS.pro_annual
          : STRIPE_PRICE_IDS.pro_monthly
        : interval === "year"
        ? STRIPE_PRICE_IDS.agency_annual
        : STRIPE_PRICE_IDS.agency_monthly;

    // In production, get userId from session. For demo, use first user.
    const { db } = await import("@/lib/db");
    const user = await db.user.findFirst({ orderBy: { createdAt: "asc" } });
    if (!user) {
      return NextResponse.json({ error: "No user found. Sign in first." }, { status: 401 });
    }

    const appUrl = process.env.APP_URL || "http://localhost:3000";
    const { url } = await createCheckoutSession({
      userId: user.id,
      userEmail: user.email,
      priceId,
      successUrl: `${appUrl}/?view=app&view=billing&status=success`,
      cancelUrl: `${appUrl}/?view=app&view=billing&status=canceled`,
    });

    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
