import Image from "next/image";
import Link from "next/link";
import styles from "./home.module.css";
import { JournalFilters } from "./journal-filters";
import { database } from "@/lib/database";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams: Promise<{
    category?: string | string[];
    page?: string | string[];
    q?: string | string[];
  }>;
};

const pageSize = 9;

export default async function HomePage({ searchParams }: HomePageProps) {
  const parameters = await searchParams;
  const query = typeof parameters.q === "string" ? parameters.q.trim() : "";
  const category =
    typeof parameters.category === "string" ? parameters.category : "";
  const requestedPage =
    typeof parameters.page === "string" ? Number(parameters.page) : 1;
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  let postsQuery = database
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
    .where("posts.published_at", "<=", new Date());

  if (category) postsQuery = postsQuery.where("categories.slug", "=", category);
  if (query) {
    const term = `%${query}%`;
    postsQuery = postsQuery.where((expressionBuilder) =>
      expressionBuilder.or([
        expressionBuilder("posts.title", "ilike", term),
        expressionBuilder("posts.excerpt", "ilike", term),
      ]),
    );
  }

  const fetchedPosts = await postsQuery
    .orderBy("posts.published_at", "desc")
    .limit(pageSize + 1)
    .offset((page - 1) * pageSize)
    .execute();
  const hasNextPage = fetchedPosts.length > pageSize;
  const posts = fetchedPosts.slice(0, pageSize);
  const categories = await database
    .selectFrom("categories")
    .select(["slug", "title"])
    .orderBy("title")
    .execute();
  const pageHref = (targetPage: number) => {
    const nextParameters = new URLSearchParams();
    if (query) nextParameters.set("q", query);
    if (category) nextParameters.set("category", category);
    if (targetPage > 1) nextParameters.set("page", String(targetPage));
    const value = nextParameters.toString();
    return `/${value ? `?${value}` : ""}#yazilar`;
  };

  return (
    <main className={`${styles.homePage} page-shell`}>
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
        <JournalFilters
          categories={categories}
          initialCategory={category}
          initialQuery={query}
          key={`${query}:${category}`}
        />
        {posts.length ? (
          <>
            <div className="post-grid">
              {posts.map((post) => (
                <Link
                  className="post-card"
                  href={`/posts/${post.slug}`}
                  key={post.slug}
                >
                  <div className="post-cover-frame">
                    {post.cover_image_key ? (
                      <Image
                        className="post-cover"
                        src={`/api/media/${post.cover_image_key}`}
                        alt=""
                        width={640}
                        height={360}
                        unoptimized
                      />
                    ) : (
                      <span
                        className="post-cover-placeholder"
                        aria-hidden="true"
                      >
                        ✦
                      </span>
                    )}
                  </div>
                  <div className="post-card-copy">
                    <span className="meta">
                      {post.category_title ?? "Astroloji"}
                    </span>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
            {page > 1 || hasNextPage ? (
              <nav className="pagination" aria-label="Yazı sayfaları">
                {page > 1 ? (
                  <Link className="secondary-button" href={pageHref(page - 1)}>
                    Önceki
                  </Link>
                ) : (
                  <span />
                )}
                <span>{page}. sayfa</span>
                {hasNextPage ? (
                  <Link className="secondary-button" href={pageHref(page + 1)}>
                    Sonraki
                  </Link>
                ) : (
                  <span />
                )}
              </nav>
            ) : null}
          </>
        ) : (
          <div className="empty-state journal-empty">
            <span className="empty-star" aria-hidden="true">
              ✦
            </span>
            <h3>
              {query || category
                ? "Eşleşen yazı bulunamadı."
                : "İlk notlar hazırlanıyor."}
            </h3>
            <p>
              {query || category
                ? "Başka bir arama veya kategori deneyebilirsiniz."
                : "Gökyüzü hareketleri, ilişkiler ve kişisel döngüler üzerine yazılar yakında burada olacak."}
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
