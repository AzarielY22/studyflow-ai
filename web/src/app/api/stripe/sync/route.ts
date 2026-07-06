import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { getStripe, getPriceIdForPlan } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { session, error } = await requireAuth(req);
  if (error) return error;

  const user = await prisma.user.findUnique({
    where: { id: session!.user!.id },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (!user.stripeCustomerId) {
    return NextResponse.json({ plan: user.plan, synced: false });
  }

  const stripe = getStripe();
  const subscriptions = await stripe.subscriptions.list({
    customer: user.stripeCustomerId,
    status: "active",
    limit: 1,
  });

  if (!subscriptions.data.length) {
    return NextResponse.json({ plan: user.plan, synced: false });
  }

  const subscription = subscriptions.data[0];
  const priceId = subscription.items.data[0]?.price.id;
  const [proPriceId, premiumPriceId] = await Promise.all([
    getPriceIdForPlan("PRO"),
    getPriceIdForPlan("PREMIUM"),
  ]);

  let plan: "PRO" | "PREMIUM" = "PRO";
  if (priceId && premiumPriceId && priceId === premiumPriceId) {
    plan = "PREMIUM";
  } else if (priceId && proPriceId && priceId === proPriceId) {
    plan = "PRO";
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      plan,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId ?? null,
    },
    select: { plan: true, scansUsed: true },
  });

  return NextResponse.json({ plan: updated.plan, scansUsed: updated.scansUsed, synced: true });
}
