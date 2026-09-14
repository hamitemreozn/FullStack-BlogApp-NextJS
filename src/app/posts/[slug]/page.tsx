import Image from "next/image";
import { notFound } from "next/navigation";

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
      </article>
    </main>
  );
}
