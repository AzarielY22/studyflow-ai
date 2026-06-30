import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const { session, error } = await requireAuth(req);
  if (error) return error;

  const folders = await prisma.folder.findMany({
    where: { userId: session!.user!.id },
    include: { _count: { select: { materials: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(folders);
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireAuth(req);
  if (error) return error;

  const { name } = await req.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: "Folder name required" }, { status: 400 });
  }

  const folder = await prisma.folder.create({
    data: { name: name.trim(), userId: session!.user!.id },
  });

  return NextResponse.json(folder);
}
