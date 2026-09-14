import "server-only";

import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";

import { pool } from "@/lib/database";
import { env } from "@/lib/env";

export const auth = betterAuth({
  database: pool,
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },
  plugins: [admin()],
});
