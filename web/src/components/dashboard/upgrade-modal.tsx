"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PLANS } from "@/lib/plans";

interface UpgradeModalProps {
  open: boolean;
  onDismiss: () => void;
}

export function UpgradeModal({ open, onDismiss }: UpgradeModalProps) {
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

  const handleDismiss = () => {
    onDismiss();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl"
          >
            <Card className="overflow-hidden border-indigo-500/30 bg-zinc-950/95 shadow-2xl shadow-indigo-500/20">
              <button
                onClick={handleDismiss}
                className="absolute right-4 top-4 rounded-lg p-2 text-zinc-500 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <CardContent className="p-8">
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
                    <Sparkles className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">Welcome to StudyFlow AI!</h2>
                  <p className="mx-auto mt-2 max-w-md text-zinc-400">
                    You&apos;re on the Free plan. Upgrade now for unlimited scans, AI chat, and more study power.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {/* Free */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="font-semibold">{PLANS.FREE.name}</p>
                    <p className="mt-1 text-3xl font-bold">$0</p>
                    <ul className="mt-4 space-y-2">
                      {PLANS.FREE.features.slice(0, 3).map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs text-zinc-400">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-500" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button variant="secondary" className="mt-5 w-full" onClick={handleDismiss}>
                      Stay on Free
                    </Button>
                  </div>

                  {/* Pro */}
                  <div className="relative rounded-2xl border border-indigo-500/50 bg-indigo-500/10 p-5 ring-1 ring-indigo-500/20">
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                      Popular
                    </span>
                    <p className="font-semibold text-indigo-300">{PLANS.PRO.name}</p>
                    <p className="mt-1 text-3xl font-bold">${PLANS.PRO.price}<span className="text-sm font-normal text-zinc-500">/mo</span></p>
                    <ul className="mt-4 space-y-2">
                      {PLANS.PRO.features.slice(0, 4).map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs text-zinc-300">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-400" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="mt-5 w-full"
                      disabled={loading === "PRO"}
                      onClick={() => handleCheckout("PRO")}
                    >
                      <Zap className="h-4 w-4" />
                      {loading === "PRO" ? "Loading..." : "Upgrade to Pro"}
                    </Button>
                  </div>

                  {/* Premium */}
                  <div className="rounded-2xl border border-violet-500/30 bg-violet-500/5 p-5">
                    <p className="font-semibold text-violet-300">{PLANS.PREMIUM.name}</p>
                    <p className="mt-1 text-3xl font-bold">${PLANS.PREMIUM.price}<span className="text-sm font-normal text-zinc-500">/mo</span></p>
                    <ul className="mt-4 space-y-2">
                      {PLANS.PREMIUM.features.slice(0, 4).map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs text-zinc-400">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-400" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant="secondary"
                      className="mt-5 w-full border-violet-500/30 hover:bg-violet-500/10"
                      disabled={loading === "PREMIUM"}
                      onClick={() => handleCheckout("PREMIUM")}
                    >
                      {loading === "PREMIUM" ? "Loading..." : "Go Premium"}
                    </Button>
                  </div>
                </div>

                <p className="mt-6 text-center text-xs text-zinc-500">
                  Cancel anytime · Secure checkout via Stripe
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
