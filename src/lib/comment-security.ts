import "server-only";

import { createHmac } from "node:crypto";

import { pool } from "@/lib/database";
import { env } from "@/lib/env";

const windowDurationMs = 10 * 60 * 1000;
const maximumCommentsPerWindow = 3;

function getSourceAddress(headers: Headers) {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function allowComment(headers: Headers) {
  const fingerprint = createHmac("sha256", env.BETTER_AUTH_SECRET)
    .update(getSourceAddress(headers))
    .digest("hex");
  const windowStartedAt = new Date(
    Math.floor(Date.now() / windowDurationMs) * windowDurationMs,
  );
  const result = await pool.query<{ request_count: number }>(
    `INSERT INTO comment_rate_limits (fingerprint, window_started_at, request_count)
     VALUES ($1, $2, 1)
     ON CONFLICT (fingerprint) DO UPDATE SET
       window_started_at = CASE WHEN comment_rate_limits.window_started_at < EXCLUDED.window_started_at THEN EXCLUDED.window_started_at ELSE comment_rate_limits.window_started_at END,
       request_count = CASE WHEN comment_rate_limits.window_started_at < EXCLUDED.window_started_at THEN 1 ELSE comment_rate_limits.request_count + 1 END,
       updated_at = now()
     RETURNING request_count`,
    [fingerprint, windowStartedAt],
  );

  return {
    allowed:
      (result.rows[0]?.request_count ?? maximumCommentsPerWindow + 1) <=
      maximumCommentsPerWindow,
    fingerprint,
  };
}
