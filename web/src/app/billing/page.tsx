"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, ExternalLink } from "lucide-react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PLANS } from "@/lib/plans";

export default function BillingPage() {
  const [loading, setLoading] = useState(false);

  const openPortal = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout");
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Billing & Subscription</h1>
        <p className="mt-1 text-zinc-400">Manage your plan and payment methods</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-indigo-400" />
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">Free</p>
              <p className="mt-2 text-sm text-zinc-400">5 scans remaining this month</p>
              <Link href="/pricing">
                <Button className="mt-4">Upgrade Plan</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400">
                Update payment method, view invoices, or cancel your subscription via Stripe.
              </p>
              <Button
                variant="secondary"
                className="mt-4"
                disabled={loading}
                onClick={openPortal}
              >
                <ExternalLink className="h-4 w-4" />
                {loading ? "Loading..." : "Open Customer Portal"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 font-semibold">Available Plans</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {Object.entries(PLANS).map(([key, plan]) => (
              <Card key={key}>
                <CardContent className="p-4">
                  <p className="font-semibold">{plan.name}</p>
                  <p className="text-2xl font-bold">${plan.price}<span className="text-sm font-normal text-zinc-500">/mo</span></p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
