"use client";

import { useEffect, useState } from "react";
import { UpgradeModal } from "@/components/dashboard/upgrade-modal";

const DISMISS_KEY = "studyflow_upgrade_dismissed";

interface DashboardShellProps {
  children: React.ReactNode;
  userPlan?: string;
}

export function DashboardShell({ children, userPlan = "FREE" }: DashboardShellProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (userPlan !== "FREE") return;
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (!dismissed) setShowModal(true);
  }, [userPlan]);

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, "true");
    setShowModal(false);
    // Best-effort server sync (optional)
    fetch("/api/user/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dismissed: true }),
    }).catch(() => {});
  };

  return (
    <>
      {children}
      <UpgradeModal open={showModal} onDismiss={handleDismiss} />
    </>
  );
}
