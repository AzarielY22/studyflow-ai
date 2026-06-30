import Link from "next/link";
import {
  Brain, FileText, Globe, MessageSquare, Shield, Sparkles, Video, Zap,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Sparkles,
    title: "Smart Summaries",
    desc: "Choose quick, detailed, beginner, or college-level summaries tailored to your needs.",
  },
  {
    icon: Brain,
    title: "Auto Flashcards",
    desc: "Flip, shuffle, favorite, and track progress across topic-organized flashcard decks.",
  },
  {
    icon: Zap,
    title: "AI Quiz Generator",
    desc: "Multiple choice, true/false, fill-in-blank, short answer, and matching questions.",
  },
  {
    icon: MessageSquare,
    title: "Ask AI About Notes",
    desc: "Chat with your uploaded content. Answers only from your material — no hallucinations.",
  },
  {
    icon: FileText,
    title: "PDF & Document Scanner",
    desc: "Upload PDFs, Google Docs, PowerPoints, and research papers.",
  },
  {
    icon: Video,
    title: "YouTube Scanner",
    desc: "Extract and analyze educational video content automatically.",
  },
  {
    icon: Globe,
    title: "Chrome Extension",
    desc: "Analyze pages, highlight text, and study from any website with one click.",
  },
  {
    icon: Shield,
    title: "Secure Cloud Storage",
    desc: "Your study materials are encrypted and accessible from anywhere.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="gradient-bg min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-32 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold">Powerful features for smarter studying</h1>
          <p className="mt-4 text-zinc-400">
            Everything you need to transform any content into complete study materials.
          </p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="h-full">
              <CardContent className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20">
                  <Icon className="h-5 w-5 text-indigo-400" />
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link href="/login">
            <Button size="lg">Start Free Today</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
