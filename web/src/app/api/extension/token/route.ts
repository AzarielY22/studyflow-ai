import { auth } from "@/lib/auth";
import { signExtensionToken, verifyExtensionToken } from "@/lib/extension-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const user = verifyExtensionToken(authHeader.slice(7));
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({
      authenticated: true,
      user: { id: user.userId, email: user.email, name: user.name },
    });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    },
  });
}

export async function POST() {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const token = signExtensionToken(
    session.user.id,
    session.user.email,
    session.user.name
  );

  return NextResponse.json({
    token,
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    },
  });
}
