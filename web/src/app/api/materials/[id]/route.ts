import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth(req);
  if (error) return error;

  const { id } = await params;
  const material = await prisma.material.findFirst({
    where: { id, userId: session!.user!.id },
    include: {
      summary: true,
      flashcards: true,
      quiz: { include: { questions: true, attempts: { orderBy: { createdAt: "desc" }, take: 5 } } },
      chatMessages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!material) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(material);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth(req);
  if (error) return error;

  const { id } = await params;
  const body = await req.json();

  const material = await prisma.material.updateMany({
    where: { id, userId: session!.user!.id },
    data: {
      ...(body.title && { title: body.title }),
      ...(body.isFavorite !== undefined && { isFavorite: body.isFavorite }),
      ...(body.folderId !== undefined && { folderId: body.folderId }),
    },
  });

  return NextResponse.json(material);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth(req);
  if (error) return error;

  const { id } = await params;
  await prisma.material.deleteMany({
    where: { id, userId: session!.user!.id },
  });

  return NextResponse.json({ success: true });
}
