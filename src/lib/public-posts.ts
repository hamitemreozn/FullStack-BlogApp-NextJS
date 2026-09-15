import "server-only";

import { cache } from "react";

import { database } from "@/lib/database";

export const getPublishedPost = cache(async (slug: string) =>
  database
    .selectFrom("posts")
    .leftJoin("categories", "categories.id", "posts.category_id")
    .select([
      "posts.title",
      "posts.excerpt",
      "posts.content",
      "posts.cover_image_key",
      "posts.published_at",
      "categories.title as category_title",
    ])
    .where("posts.slug", "=", slug)
    .where("posts.status", "=", "PUBLISHED")
    .where("posts.published_at", "<=", new Date())
    .executeTakeFirst(),
);
