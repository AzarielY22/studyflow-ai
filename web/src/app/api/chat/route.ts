import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { chatWithMaterial } from "@/lib/openai";
import { getPlanLimits } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const { session, error } = await requireAuth(req);
  if (error) return error;

  const { materialId, message } = await req.json();
  if (!materialId || !message) {
    return NextResponse.json({ error: "Missing materialId or message" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session!.user!.id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const limits = getPlanLimits(user.plan);
  if (!limits.aiChat) {
    return NextResponse.json(
      { error: "AI chat requires a Pro or Premium plan." },
      { status: 403 }
    );
  }

  const material = await prisma.material.findFirst({
    where: { id: materialId, userId: user.id },
    include: {
      chatMessages: { orderBy: { createdAt: "asc" }, take: 20 },
    },
  });

  if (!material?.rawContent) {
    return NextResponse.json({ error: "Material not found" }, { status: 404 });
  }

  const history = material.chatMessages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const reply = await chatWithMaterial(material.rawContent, message, history);

  await prisma.chatMessage.createMany({
    data: [
      { userId: user.id, materialId, role: "user", content: message },
      { userId: user.id, materialId, role: "assistant", content: reply },
    ],
  });

  return NextResponse.json({ reply });
}
