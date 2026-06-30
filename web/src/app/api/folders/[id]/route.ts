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
  const folder = await prisma.folder.findFirst({
    where: { id, userId: session!.user!.id },
    include: {
      materials: {
        include: { _count: { select: { flashcards: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!folder) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(folder);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth(req);
  if (error) return error;

  const { id } = await params;
  const { name } = await req.json();

  const folder = await prisma.folder.updateMany({
    where: { id, userId: session!.user!.id },
    data: { name: name?.trim() },
  });

  return NextResponse.json(folder);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth(req);
  if (error) return error;

  const { id } = await params;
  await prisma.folder.deleteMany({
    where: { id, userId: session!.user!.id },
  });

  return NextResponse.json({ success: true });
}
