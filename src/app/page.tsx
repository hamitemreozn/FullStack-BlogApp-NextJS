import Image from "next/image";
import Link from "next/link";
import { database } from "@/lib/database";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await database
    .selectFrom("posts")
    .leftJoin("categories", "categories.id", "posts.category_id")
    .select([
      "posts.slug",
      "posts.title",
      "posts.excerpt",
      "posts.cover_image_key",
      "categories.title as category_title",
    ])
    .where("posts.status", "=", "PUBLISHED")
    .orderBy("posts.published_at", "desc")
    .limit(9)
    .execute();
  return (
    <main className="page-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Yıldızların izinde</p>
          <h1>Gökyüzünün ritmini kendi hikâyenizde keşfedin.</h1>
          <p>
            Astroloji yazıları, danışmanlıklar ve kişisel farkındalık için sade
            bir alan.
          </p>
        </div>
      </section>
      <section aria-labelledby="posts-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Blog</p>
            <h2 id="posts-heading">Son yazılar</h2>
          </div>
          <p>
            {posts.length ? `${posts.length} yayın` : "Yeni yayınlar yakında"}
          </p>
        </div>
        {posts.length ? (
          <div className="post-grid">
            {posts.map((post) => (
              <Link
                className="post-card"
                href={`/posts/${post.slug}`}
                key={post.slug}
              >
                {post.cover_image_key ? (
                  <Image
                    className="post-cover"
                    src={`/api/media/${post.cover_image_key}`}
                    alt=""
                    width={640}
                    height={360}
                  />
                ) : null}
                <span className="meta">
                  {post.category_title ?? "Astroloji"}
                </span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="empty-state">
            İlk yazı yönetim panelinden güvenle yayımlanabilir. Eski
            uygulamadaki örnek/Lorem Ipsum kartları bu yüzden gösterilmiyor.
          </p>
        )}
      </section>
    </main>
  );
}
