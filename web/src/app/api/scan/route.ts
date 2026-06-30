import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, checkScanLimit } from "@/lib/api-auth";
import { generateStudyMaterials } from "@/lib/openai";
import { getPlanLimits } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const { session, error } = await requireAuth(req);
  if (error) return error;

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "AI is not configured on the server. Add OPENAI_API_KEY to web/.env and restart npm run dev." },
      { status: 503 }
    );
  }

  const body = await req.json();
  const { title, type, content, sourceUrl, summaryType, quizCount, quizDifficulty } = body;

  if (!title || !type || !content) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session!.user!.id },
    select: {
      id: true,
      plan: true,
      scansUsed: true,
      defaultSummaryType: true,
      defaultQuizDifficulty: true,
      defaultQuizCount: true,
    },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const limits = getPlanLimits(user.plan);
  const canScan = await checkScanLimit(user.id, user.plan, user.scansUsed);
  if (!canScan) {
    return NextResponse.json(
      { error: "Monthly scan limit reached. Upgrade to Pro for unlimited scans." },
      { status: 403 }
    );
  }

  const effectiveSummaryType = summaryType ?? user.defaultSummaryType ?? "QUICK";
  const effectiveQuizDifficulty = quizDifficulty ?? user.defaultQuizDifficulty ?? "MEDIUM";
  const effectiveQuizCount = Math.min(
    quizCount ?? user.defaultQuizCount ?? limits.quizQuestions,
    limits.quizQuestions
  );
  const material = await prisma.material.create({
    data: {
      title,
      type,
      sourceUrl,
      rawContent: content,
      status: "PROCESSING",
      userId: user.id,
    },
  });

  try {
    const ai = await generateStudyMaterials(content, {
      summaryType: effectiveSummaryType,
      flashcardCount: limits.flashcards === Infinity ? 30 : limits.flashcards,
      quizCount: effectiveQuizCount,
      quizDifficulty: effectiveQuizDifficulty,
    });

    await prisma.$transaction(async (tx) => {
      await tx.summary.create({
        data: {
          materialId: material.id,
          content: ai.summary,
          type: effectiveSummaryType,
        },
      });

      if (ai.flashcards?.length) {
        await tx.flashcard.createMany({
          data: ai.flashcards.map((fc: { front: string; back: string; topic?: string }) => ({
            materialId: material.id,
            front: fc.front,
            back: fc.back,
            topic: fc.topic ?? "General",
          })),
        });
      }

      if (ai.quiz?.length) {
        const quiz = await tx.quiz.create({
          data: {
            materialId: material.id,
            difficulty: effectiveQuizDifficulty,
          },
        });
        await tx.quizQuestion.createMany({
          data: ai.quiz.map((q: {
            type: string; question: string; options?: string[];
            correctAnswer: string; explanation?: string;
          }) => ({
            quizId: quiz.id,
            type: q.type as "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK" | "SHORT_ANSWER" | "MATCHING",
            question: q.question,
            options: q.options ?? undefined,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
          })),
        });
      }

      await tx.material.update({
        where: { id: material.id },
        data: { status: "COMPLETED" },
      });

      if (user.plan === "FREE") {
        await tx.user.update({
          where: { id: user.id },
          data: { scansUsed: { increment: 1 } },
        });
      }
    });

    const result = await prisma.material.findUnique({
      where: { id: material.id },
      include: { summary: true, flashcards: true, quiz: { include: { questions: true } } },
    });

    return NextResponse.json(result);
  } catch (err) {
    await prisma.material.update({
      where: { id: material.id },
      data: { status: "FAILED" },
    });
    console.error("Scan processing error:", err);
    return NextResponse.json({ error: "Failed to process content" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { session, error } = await requireAuth(req);
  if (error) return error;

  const materials = await prisma.material.findMany({
    where: { userId: session!.user!.id },
    include: { summary: true, _count: { select: { flashcards: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(materials);
}
