"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Brain, CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STORAGE_KEY = "studyflow_extension_auth";

function deliverTokenToExtension(token: string, user: { id: string; email: string; name?: string | null }) {
  const payload = { token, user, ts: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

  const dispatch = () => {
    window.dispatchEvent(
      new CustomEvent("studyflow-auth", { detail: { token, user } })
    );
  };

  dispatch();
  const interval = setInterval(dispatch, 300);
  setTimeout(() => clearInterval(interval), 5000);
}

export default function ExtensionCallbackPage() {
  const { data: session, status } = useSession();
  const [state, setState] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Connecting extension...");

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      setState("error");
      setMessage("Not signed in. Please log in first.");
      return;
    }

    async function connectExtension() {
      try {
        const res = await fetch("/api/extension/token", { method: "POST" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to get token");

        deliverTokenToExtension(data.token, data.user);

        setState("success");
        setMessage(
          "Extension connected! Close this tab, then click the StudyFlow icon in your toolbar."
        );
      } catch (err) {
        setState("error");
        setMessage(err instanceof Error ? err.message : "Failed to connect extension");
      }
    }

    connectExtension();
  }, [status, session]);

  return (
    <div className="gradient-bg flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
            {state === "success" ? (
              <CheckCircle className="h-6 w-6 text-white" />
            ) : state === "loading" ? (
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            ) : (
              <Brain className="h-6 w-6 text-white" />
            )}
          </div>
          <CardTitle>
            {state === "success" ? "You're connected!" : "Extension Setup"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-400">{message}</p>
          {state === "success" && session?.user?.email && (
            <p className="mt-2 text-sm text-indigo-400">Signed in as {session.user.email}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
