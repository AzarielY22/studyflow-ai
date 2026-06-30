"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Question {
  id: string;
  type: string;
  question: string;
  options?: string[] | null;
  correctAnswer: string;
  explanation?: string | null;
}

interface Quiz {
  id: string;
  difficulty: string;
  questions: Question[];
}

export function QuizViewer({ quiz }: { quiz: Quiz }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState("");

  const question = quiz.questions[current];
  const isLast = current === quiz.questions.length - 1;

  const score = submitted
    ? quiz.questions.filter((q) => answers[q.id]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()).length
    : 0;

  const submit = () => {
    setAnswers({ ...answers, [question.id]: selected });
    if (isLast) setSubmitted(true);
    else { setCurrent(current + 1); setSelected(""); }
  };

  if (submitted) {
    const total = quiz.questions.length;
    return (
      <div className="mx-auto max-w-lg text-center">
        <h2 className="text-3xl font-bold">Quiz Complete!</h2>
        <p className="mt-2 text-5xl font-bold text-indigo-400">{score}/{total}</p>
        <p className="mt-2 text-zinc-400">{Math.round((score / total) * 100)}% correct</p>
        <div className="mt-8 space-y-4 text-left">
          {quiz.questions.map((q) => {
            const correct = answers[q.id]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
            return (
              <Card key={q.id} className={correct ? "border-green-500/30" : "border-red-500/30"}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    {correct ? (
                      <CheckCircle className="h-5 w-5 shrink-0 text-green-400" />
                    ) : (
                      <XCircle className="h-5 w-5 shrink-0 text-red-400" />
                    )}
                    <div>
                      <p className="font-medium">{q.question}</p>
                      {!correct && (
                        <p className="mt-1 text-sm text-green-400">Correct: {q.correctAnswer}</p>
                      )}
                      {q.explanation && (
                        <p className="mt-1 text-sm text-zinc-400">{q.explanation}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <Button className="mt-6" onClick={() => { setSubmitted(false); setCurrent(0); setAnswers({}); setSelected(""); }}>
          Retry Quiz
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-4 flex items-center justify-between text-sm text-zinc-400">
        <span>Question {current + 1} of {quiz.questions.length}</span>
        <span className="capitalize">{quiz.difficulty.toLowerCase()}</span>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-lg font-medium">{question.question}</p>
          <div className="mt-6 space-y-2">
            {question.options?.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelected(opt)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                  selected === opt
                    ? "border-indigo-500 bg-indigo-600/20 text-indigo-300"
                    : "border-white/10 hover:bg-white/5"
                }`}
              >
                {opt}
              </button>
            )) ?? (
              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                placeholder="Type your answer..."
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              />
            )}
          </div>
          <Button className="mt-6 w-full" disabled={!selected} onClick={submit}>
            {isLast ? "Submit Quiz" : "Next Question"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
