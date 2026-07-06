import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import { authConfig } from "./auth.config";

function getCookieDomain(): string | undefined {
  const url = process.env.AUTH_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (!url) return undefined;
  try {
    const host = new URL(url).hostname;
    if (host === "localhost" || host === "127.0.0.1") return undefined;
    const parts = host.split(".");
    if (parts.length >= 2) return `.${parts.slice(-2).join(".")}`;
  } catch {
    // ignore invalid URL
  }
  return undefined;
}

const cookieDomain = getCookieDomain();

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  ...(cookieDomain && {
    cookies: {
      sessionToken: {
        options: { domain: cookieDomain },
      },
    },
  }),
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { plan: true, scansUsed: true },
        });
        if (dbUser) {
          token.plan = dbUser.plan;
          token.scansUsed = dbUser.scansUsed;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.plan = token.plan as string;
        session.user.scansUsed = token.scansUsed as number;
      }
      return session;
    },
  },
});
