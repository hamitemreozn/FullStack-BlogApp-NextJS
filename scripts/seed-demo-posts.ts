import { randomUUID } from "node:crypto";

import {
  CopyObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Client } from "pg";

const requiredEnvironment = [
  "DATABASE_URL",
  "S3_ENDPOINT",
  "S3_REGION",
  "S3_BUCKET",
  "S3_ACCESS_KEY",
  "S3_SECRET_KEY",
] as const;

for (const name of requiredEnvironment) {
  if (!process.env[name])
    throw new Error(`${name} must be set before seeding.`);
}

const database = new Client({ connectionString: process.env.DATABASE_URL });
const bucket = process.env.S3_BUCKET!;
const storage = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

const categories = [
  { slug: "gunluk", title: "Günlük" },
  { slug: "ay-donguleri", title: "Ay Döngüleri" },
  { slug: "iliskiler", title: "İlişkiler" },
  { slug: "burc-rehberi", title: "Burç Rehberi" },
  { slug: "gokyuzu-notlari", title: "Gökyüzü Notları" },
] as const;

const posts = [
  {
    slug: "demo-yeniayla-niyetlere-yer-acmak",
    title: "Yeniayla niyetlere yer açmak",
    categorySlug: "ay-donguleri",
    excerpt:
      "Yeniayın sakin başlangıç enerjisini gündelik hayata nazikçe taşımak için kısa bir not.",
    lead: "Yeniay, büyük kararlar vermekten çok içimizde büyümek isteyen şeye sessizce alan açmayı hatırlatır.",
    points: [
      "Tek bir niyet seçin.",
      "Takvimde kendinize küçük bir alan bırakın.",
      "İlk adımı yeterince küçük tutun.",
    ],
  },
  {
    slug: "demo-ay-isiginda-duygulari-dinlemek",
    title: "Ay ışığında duyguları dinlemek",
    categorySlug: "gunluk",
    excerpt:
      "Duyguların hızını azaltıp, onlara isim vermek için akşamdan kalma bir pratik.",
    lead: "Yoğun bir günün sonunda duygularımız çoğu zaman cevap değil, dikkat ister.",
    points: [
      "Telefonu on dakika uzağa koyun.",
      "Bedende kalan hissi fark edin.",
      "Yargılamadan bir cümle yazın.",
    ],
  },
  {
    slug: "demo-venusle-yakinligin-dili",
    title: "Venüs’le yakınlığın dili",
    categorySlug: "iliskiler",
    excerpt:
      "İlişkide sevildiğimizi nasıl anladığımızı düşünmek için Venüs’ten küçük bir pencere.",
    lead: "Yakınlık, herkes için aynı jestle kurulmaz; bazen bir soru, bazen de güvenli bir sessizliktir.",
    points: [
      "İhtiyacınızı açık bir cümleyle söyleyin.",
      "Karşınızdakinin dilini merak edin.",
      "Küçük jestleri görünür kılın.",
    ],
  },
  {
    slug: "demo-mars-enerjisini-yonetmek",
    title: "Mars enerjisini yönetmek",
    categorySlug: "gokyuzu-notlari",
    excerpt:
      "Harekete geçme isteği yükseldiğinde acele etmeden yön tayin etmenin yolları.",
    lead: "Mars harekete çağırır; yönünü netleştirmek ise enerjinin dağılmasını önler.",
    points: [
      "Önce tek işi belirleyin.",
      "Bedeninizi hareket ettirin.",
      "Tepki vermeden önce kısa bir ara verin.",
    ],
  },
  {
    slug: "demo-terazi-mevsiminde-denge",
    title: "Terazi mevsiminde denge",
    categorySlug: "burc-rehberi",
    excerpt:
      "Dengeyi mükemmellik olarak değil, tekrar tekrar kurulan bir ilişki olarak okumak.",
    lead: "Denge sabit bir nokta değil; ihtiyaçlarımız değiştikçe yeniden kurduğumuz canlı bir ilişkidir.",
    points: [
      "Günün iki önemli önceliğini seçin.",
      "Bir hayıra alan açın.",
      "Kararları birlikte tartın.",
    ],
  },
  {
    slug: "demo-sabah-gokyuzune-bakmak",
    title: "Sabah gökyüzüne bakmak",
    categorySlug: "gunluk",
    excerpt:
      "Güne başlamadan önce yön duygusunu toplamak için bir dakikalık gözlem önerisi.",
    lead: "Sabahın ışığı, günün temposuna girmeden önce kendimize dönmek için küçük bir eşik sunar.",
    points: [
      "Pencereden üç derin nefes alın.",
      "Gökyüzündeki rengi fark edin.",
      "Bugünün tonunu tek kelimeyle adlandırın.",
    ],
  },
  {
    slug: "demo-merkuru-duyabilmek",
    title: "Merkür’ü duyabilmek",
    categorySlug: "gokyuzu-notlari",
    excerpt:
      "Konuşmak, dinlemek ve düşünmek arasındaki ritmi fark etmek için kısa bir egzersiz.",
    lead: "İyi iletişim çoğu zaman daha çok sözden değil, doğru yerde bırakılan boşluktan doğar.",
    points: [
      "Soruyu bitirmeden cevap vermeyin.",
      "Not alarak dinlemeyi deneyin.",
      "Mesajınızı bir kez sadeleştirin.",
    ],
  },
  {
    slug: "demo-yengec-burcunda-ev-hissi",
    title: "Yengeç burcunda ev hissi",
    categorySlug: "burc-rehberi",
    excerpt:
      "Ev hissinin mekândan çok, kendimizi koruyabildiğimiz bağlarla ilişkisi üzerine.",
    lead: "Ev, her zaman bir adres değildir; bazen yanında kendin olabildiğin birinin sesidir.",
    points: [
      "Kendinizi rahatlatan ritüeli bulun.",
      "Yakın çevrenizle sınırları konuşun.",
      "Dinlenmeye yer ayırın.",
    ],
  },
  {
    slug: "demo-iliskide-alan-acmak",
    title: "İlişkide alan açmak",
    categorySlug: "iliskiler",
    excerpt:
      "Yakın kalırken bireysel alanı korumanın ilişkiye nasıl nefes aldırdığı üzerine.",
    lead: "İki kişinin yakınlığı, birbirinin alanına saygı duyabildiğinde daha dayanıklı hale gelir.",
    points: [
      "Kendi zamanınızı takvimde görünür kılın.",
      "Beklentiyi varsaymak yerine sorun.",
      "Birlikte ve ayrı keyif alanları oluşturun.",
    ],
  },
  {
    slug: "demo-dolunayda-tamamlanma",
    title: "Dolunayda tamamlanma",
    categorySlug: "ay-donguleri",
    excerpt:
      "Dolunayın görünür kıldığı sonuçları yargılamadan gözden geçirmek için sakin bir çerçeve.",
    lead: "Dolunay, biteni kapatmak kadar şimdiye kadar yürüdüğümüz yolu fark etmekle de ilgilidir.",
    points: [
      "Son haftayı not edin.",
      "Tamamlanan bir işi kutlayın.",
      "Gereksiz yükü bırakın.",
    ],
  },
  {
    slug: "demo-yavaslamak-icin-uc-isaret",
    title: "Yavaşlamak için üç işaret",
    categorySlug: "gunluk",
    excerpt:
      "Tempo yükseldiğinde bedenin ve zihnin verdiği küçük sinyalleri duymaya davet.",
    lead: "Yavaşlamak, geride kalmak değil; neye yetişmeye çalıştığımızı yeniden seçmektir.",
    points: [
      "Aynı cümleyi kaç kez okuduğunuzu fark edin.",
      "Omuzlarınızdaki gerginliği kontrol edin.",
      "Bir işi ertelemek için izin verin.",
    ],
  },
  {
    slug: "demo-kova-burcunun-gelecek-sorusu",
    title: "Kova burcunun gelecek sorusu",
    categorySlug: "burc-rehberi",
    excerpt:
      "Geleceğe bakarken kendi özgün yönümüzü korumak için Kova’dan bir düşünce deneyi.",
    lead: "Geleceği düşünmek, bugünü ihmal etmek değil; bugüne daha bilinçli bir yön vermektir.",
    points: [
      "Size ait fikri ayırt edin.",
      "Küçük bir deneme yapın.",
      "Toplulukla paylaşın.",
    ],
  },
  {
    slug: "demo-jupiterin-genisleten-sorusu",
    title: "Jüpiter’in genişleten sorusu",
    categorySlug: "gokyuzu-notlari",
    excerpt:
      "Büyüme isteğinin gerçekten bize ait olup olmadığını anlamaya yardımcı üç soru.",
    lead: "Genişlemek her zaman daha fazlasını yapmak değildir; bazen daha doğru olana yer vermektir.",
    points: [
      "Bu istek sizi besliyor mu?",
      "Neyi geride bırakmanız gerekiyor?",
      "İlk ölçülü adım nedir?",
    ],
  },
  {
    slug: "demo-sevgi-dillerini-fark-etmek",
    title: "Sevgi dillerini fark etmek",
    categorySlug: "iliskiler",
    excerpt:
      "İlişkilerde özenin hangi biçimlerde hissedildiğini konuşmaya açan küçük bir rehber.",
    lead: "Sevgi görünür olduğunda değil, karşılandığında bağ kurar.",
    points: [
      "Size iyi gelen davranışı söyleyin.",
      "Karşı tarafın çabasını sorun.",
      "Günlük küçük teşekkürler ekleyin.",
    ],
  },
  {
    slug: "demo-haftanin-gokyuzu-notlari",
    title: "Haftanın gökyüzü notları",
    categorySlug: "ay-donguleri",
    excerpt:
      "Haftaya başlamadan önce odağı toplamak ve ajandayı hafifletmek için kısa bir astroloji günlüğü.",
    lead: "Haftalık plan, her şeyi sığdırmak için değil; önem verdiğimiz şeye yer açmak için vardır.",
    points: [
      "Haftanın temasını seçin.",
      "Enerji isteyen işleri ayırın.",
      "Dinlenme alanını önce ekleyin.",
    ],
  },
] as const;

function createDocument(lead: string, points: readonly string[]) {
  const text = (value: string) => ({ type: "text" as const, text: value });

  return {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 2 },
        content: [text("Küçük bir gözlem")],
      },
      { type: "paragraph", content: [text(lead)] },
      {
        type: "blockquote",
        content: [
          {
            type: "paragraph",
            content: [
              text(
                "Bu yazı, arayüz ve içerik akışını denemek için oluşturulmuş demo veridir.",
              ),
            ],
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 3 },
        content: [text("Bugün deneyebilecekleriniz")],
      },
      {
        type: "bulletList",
        content: points.map((point) => ({
          type: "listItem",
          content: [{ type: "paragraph", content: [text(point)] }],
        })),
      },
    ],
  };
}

function copySourcePath(key: string) {
  return `${bucket}/${key.split("/").map(encodeURIComponent).join("/")}`;
}

await database.connect();

try {
  const source = await database.query<{
    author_id: string;
    cover_image_key: string;
  }>(`
    SELECT author_id, cover_image_key
    FROM posts
    WHERE cover_image_key IS NOT NULL
    ORDER BY created_at DESC
    LIMIT 1
  `);
  const sourceImage = source.rows[0];

  if (!sourceImage) {
    throw new Error(
      "Demo yazıları için önce en az bir kapak görseli yükleyin.",
    );
  }

  const categoryIds = new Map<string, string>();
  for (const category of categories) {
    const result = await database.query<{ id: string }>(
      `
        INSERT INTO categories (slug, title)
        VALUES ($1, $2)
        ON CONFLICT (slug) DO UPDATE
          SET title = EXCLUDED.title, updated_at = now()
        RETURNING id
      `,
      [category.slug, category.title],
    );
    categoryIds.set(category.slug, result.rows[0]!.id);
  }

  let created = 0;
  let skipped = 0;
  const now = Date.now();

  for (const [index, post] of posts.entries()) {
    const existing = await database.query<{ id: string }>(
      "SELECT id FROM posts WHERE slug = $1",
      [post.slug],
    );
    if (existing.rowCount) {
      skipped += 1;
      continue;
    }

    const coverImageKey = `posts/${sourceImage.author_id}/${randomUUID()}.jpg`;
    await storage.send(
      new CopyObjectCommand({
        Bucket: bucket,
        CopySource: copySourcePath(sourceImage.cover_image_key),
        Key: coverImageKey,
      }),
    );

    try {
      const publishedAt = new Date(now - (posts.length - index) * 86_400_000);
      await database.query(
        `
          INSERT INTO posts (
            slug, title, excerpt, content, cover_image_key, category_id,
            author_id, status, published_at
          )
          VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7, 'PUBLISHED', $8)
        `,
        [
          post.slug,
          post.title,
          post.excerpt,
          JSON.stringify(createDocument(post.lead, post.points)),
          coverImageKey,
          categoryIds.get(post.categorySlug),
          sourceImage.author_id,
          publishedAt,
        ],
      );
      created += 1;
    } catch (error) {
      await storage.send(
        new DeleteObjectCommand({ Bucket: bucket, Key: coverImageKey }),
      );
      throw error;
    }
  }

  console.log(
    `Demo seed complete: ${created} post created, ${skipped} skipped.`,
  );
} finally {
  await database.end();
}
