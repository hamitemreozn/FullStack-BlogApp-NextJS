import "server-only";

import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";

import { pool } from "@/lib/database";
import { env } from "@/lib/env";

const localDevelopmentOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];
const isLocalDevelopment = process.env.NODE_ENV === "development";

export const auth = betterAuth({
  database: pool,
  baseURL: isLocalDevelopment
    ? { allowedHosts: ["localhost:3000", "127.0.0.1:3000"] }
    : env.BETTER_AUTH_URL,
  trustedOrigins: isLocalDevelopment
    ? localDevelopmentOrigins
    : [env.BETTER_AUTH_URL],
  secret: env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
  },
  advanced: {
    // Cookies do not distinguish localhost ports. A project-specific prefix
    // keeps this admin session separate from other local Better Auth projects.
    cookiePrefix: "astrology-blog",
  },
  plugins: [admin()],
});
