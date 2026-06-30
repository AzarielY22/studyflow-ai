import jwt from "jsonwebtoken";

const TOKEN_EXPIRY = "30d";

export function signExtensionToken(userId: string, email: string, name?: string | null) {
  return jwt.sign(
    { sub: userId, email, name },
    process.env.AUTH_SECRET!,
    { expiresIn: TOKEN_EXPIRY }
  );
}

export function verifyExtensionToken(token: string) {
  try {
    const payload = jwt.verify(token, process.env.AUTH_SECRET!) as {
      sub: string;
      email: string;
      name?: string;
    };
    return { userId: payload.sub, email: payload.email, name: payload.name };
  } catch {
    return null;
  }
}
