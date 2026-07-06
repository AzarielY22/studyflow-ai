import { Suspense } from "react";
import BillingPage from "./billing-content";

export default function Billing() {
  return (
    <Suspense fallback={<div className="text-zinc-400">Loading billing...</div>}>
      <BillingPage />
    </Suspense>
  );
}
