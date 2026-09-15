import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CommentForm } from "./comment-form";
import { RichText } from "@/components/rich-text";
import { database } from "@/lib/database";
import { getPublishedPost } from "@/lib/public-posts";
import { absoluteSiteUrl, siteName } from "@/lib/site";

export const dynamic = "force-dynamic";

type PostPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: "Yazı bulunamadı", robots: { index: false } };

  const image = post.cover_image_key
    ? `/api/media/${post.cover_image_key}`
    : "/opengraph-image";
  return {
    title: post.title,
    description: post.excerpt || `${post.title} · ${siteName}`,
    alternates: { canonical: `/posts/${slug}` },
    openGraph: {
      type: "article",
      url: absoluteSiteUrl(`/posts/${slug}`),
      title: post.title,
      description: post.excerpt || undefined,
      publishedTime: post.published_at?.toISOString(),
      images: [{ url: image, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || undefined,
      images: [image],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
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
            unoptimized
          />
        ) : null}
        <div className="article-content">
          <RichText content={post.content} />
        </div>
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
