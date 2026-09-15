import "server-only";

import { env } from "@/lib/env";

const localDevelopmentOrigins = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

export function hasTrustedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (origin === null || origin === env.BETTER_AUTH_URL) return true;
  return (
    process.env.NODE_ENV === "development" &&
    localDevelopmentOrigins.has(origin)
  );
}
