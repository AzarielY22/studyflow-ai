import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe() {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-06-24.dahlia",
      typescript: true,
    });
  }
  return stripeInstance;
}

export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    features: [
      "5 scans per month",
      "Basic summaries",
      "20 flashcards per scan",
      "10-question quizzes",
    ],
  },
  PRO: {
    name: "Pro",
    price: 9.99,
    features: [
      "Unlimited scans",
      "Unlimited flashcards",
      "Unlimited quizzes",
      "AI chat with uploaded notes",
      "Faster AI processing",
    ],
  },
  PREMIUM: {
    name: "Premium",
    price: 14.99,
    features: [
      "Everything in Pro",
      "OCR for scanned PDFs",
      "Export flashcards & summaries",
      "Priority processing",
      "Early access to new features",
    ],
  },
} as const;

export async function getPriceIdForPlan(plan: "PRO" | "PREMIUM"): Promise<string | null> {
  const priceIdEnv = plan === "PRO" ? process.env.STRIPE_PRO_PRICE_ID : process.env.STRIPE_PREMIUM_PRICE_ID;
  if (priceIdEnv?.startsWith("price_")) return priceIdEnv;

  const productId =
    plan === "PRO" ? process.env.STRIPE_PRO_PRODUCT_ID : process.env.STRIPE_PREMIUM_PRODUCT_ID;
  if (!productId) return priceIdEnv || null;

  const stripe = getStripe();
  const prices = await stripe.prices.list({
    product: productId,
    active: true,
    type: "recurring",
    limit: 1,
  });

  return prices.data[0]?.id ?? null;
}
