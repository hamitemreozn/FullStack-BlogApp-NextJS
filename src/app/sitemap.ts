import type { MetadataRoute } from "next";

import { database } from "@/lib/database";
import { absoluteSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await database
    .selectFrom("posts")
    .select(["slug", "updated_at"])
    .where("status", "=", "PUBLISHED")
    .orderBy("published_at", "desc")
    .execute();

  return [
    {
      url: absoluteSiteUrl(),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteSiteUrl("/contact"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...posts.map((post) => ({
      url: absoluteSiteUrl(`/posts/${post.slug}`),
      lastModified: post.updated_at,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
