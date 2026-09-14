import Image from "next/image";
import { notFound } from "next/navigation";

import { CommentForm } from "./comment-form";
import { database } from "@/lib/database";

export const dynamic = "force-dynamic";

type PostPageProps = { params: Promise<{ slug: string }> };

function extractPlainText(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(extractPlainText).join(" ");
  if (value && typeof value === "object")
    return Object.values(value).map(extractPlainText).join(" ");
  return "";
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await database
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
    .executeTakeFirst();
  if (!post) notFound();
  const comments = await database
    .selectFrom("comments")
    .innerJoin("posts", "posts.id", "comments.post_id")
    .select([
      "comments.id",
      "comments.author_name",
      "comments.body",
      "comments.created_at",
    ])
    .where("posts.slug", "=", slug)
    .where("comments.status", "=", "APPROVED")
    .orderBy("comments.created_at", "asc")
    .execute();
  return (
    <main className="page-shell">
      <article className="article">
        <p className="eyebrow">{post.category_title ?? "Astroloji"}</p>
        <h1>{post.title}</h1>
        <p className="meta">{post.published_at?.toLocaleDateString("tr-TR")}</p>
        {post.excerpt ? <p className="notice">{post.excerpt}</p> : null}
        {post.cover_image_key ? (
          <Image
            className="article-cover"
            src={`/api/media/${post.cover_image_key}`}
            alt=""
            width={1200}
            height={675}
            priority
          />
        ) : null}
        <div className="article-content">{extractPlainText(post.content)}</div>
        <section
          className="comments-section"
          aria-labelledby="comments-heading"
        >
          <p className="eyebrow">Sohbet</p>
          <h2 id="comments-heading">Yorumlar</h2>
          {comments.length ? (
            <div className="comment-list">
              {comments.map((comment) => (
                <article className="comment-item" key={comment.id}>
                  <div>
                    <strong>{comment.author_name}</strong>
                    <time dateTime={comment.created_at.toISOString()}>
                      {comment.created_at.toLocaleDateString("tr-TR")}
                    </time>
                  </div>
                  <p>{comment.body}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="comment-empty">
              Henüz onaylanmış yorum yok. İlk düşüncenizi paylaşabilirsiniz.
            </p>
          )}
          <CommentForm slug={slug} />
        </section>
      </article>
    </main>
  );
}
