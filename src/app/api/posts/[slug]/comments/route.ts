import { z } from "zod";

import { allowComment } from "@/lib/comment-security";
import { database } from "@/lib/database";
import { env } from "@/lib/env";

const commentInputSchema = z.object({
  authorName: z.string().trim().min(2).max(80),
  body: z.string().trim().min(2).max(2_000),
  website: z.string().max(0).optional(),
});
type CommentRouteContext = { params: Promise<{ slug: string }> };

export async function GET(_: Request, context: CommentRouteContext) {
  const { slug } = await context.params;
  const post = await database
    .selectFrom("posts")
    .select("id")
    .where("slug", "=", slug)
    .where("status", "=", "PUBLISHED")
    .executeTakeFirst();
  if (!post)
    return Response.json({ message: "Yazı bulunamadı." }, { status: 404 });

  const comments = await database
    .selectFrom("comments")
    .select(["id", "author_name", "body", "created_at"])
    .where("post_id", "=", post.id)
    .where("status", "=", "APPROVED")
    .orderBy("created_at", "asc")
    .execute();
  return Response.json(comments);
}

export async function POST(request: Request, context: CommentRouteContext) {
  const origin = request.headers.get("origin");
  if (origin !== null && origin !== env.BETTER_AUTH_URL) {
    return Response.json(
      { message: "Geçersiz istek kaynağı." },
      { status: 403 },
    );
  }

  const parsed = commentInputSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return Response.json(
      { message: "Adınız ve yorumunuz gerekli." },
      { status: 400 },
    );
  }

  if (parsed.data.website) {
    return Response.json({ accepted: true }, { status: 202 });
  }

  const { slug } = await context.params;
  const post = await database
    .selectFrom("posts")
    .select("id")
    .where("slug", "=", slug)
    .where("status", "=", "PUBLISHED")
    .executeTakeFirst();
  if (!post)
    return Response.json({ message: "Yazı bulunamadı." }, { status: 404 });

  const rateLimit = await allowComment(request.headers);
  if (!rateLimit.allowed) {
    return Response.json(
      { message: "Lütfen yorum göndermeden önce birkaç dakika bekleyin." },
      { status: 429, headers: { "Retry-After": "600" } },
    );
  }

  await database
    .insertInto("comments")
    .values({
      post_id: post.id,
      author_name: parsed.data.authorName,
      body: parsed.data.body,
      source_fingerprint: rateLimit.fingerprint,
    })
    .execute();
  return Response.json({ accepted: true }, { status: 202 });
}
