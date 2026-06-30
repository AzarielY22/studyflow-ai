"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PLANS } from "@/lib/plans";

const plans = [
  { key: "FREE" as const, ...PLANS.FREE, cta: "Start Free", popular: false },
  { key: "PRO" as const, ...PLANS.PRO, cta: "Upgrade to Pro", popular: true },
  { key: "PREMIUM" as const, ...PLANS.PREMIUM, cta: "Go Premium", popular: false },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (plan: "PRO" | "PREMIUM") => {
    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="gradient-bg min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-32 sm:px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Simple, transparent pricing</h1>
          <p className="mt-4 text-zinc-400">Start free. Upgrade when you need more.</p>
        </div>
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.key}
              className={`relative ${plan.popular ? "border-indigo-500/50 ring-2 ring-indigo-500/20" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-medium">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  {plan.price > 0 && <span className="text-zinc-500">/month</span>}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-zinc-400">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                {plan.key === "FREE" ? (
                  <Link href="/login">
                    <Button className="mt-8 w-full" variant={plan.popular ? "default" : "secondary"}>
                      {plan.cta}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    className="mt-8 w-full"
                    variant={plan.popular ? "default" : "secondary"}
                    disabled={loading === plan.key}
                    onClick={() => handleCheckout(plan.key)}
                  >
                    {loading === plan.key ? "Loading..." : plan.cta}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
