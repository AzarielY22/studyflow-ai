"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { CheckCircle2, CreditCard, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PLANS } from "@/lib/plans";
import { getPlanLimits } from "@/lib/utils";

type UserSettings = {
  plan: "FREE" | "PRO" | "PREMIUM";
  scansUsed: number;
  scansRemaining: number | "unlimited";
  stripeCustomerId: string | null;
};

export default function BillingPage() {
  const searchParams = useSearchParams();
  const { update: updateSession } = useSession();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [success, setSuccess] = useState(false);

  const loadSettings = async () => {
    const res = await fetch("/api/user/settings");
    if (res.ok) {
      const data = await res.json();
      setSettings(data);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (searchParams.get("success") === "true") {
        setSuccess(true);
        await fetch("/api/stripe/sync", { method: "POST" });
        await updateSession();
      }
      await loadSettings();
    };
    init();
  }, [searchParams, updateSession]);

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

  const plan = settings?.plan ?? "FREE";
  const planInfo = PLANS[plan];
  const limits = getPlanLimits(plan);
  const scansLabel =
    limits.scans === Infinity
      ? "Unlimited scans"
      : `${typeof settings?.scansRemaining === "number" ? settings.scansRemaining : 5} scans remaining this month`;

  return (
    <>
      <h1 className="text-2xl font-bold">Billing & Subscription</h1>
      <p className="mt-1 text-zinc-400">Manage your plan and payment methods</p>

      {success && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          Payment successful! Your plan has been updated.
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-indigo-400" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{planInfo.name}</p>
            <p className="mt-2 text-sm text-zinc-400">{scansLabel}</p>
            {plan === "FREE" ? (
              <Link href="/pricing">
                <Button className="mt-4">Upgrade Plan</Button>
              </Link>
            ) : (
              <p className="mt-4 text-sm text-indigo-300">
                ${planInfo.price}/month · Active subscription
              </p>
            )}
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
              disabled={loading || !settings?.stripeCustomerId}
              onClick={openPortal}
            >
              <ExternalLink className="h-4 w-4" />
              {loading ? "Loading..." : "Open Customer Portal"}
            </Button>
            {!settings?.stripeCustomerId && (
              <p className="mt-2 text-xs text-zinc-500">Subscribe to a paid plan to manage billing.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 font-semibold">Available Plans</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {Object.entries(PLANS).map(([key, p]) => (
            <Card key={key} className={key === plan ? "border-indigo-500/40" : ""}>
              <CardContent className="p-4">
                <p className="font-semibold">{p.name}</p>
                <p className="text-2xl font-bold">
                  ${p.price}
                  <span className="text-sm font-normal text-zinc-500">/mo</span>
                </p>
                {key === plan && (
                  <p className="mt-2 text-xs font-medium text-indigo-400">Current plan</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
