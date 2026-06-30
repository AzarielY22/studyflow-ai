"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  topic?: string | null;
  isFavorite: boolean;
}

export function FlashcardViewer({ flashcards }: { flashcards: Flashcard[] }) {
  const [cards, setCards] = useState(flashcards);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!cards.length) return <p className="text-zinc-400">No flashcards generated.</p>;

  const card = cards[index];
  const progress = ((index + 1) / cards.length) * 100;

  const shuffle = () => {
    setCards([...cards].sort(() => Math.random() - 0.5));
    setIndex(0);
    setFlipped(false);
  };

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-zinc-400">
          {index + 1} / {cards.length} · {card.topic ?? "General"}
        </span>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={shuffle}><Shuffle className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => setFlipped(false)}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div
        className="cursor-pointer perspective-[1000px]"
        onClick={() => setFlipped(!flipped)}
      >
        <Card
          className={`flip-card min-h-[280px] flex items-center justify-center p-8 text-center ${flipped ? "flipped" : ""}`}
        >
          <div className="backface-hidden">
            <p className="text-xs uppercase tracking-wider text-indigo-400 mb-4">Question</p>
            <p className="text-lg font-medium">{card.front}</p>
            <p className="mt-6 text-xs text-zinc-500">Click to flip</p>
          </div>
        </Card>
        {flipped && (
          <Card className="mt-4 min-h-[200px] flex items-center justify-center p-8 text-center border-indigo-500/30 bg-indigo-600/10">
            <div>
              <p className="text-xs uppercase tracking-wider text-indigo-400 mb-4">Answer</p>
              <p className="text-lg">{card.back}</p>
            </div>
          </Card>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <Button
          variant="secondary"
          disabled={index === 0}
          onClick={() => { setIndex(index - 1); setFlipped(false); }}
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        <Button
          disabled={index === cards.length - 1}
          onClick={() => { setIndex(index + 1); setFlipped(false); }}
        >
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
