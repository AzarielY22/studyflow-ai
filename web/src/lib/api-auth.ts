import { auth } from "@/lib/auth";
import { verifyExtensionToken } from "@/lib/extension-auth";
import { NextRequest, NextResponse } from "next/server";

export async function requireAuth(req?: NextRequest) {
  const authHeader = req?.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const user = verifyExtensionToken(authHeader.slice(7));
    if (!user) {
      return { session: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    }
    return {
      session: {
        user: { id: user.userId, email: user.email, name: user.name },
      },
      error: null,
    };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { session: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, error: null };
}

export async function checkScanLimit(userId: string, plan: string, scansUsed: number) {
  if (plan === "PRO" || plan === "PREMIUM") return true;
  return scansUsed < 5;
}
