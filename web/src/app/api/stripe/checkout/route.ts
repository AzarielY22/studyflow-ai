import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { getStripe, getPriceIdForPlan } from "@/lib/stripe";

async function resolveStripeCustomer(
  stripe: ReturnType<typeof getStripe>,
  user: { id: string; email: string; name: string | null; stripeCustomerId: string | null }
): Promise<string> {
  if (user.stripeCustomerId) {
    try {
      const customer = await stripe.customers.retrieve(user.stripeCustomerId);
      if (!("deleted" in customer && customer.deleted)) {
        return user.stripeCustomerId;
      }
    } catch {
      // Test-mode customer IDs break when switching to live keys.
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        stripePriceId: null,
      },
    });
  }

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name ?? undefined,
    metadata: { userId: user.id },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

function stripeErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    return String(err.message);
  }
  return "Stripe checkout failed";
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireAuth(req);
  if (error) return error;

  const { plan } = await req.json();
  if (!plan || !["PRO", "PREMIUM"].includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session!.user!.id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const stripe = getStripe();

  let priceId: string | null;
  try {
    priceId = await getPriceIdForPlan(plan as "PRO" | "PREMIUM");
  } catch (err) {
    return NextResponse.json(
      {
        error:
          "Could not load Stripe prices. Use live product IDs with live keys (test product IDs only work with test keys).",
        details: stripeErrorMessage(err),
      },
      { status: 500 }
    );
  }

  if (!priceId) {
    return NextResponse.json(
      {
        error:
          "Stripe product/price not configured. Add live STRIPE_PRO_PRODUCT_ID and STRIPE_PREMIUM_PRODUCT_ID in Vercel.",
      },
      { status: 500 }
    );
  }

  try {
    const customerId = await resolveStripeCustomer(stripe, user);

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: { userId: user.id, plan, priceId },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    return NextResponse.json(
      { error: stripeErrorMessage(err) },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { session, error } = await requireAuth(req);
  if (error) return error;

  const user = await prisma.user.findUnique({ where: { id: session!.user!.id } });
  if (!user?.stripeCustomerId) {
    return NextResponse.json({ url: null });
  }

  const stripe = getStripe();
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
  });

  return NextResponse.json({ url: portalSession.url });
}
