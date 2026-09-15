import "server-only";

import { env } from "@/lib/env";

export const siteName = "Murat İpek | Astroloji";
export const siteDescription =
  "Astroloji yazıları ve kişisel danışmanlık bilgileri.";
export const siteUrl = new URL(env.BETTER_AUTH_URL);

export function absoluteSiteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}
