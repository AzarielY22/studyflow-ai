export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    features: [
      "5 scans per month",
      "Basic summaries",
      "20 flashcards per scan",
      "10-question quizzes",
    ],
  },
  PRO: {
    name: "Pro",
    price: 9.99,
    features: [
      "Unlimited scans",
      "Unlimited flashcards",
      "Unlimited quizzes",
      "AI chat with uploaded notes",
      "Faster AI processing",
    ],
  },
  PREMIUM: {
    name: "Premium",
    price: 14.99,
    features: [
      "Everything in Pro",
      "OCR for scanned PDFs",
      "Export flashcards & summaries",
      "Priority processing",
      "Early access to new features",
    ],
  },
} as const;
