/**
 * Sage — Stripe Billing Library
 *
 * Hybrid pricing model:
 *   1. Platform fee (subscription): Free $0 / Pro $49 / Agency $149 per month
 *   2. Wholesale data credits: pay-as-you-go at exact DataForSEO cost
 *
 * Subscription includes monthly credit allocation:
 *   Pro: $30 credits/mo · Agency: $100 credits/mo
 * Users can also BYOK to bypass credits entirely.
 *
 * Usage is tracked in CreditLedger — every MCP tool call that hits an external
 * API debits the user's creditsBalanceCents. When balance hits 0, tool calls
 * fail with a "credits exhausted" error (or fall back to BYOK if configured).
 */
import Stripe from "stripe";

export const STRIPE_PRICE_IDS = {
  // Replace with your actual Stripe Price IDs from the dashboard
  pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || "price_pro_monthly_placeholder",
  pro_annual: process.env.STRIPE_PRICE_PRO_ANNUAL || "price_pro_annual_placeholder",
  agency_monthly: process.env.STRIPE_PRICE_AGENCY_MONTHLY || "price_agency_monthly_placeholder",
  agency_annual: process.env.STRIPE_PRICE_AGENCY_ANNUAL || "price_agency_annual_placeholder",
} as const;

// Wholesale data costs (same as displayed on the pricing page)
export const WHOLESALE_RATES = {
  keyword_track_per_day_cents: 0.4, // $0.004
  serp_lookup_cents: 0.2, // $0.002
  ai_citation_check_cents: 0.8, // $0.008 per engine
  audit_page_cents: 0.1, // $0.001
  content_gap_analysis_cents: 4, // $0.04
  ai_content_generate_cents: 2, // $0.02
  schema_validate_cents: 0.05, // $0.0005
  backlink_lookup_cents: 0.6, // $0.006
} as const;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not set");
  return new Stripe(key, {
    apiVersion: "2024-12-18.acacia",
    typescript: true,
  });
}

/**
 * Create or retrieve a Stripe Checkout Session for upgrading to a paid plan.
 */
export async function createCheckoutSession(params: {
  userId: string;
  userEmail: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ url: string }> {
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: params.userEmail,
    line_items: [{ price: params.priceId, quantity: 1 }],
    client_reference_id: params.userId,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      userId: params.userId,
    },
    subscription_data: {
      metadata: { userId: params.userId },
    },
    allow_promotion_codes: true,
    billing_address_collection: "auto",
  });

  return { url: session.url! };
}

/**
 * Create a billing portal session for managing an existing subscription
 * (upgrade/downgrade/cancel, update payment method, view invoices).
 */
export async function createPortalSession(params: {
  stripeCustomerId: string;
  returnUrl: string;
}): Promise<{ url: string }> {
  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: params.stripeCustomerId,
    return_url: params.returnUrl,
  });
  return { url: session.url };
}

/**
 * Handle Stripe webhook events.
 * Called from /api/stripe/webhook — verifies signature + processes events.
 */
export async function handleStripeWebhook(event: Stripe.Event): Promise<void> {
  const { db } = await import("@/lib/db");

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id || session.metadata?.userId;
      if (!userId) break;

      // Retrieve the subscription to get the customer + price
      const stripe = getStripe();
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

      await db.user.update({
        where: { id: userId },
        data: {
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscription.id,
          subscriptionStatus: subscription.status,
          plan: subscription.status === "trialing" ? "free" : priceIdToPlan(subscription.items.data[0].price.id),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });

      // Allocate monthly credits on subscription start
      const plan = priceIdToPlan(subscription.items.data[0].price.id);
      const credits = plan === "pro" ? 3000 : plan === "agency" ? 10000 : 0;
      if (credits > 0) {
        await allocateCredits(userId, credits, `Monthly ${plan} credit allocation`);
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      if (!userId) break;

      const plan = subscription.status === "active" || subscription.status === "trialing"
        ? priceIdToPlan(subscription.items.data[0].price.id)
        : "free";

      await db.user.update({
        where: { id: userId },
        data: {
          subscriptionStatus: subscription.status,
          plan,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          ...(subscription.status === "canceled" && {
            stripeSubscriptionId: null,
            plan: "free",
          }),
        },
      });
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const userId = invoice.metadata?.userId;
      if (!userId || !invoice.customer) break;

      await db.invoice.create({
        data: {
          userId,
          stripeInvoiceId: invoice.id,
          number: invoice.number,
          amountDueCents: invoice.amount_due,
          amountPaidCents: invoice.amount_paid,
          currency: invoice.currency,
          status: invoice.status || "open",
          periodStart: new Date(invoice.period_start * 1000),
          periodEnd: new Date(invoice.period_end * 1000),
          paidAt: invoice.status_transitions.paid_at ? new Date(invoice.status_transitions.paid_at * 1000) : null,
          pdfUrl: invoice.invoice_pdf,
          hostedUrl: invoice.hosted_invoice_url,
        },
      });

      // Re-allocate monthly credits when subscription renews
      if (invoice.billing_reason === "subscription_cycle") {
        const user = await db.user.findUnique({ where: { id: userId }, select: { plan: true } });
        if (user) {
          const credits = user.plan === "pro" ? 3000 : user.plan === "agency" ? 10000 : 0;
          if (credits > 0) {
            await allocateCredits(userId, credits, `Monthly ${user.plan} credit renewal (invoice ${invoice.number})`);
          }
        }
      }
      break;
    }

    default:
      // Unhandled event type — log but don't error
      console.log(`Unhandled Stripe event: ${event.type}`);
  }
}

/**
 * Allocate credits to a user's balance + record in the ledger.
 */
export async function allocateCredits(
  userId: string,
  amountCents: number,
  reason: string,
  stripeInvoiceId?: string
): Promise<void> {
  const { db } = await import("@/lib/db");
  const user = await db.user.findUnique({ where: { id: userId }, select: { creditsBalanceCents: true } });
  if (!user) throw new Error("User not found");

  const balanceAfter = user.creditsBalanceCents + amountCents;
  await db.$transaction([
    db.user.update({
      where: { id: userId },
      data: { creditsBalanceCents: balanceAfter },
    }),
    db.creditLedger.create({
      data: {
        userId,
        type: "credit",
        amountCents: amountCents,
        balanceAfterCents: balanceAfter,
        reason: "stripe_payment",
        description: reason,
        stripeInvoiceId,
      },
    }),
  ]);
}

/**
 * Debit credits from a user's balance. Called by MCP tools before hitting
 * external APIs. Returns false if insufficient credits (caller should fall
 * back to BYOK or return an error).
 */
export async function debitCredits(
  userId: string,
  amountCents: number,
  reason: string,
  metadata?: Record<string, unknown>
): Promise<{ success: boolean; balanceAfterCents: number }> {
  const { db } = await import("@/lib/db");
  const user = await db.user.findUnique({ where: { id: userId }, select: { creditsBalanceCents: true } });
  if (!user) throw new Error("User not found");

  if (user.creditsBalanceCents < amountCents) {
    return { success: false, balanceAfterCents: user.creditsBalanceCents };
  }

  const balanceAfter = user.creditsBalanceCents - amountCents;
  await db.$transaction([
    db.user.update({
      where: { id: userId },
      data: { creditsBalanceCents: balanceAfter },
    }),
    db.creditLedger.create({
      data: {
        userId,
        type: "debit",
        amountCents: -amountCents,
        balanceAfterCents: balanceAfter,
        reason,
        description: `${reason} — ${amountCents} cents`,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    }),
  ]);

  return { success: true, balanceAfterCents: balanceAfter };
}

function priceIdToPlan(priceId: string): "free" | "pro" | "agency" {
  if (priceId === STRIPE_PRICE_IDS.pro_monthly || priceId === STRIPE_PRICE_IDS.pro_annual) return "pro";
  if (priceId === STRIPE_PRICE_IDS.agency_monthly || priceId === STRIPE_PRICE_IDS.agency_annual) return "agency";
  return "free";
}
