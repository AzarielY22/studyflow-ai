import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { getStripe, getPriceIdForPlan } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { session, error } = await requireAuth(req);
  if (error) return error;

  const { plan } = await req.json();
  if (!plan || !["PRO", "PREMIUM"].includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session!.user!.id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  let customerId = user.stripeCustomerId;
  const stripe = getStripe();
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const priceId = await getPriceIdForPlan(plan as "PRO" | "PREMIUM");
  if (!priceId) {
    return NextResponse.json(
      { error: "Stripe product/price not configured. Add STRIPE_PRO_PRODUCT_ID and STRIPE_PREMIUM_PRODUCT_ID to .env" },
      { status: 500 }
    );
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    metadata: { userId: user.id, plan },
  });

  return NextResponse.json({ url: checkoutSession.url });
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
