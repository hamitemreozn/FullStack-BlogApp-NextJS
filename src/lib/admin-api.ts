import "server-only";

import { auth } from "@/lib/auth";
import { env } from "@/lib/env";

const localDevelopmentOrigins = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

export async function requireAdmin(headers: Headers) {
  const session = await auth.api.getSession({ headers });

  if (!session || session.user.role !== "admin") {
    return null;
  }

  return session;
}

export function hasTrustedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (origin === null || origin === env.BETTER_AUTH_URL) return true;
  return (
    process.env.NODE_ENV === "development" &&
    localDevelopmentOrigins.has(origin)
  );
}
