import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function getPlanLimits(plan: "FREE" | "PRO" | "PREMIUM") {
  const limits = {
    FREE: { scans: 5, flashcards: 20, quizQuestions: 10, aiChat: false, ocr: false, export: false },
    PRO: { scans: Infinity, flashcards: Infinity, quizQuestions: 50, aiChat: true, ocr: false, export: false },
    PREMIUM: { scans: Infinity, flashcards: Infinity, quizQuestions: 50, aiChat: true, ocr: true, export: true },
  };
  return limits[plan];
}
