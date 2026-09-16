import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

import { AdminShell } from "./admin-shell";
import { LogoutButton } from "./logout-button";
import { ContentForms } from "./content-forms";
import { CommentModeration } from "./comment-moderation";
import { MediaAudit } from "./media-audit";
import { auth } from "@/lib/auth";
import { database } from "@/lib/database";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    redirect("/admin/login");
  }

  const categories = await database
    .selectFrom("categories")
    .select(["id", "slug", "title"])
    .orderBy("title")
    .execute();
  const posts = await database
    .selectFrom("posts")
    .select([
      "id",
      "title",
      "slug",
      "excerpt",
      "content",
      "category_id",
      "cover_image_key",
      "status",
      "published_at",
      "updated_at",
    ])
    .orderBy("updated_at", "desc")
    .limit(50)
    .execute();
  const comments = await database
    .selectFrom("comments")
    .innerJoin("posts", "posts.id", "comments.post_id")
    .select([
      "comments.id",
      "comments.author_name",
      "comments.body",
      "comments.status",
      "comments.created_at",
      "posts.title as post_title",
    ])
    .orderBy("comments.created_at", "desc")
    .limit(50)
    .execute();

  return (
    <AdminShell>
      <section className="admin-card">
        <p className="eyebrow">Yönetim</p>
        <h1>Hoş geldin, {session.user.name}</h1>
        <div className="admin-utility-links">
          <Link href="/admin/account">Hesap güvenliği</Link>
          <LogoutButton />
        </div>
        <ContentForms
          categories={categories}
          posts={posts.map((post) => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            categoryId: post.category_id,
            coverImageKey: post.cover_image_key,
            published: post.status === "PUBLISHED",
            publishedAt: post.published_at?.toISOString() ?? null,
            scheduled:
              post.status === "PUBLISHED" &&
              post.published_at !== null &&
              post.published_at > new Date(),
            updatedAt: post.updated_at.toISOString(),
          }))}
        />
        <MediaAudit />
        <CommentModeration
          comments={comments.map((comment) => ({
            id: comment.id,
            authorName: comment.author_name,
            body: comment.body,
            status: comment.status,
            postTitle: comment.post_title,
            createdAt: comment.created_at.toISOString(),
          }))}
        />
      </section>
    </AdminShell>
  );
}
