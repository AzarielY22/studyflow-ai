import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  const { session, error } = await requireAuth(req);
  if (error) return error;

  try {
    await prisma.user.update({
      where: { id: session!.user!.id },
      data: { hasSeenUpgradePrompt: true },
    });
  } catch {
    // Field may not exist until prisma client is regenerated — localStorage handles dismiss
  }

  return NextResponse.json({ success: true });
}
