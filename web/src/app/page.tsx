"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Brain, FileText, Globe, MessageSquare, Sparkles, Video, Zap,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: Sparkles, title: "AI Summaries", desc: "Quick, detailed, or beginner-friendly summaries in seconds." },
  { icon: Brain, title: "AI Flashcards", desc: "Auto-generated flashcards organized by topic." },
  { icon: Zap, title: "AI Quiz Generator", desc: "Multiple choice, true/false, fill-in-blank, and more." },
  { icon: FileText, title: "PDF Scanner", desc: "Upload lecture notes and textbooks instantly." },
  { icon: Video, title: "YouTube Scanner", desc: "Turn any educational video into study materials." },
  { icon: MessageSquare, title: "Ask AI About Notes", desc: "Chat with your content — no hallucinations." },
];

export default function HomePage() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user;

  return (
    <div className="gradient-bg min-h-screen">
      <Navbar />

      <main>
        <section className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-400">
              <Sparkles className="h-4 w-4" />
              AI-Powered Study Assistant
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Turn Any PDF or Video Into{" "}
              <span className="text-gradient">Quizzes, Flashcards, and Summaries</span>{" "}
              in Seconds.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
              Upload your lecture notes, textbooks, or YouTube videos and let AI instantly
              generate everything you need to study smarter.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="lg" className="min-w-[160px]">Go to Dashboard</Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button size="lg" className="min-w-[160px]">Start Free</Button>
                </Link>
              )}
              <Link href="#extension">
                <Button variant="secondary" size="lg" className="min-w-[160px]">
                  <Globe className="h-4 w-4" />
                  Install Chrome Extension
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-20 max-w-5xl"
          >
            <div className="glass overflow-hidden rounded-3xl p-1">
              <div className="rounded-[22px] bg-zinc-900/80 p-8">
                <div className="grid gap-4 sm:grid-cols-3">
                  {["Summary", "Flashcards", "Quiz"].map((tab, i) => (
                    <div
      key={tab} className={`rounded-xl p-4 ${i === 0 ? "bg-indigo-600/20 border border-indigo-500/30" : "bg-white/5"}`}>
                      <p className="text-sm font-medium text-indigo-400">{tab}</p>
                      <p className="mt-2 text-xs text-zinc-500">
                        {i === 0 && "Main ideas, key takeaways, bullet points..."}
                        {i === 1 && "24 flashcards across 4 topics..."}
                        {i === 2 && "10 questions · Medium difficulty"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Everything you need to study faster</h2>
            <p className="mt-3 text-zinc-400">One click replaces hours of manual note-taking.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full transition-all hover:border-indigo-500/30 hover:bg-white/10">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20">
                      <Icon className="h-5 w-5 text-indigo-400" />
                    </div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-2 text-sm text-zinc-400">{desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="extension" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <Card className="overflow-hidden">
            <CardContent className="flex flex-col items-center gap-8 p-12 text-center lg:flex-row lg:text-left">
              <div className="flex-1">
                <h2 className="text-3xl font-bold">Study anywhere with our Chrome Extension</h2>
                <p className="mt-4 text-zinc-400">
                  Analyze PDFs, YouTube videos, and webpages directly from your browser.
                  Highlight text and right-click to study instantly.
                </p>
                <Button className="mt-6" size="lg">
                  <Globe className="h-4 w-4" />
                  Add to Chrome
                </Button>
              </div>
              <div className="glass w-full max-w-sm rounded-2xl p-6">
                <p className="mb-4 text-sm font-semibold">StudyFlow AI</p>
                {["Analyze PDF", "Analyze Video", "Analyze Page", "My Dashboard"].map((btn) => (
                  <div key={btn} className="mb-2 rounded-xl bg-indigo-600/20 px-4 py-2.5 text-sm text-center">
                    {btn}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
          <h2 className="text-3xl font-bold">Ready to study smarter?</h2>
          <p className="mt-4 text-zinc-400">Join thousands of students saving hours every week.</p>
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button size="lg" className="mt-8">Go to Dashboard</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button size="lg" className="mt-8">Get Started Free</Button>
            </Link>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
