import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

import { LogoutButton } from "./logout-button";
import { ContentForms } from "./content-forms";
import { auth } from "@/lib/auth";
import { database } from "@/lib/database";

export const dynamic = "force-dynamic";

function extractPlainText(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(extractPlainText).join(" ");
  if (value && typeof value === "object")
    return Object.values(value).map(extractPlainText).join(" ");
  return "";
}

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
      "updated_at",
    ])
    .orderBy("updated_at", "desc")
    .limit(50)
    .execute();

  return (
    <main className="page-shell">
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
            body: extractPlainText(post.content),
            categoryId: post.category_id,
            coverImageKey: post.cover_image_key,
            published: post.status === "PUBLISHED",
            updatedAt: post.updated_at.toISOString(),
          }))}
        />
      </section>
    </main>
  );
}
