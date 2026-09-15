import "server-only";

import { auth } from "@/lib/auth";
export { hasTrustedOrigin } from "@/lib/origin";

export async function requireAdmin(headers: Headers) {
  const session = await auth.api.getSession({ headers });

  if (!session || session.user.role !== "admin") {
    return null;
  }

  return session;
}
