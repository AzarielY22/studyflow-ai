"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatPanel({ materialId }: { materialId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materialId, message: userMsg }),
      });
      const data = await res.json();
      if (data.error) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.error }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "What was the main idea?",
    "Explain the key concepts.",
    "What should I remember for the exam?",
  ];

  return (
    <div className="mx-auto flex max-w-2xl flex-col" style={{ height: "500px" }}>
      <div className="flex-1 space-y-4 overflow-y-auto pb-4">
        {messages.length === 0 && (
          <div className="text-center">
            <p className="text-zinc-400">Ask questions about your uploaded material</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-400 hover:bg-white/5"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <Card className={`max-w-[80%] px-4 py-3 ${msg.role === "user" ? "bg-indigo-600/20" : ""}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </Card>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
          </div>
        )}
      </div>
      <div className="flex gap-2 border-t border-white/10 pt-4">
        <Input
          placeholder="Ask about your notes..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <Button onClick={send} disabled={loading || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
