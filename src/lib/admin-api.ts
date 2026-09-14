import "server-only";

import { auth } from "@/lib/auth";
import { env } from "@/lib/env";

export async function requireAdmin(headers: Headers) {
  const session = await auth.api.getSession({ headers });

  if (!session || session.user.role !== "admin") {
    return null;
  }

  return session;
}

export function hasTrustedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return origin === null || origin === env.BETTER_AUTH_URL;
}
