"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlashcardViewer } from "@/components/study/flashcard-viewer";
import { QuizViewer } from "@/components/study/quiz-viewer";
import { ChatPanel } from "@/components/study/chat-panel";

interface Material {
  id: string;
  title: string;
  rawContent?: string;
  summary?: { content: string; type: string } | null;
  flashcards: { id: string; front: string; back: string; topic?: string | null; isFavorite: boolean }[];
  quiz?: {
    id: string;
    difficulty: string;
    questions: {
      id: string;
      type: string;
      question: string;
      options?: string[] | null;
      correctAnswer: string;
      explanation?: string | null;
    }[];
  } | null;
}

export default function MaterialPage() {
  const params = useParams();
  const id = params.id as string;
  const [material, setMaterial] = useState<Material | null>(null);
  const [tab, setTab] = useState<"summary" | "flashcards" | "quiz" | "chat">("summary");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/materials/${id}`)
      .then((r) => r.json())
      .then(setMaterial)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (!material) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-32">
        <p className="text-zinc-400">Material not found</p>
        <Link href="/dashboard"><Button variant="secondary">Back to Dashboard</Button></Link>
      </div>
    );
  }

  const tabs = [
    { id: "summary" as const, label: "Summary" },
    { id: "flashcards" as const, label: `Flashcards (${material.flashcards.length})` },
    { id: "quiz" as const, label: `Quiz (${material.quiz?.questions.length ?? 0})` },
    { id: "chat" as const, label: "Ask AI" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Link href="/dashboard" className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-indigo-400">
          <ArrowLeft className="h-4 w-4" /> Back to materials
        </Link>
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">{material.title}</h1>
      </div>

      <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              tab === t.id
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div>
        {tab === "summary" && material.summary && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm">
            <div className="whitespace-pre-wrap leading-relaxed text-zinc-300">{material.summary.content}</div>
          </div>
        )}
        {tab === "flashcards" && <FlashcardViewer flashcards={material.flashcards} />}
        {tab === "quiz" && material.quiz && <QuizViewer quiz={material.quiz} />}
        {tab === "chat" && <ChatPanel materialId={material.id} />}
      </div>
    </div>
  );
}
