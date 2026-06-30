import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { getPlanLimits } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { session, error } = await requireAuth(req);
  if (error) return error;

  const user = await prisma.user.findUnique({
    where: { id: session!.user!.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      plan: true,
      scansUsed: true,
      scansResetAt: true,
      createdAt: true,
      defaultSummaryType: true,
      defaultQuizDifficulty: true,
      defaultQuizCount: true,
      emailNotifications: true,
      studyReminders: true,
      productUpdates: true,
      theme: true,
      _count: { select: { materials: true, folders: true } },
    },
  });

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const limits = getPlanLimits(user.plan);

  return NextResponse.json({
    ...user,
    limits: {
      scans: limits.scans === Infinity ? "unlimited" : limits.scans,
      flashcards: limits.flashcards === Infinity ? "unlimited" : limits.flashcards,
      quizQuestions: limits.quizQuestions,
      aiChat: limits.aiChat,
      export: limits.export,
    },
  });
}

export async function PATCH(req: NextRequest) {
  const { session, error } = await requireAuth(req);
  if (error) return error;

  const body = await req.json();
  const allowed = [
    "name",
    "defaultSummaryType",
    "defaultQuizDifficulty",
    "defaultQuizCount",
    "emailNotifications",
    "studyReminders",
    "productUpdates",
    "theme",
  ] as const;

  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = body[key];
  }

  if (data.defaultQuizCount && ![10, 20, 50].includes(data.defaultQuizCount as number)) {
    return NextResponse.json({ error: "Invalid quiz count" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: session!.user!.id },
    data,
    select: {
      name: true,
      defaultSummaryType: true,
      defaultQuizDifficulty: true,
      defaultQuizCount: true,
      emailNotifications: true,
      studyReminders: true,
      productUpdates: true,
      theme: true,
    },
  });

  return NextResponse.json(user);
}

export async function DELETE(req: NextRequest) {
  const { session, error } = await requireAuth(req);
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  if (action === "materials") {
    await prisma.material.deleteMany({ where: { userId: session!.user!.id } });
    return NextResponse.json({ success: true, message: "All study materials deleted" });
  }

  if (action === "folders") {
    await prisma.folder.deleteMany({ where: { userId: session!.user!.id } });
    return NextResponse.json({ success: true, message: "All folders deleted" });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
