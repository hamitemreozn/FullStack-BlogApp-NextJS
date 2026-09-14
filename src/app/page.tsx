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
        <div className="hero-copy">
          <p className="eyebrow">Kişisel astroloji danışmanlığı</p>
          <h1>Gökyüzünün dili, hayatınızın pusulası.</h1>
          <p>
            Doğum haritanızın size anlattıklarını birlikte okuyalım;
            kararlarınıza daha net, daha sakin bir yerden yaklaşın.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="/contact">
              Danışmanlık talep et <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-button" href="#yazilar">
              Yazıları keşfet <span aria-hidden="true">↓</span>
            </Link>
          </div>
        </div>
        <div className="hero-portrait-wrap">
          <div className="hero-glow" aria-hidden="true" />
          <Image
            className="hero-portrait"
            src="/mainphoto.jpeg"
            alt="Murat İpek"
            width={838}
            height={816}
            priority
          />
          <p className="portrait-caption">
            Murat İpek <span>·</span> Astrolog
          </p>
        </div>
        <span className="hero-orbit orbit-one" aria-hidden="true" />
        <span className="hero-orbit orbit-two" aria-hidden="true" />
      </section>
      <section className="confidence-strip" aria-label="Danışmanlık yaklaşımı">
        <p>
          <span>01</span> Kişisel yorum
        </p>
        <p>
          <span>02</span> Online görüşme
        </p>
        <p>
          <span>03</span> Gizli & özenli yaklaşım
        </p>
      </section>
      <section
        className="journal-section"
        id="yazilar"
        aria-labelledby="posts-heading"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">Gökyüzü günlüğü</p>
            <h2 id="posts-heading">Düşünmek için bir alan</h2>
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
          <div className="empty-state journal-empty">
            <span className="empty-star" aria-hidden="true">
              ✦
            </span>
            <h3>İlk notlar hazırlanıyor.</h3>
            <p>
              Gökyüzü hareketleri, ilişkiler ve kişisel döngüler üzerine yazılar
              yakında burada olacak.
            </p>
          </div>
        )}
      </section>
      <section className="home-cta">
        <div>
          <p className="eyebrow">Kendi haritanıza yaklaşın</p>
          <h2>Sorularınıza gökyüzünün penceresinden bakın.</h2>
        </div>
        <Link className="light-button" href="/contact">
          Görüşme hakkında bilgi al <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </main>
  );
}
