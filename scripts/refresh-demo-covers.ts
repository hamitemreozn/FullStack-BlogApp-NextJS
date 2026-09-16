import { randomUUID } from "node:crypto";

import {
  DeleteObjectCommand,
  PutObjectCommand,
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

const covers = [
  {
    slug: "demo-yeniayla-niyetlere-yer-acmak",
    sourceUrl:
      "https://images.pexels.com/photos/13201098/pexels-photo-13201098.jpeg?auto=compress&cs=tinysrgb&fm=jpg&w=1600",
  },
  {
    slug: "demo-ay-isiginda-duygulari-dinlemek",
    sourceUrl:
      "https://images.pexels.com/photos/32212173/pexels-photo-32212173.jpeg?auto=compress&cs=tinysrgb&fm=jpg&w=1600",
  },
  {
    slug: "demo-venusle-yakinligin-dili",
    sourceUrl:
      "https://images.pexels.com/photos/27459460/pexels-photo-27459460.jpeg?auto=compress&cs=tinysrgb&fm=jpg&w=1600",
  },
  {
    slug: "demo-mars-enerjisini-yonetmek",
    sourceUrl:
      "https://images.pexels.com/photos/16002195/pexels-photo-16002195.jpeg?auto=compress&cs=tinysrgb&fm=jpg&w=1600",
  },
  {
    slug: "demo-terazi-mevsiminde-denge",
    sourceUrl:
      "https://images.pexels.com/photos/4644813/pexels-photo-4644813.jpeg?auto=compress&cs=tinysrgb&fm=jpg&w=1600",
  },
  {
    slug: "demo-sabah-gokyuzune-bakmak",
    sourceUrl:
      "https://images.pexels.com/photos/32888482/pexels-photo-32888482.jpeg?auto=compress&cs=tinysrgb&fm=jpg&w=1600",
  },
  {
    slug: "demo-merkuru-duyabilmek",
    sourceUrl:
      "https://images.pexels.com/photos/27810186/pexels-photo-27810186.jpeg?auto=compress&cs=tinysrgb&fm=jpg&w=1600",
  },
  {
    slug: "demo-yengec-burcunda-ev-hissi",
    sourceUrl:
      "https://images.pexels.com/photos/5153555/pexels-photo-5153555.jpeg?auto=compress&cs=tinysrgb&fm=jpg&w=1600",
  },
  {
    slug: "demo-iliskide-alan-acmak",
    sourceUrl:
      "https://images.pexels.com/photos/5052131/pexels-photo-5052131.jpeg?auto=compress&cs=tinysrgb&fm=jpg&w=1600",
  },
  {
    slug: "demo-dolunayda-tamamlanma",
    sourceUrl:
      "https://images.pexels.com/photos/8049405/pexels-photo-8049405.jpeg?auto=compress&cs=tinysrgb&fm=jpg&w=1600",
  },
  {
    slug: "demo-yavaslamak-icin-uc-isaret",
    sourceUrl:
      "https://images.pexels.com/photos/33967643/pexels-photo-33967643.jpeg?auto=compress&cs=tinysrgb&fm=jpg&w=1600",
  },
  {
    slug: "demo-kova-burcunun-gelecek-sorusu",
    sourceUrl:
      "https://images.pexels.com/photos/5626273/pexels-photo-5626273.jpeg?auto=compress&cs=tinysrgb&fm=jpg&w=1600",
  },
  {
    slug: "demo-jupiterin-genisleten-sorusu",
    sourceUrl:
      "https://images.pexels.com/photos/18507016/pexels-photo-18507016.jpeg?auto=compress&cs=tinysrgb&fm=jpg&w=1600",
  },
  {
    slug: "demo-sevgi-dillerini-fark-etmek",
    sourceUrl:
      "https://images.pexels.com/photos/7736056/pexels-photo-7736056.jpeg?auto=compress&cs=tinysrgb&fm=jpg&w=1600",
  },
  {
    slug: "demo-haftanin-gokyuzu-notlari",
    sourceUrl:
      "https://images.unsplash.com/photo-1672857663219-0de23c859504?auto=format&fit=crop&fm=jpg&q=80&w=1600",
  },
] as const;

const maxImageSizeBytes = 5 * 1024 * 1024;
const bucket = process.env.S3_BUCKET!;
const database = new Client({ connectionString: process.env.DATABASE_URL });
const storage = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

async function downloadImage(url: string) {
  const response = await fetch(url, {
    headers: { "User-Agent": "AstrologyBlogApp demo seed" },
  });
  const bytes = new Uint8Array(await response.arrayBuffer());

  if (
    !response.ok ||
    !response.headers.get("content-type")?.includes("image")
  ) {
    throw new Error(`Görsel indirilemedi: ${url}`);
  }
  if (!bytes.length || bytes.length > maxImageSizeBytes) {
    throw new Error(`Görsel boyutu geçersiz: ${url}`);
  }

  return bytes;
}

await database.connect();

try {
  const demoPosts = await database.query<{
    id: string;
    slug: string;
    author_id: string;
    cover_image_key: string | null;
  }>(
    "SELECT id, slug, author_id, cover_image_key FROM posts WHERE slug LIKE 'demo-%'",
  );
  const postsBySlug = new Map(demoPosts.rows.map((post) => [post.slug, post]));

  let updated = 0;
  for (const cover of covers) {
    const post = postsBySlug.get(cover.slug);
    if (!post) continue;

    const image = await downloadImage(cover.sourceUrl);
    const coverImageKey = `posts/${post.author_id}/${randomUUID()}.jpg`;
    await storage.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: coverImageKey,
        Body: image,
        ContentType: "image/jpeg",
      }),
    );

    try {
      await database.query(
        "UPDATE posts SET cover_image_key = $1, updated_at = now() WHERE id = $2",
        [coverImageKey, post.id],
      );
      updated += 1;
    } catch (error) {
      await storage.send(
        new DeleteObjectCommand({ Bucket: bucket, Key: coverImageKey }),
      );
      throw error;
    }

    if (post.cover_image_key) {
      const references = await database.query<{ id: string }>(
        "SELECT id FROM posts WHERE cover_image_key = $1 LIMIT 1",
        [post.cover_image_key],
      );
      if (!references.rowCount) {
        await storage.send(
          new DeleteObjectCommand({
            Bucket: bucket,
            Key: post.cover_image_key,
          }),
        );
      }
    }
  }

  console.log(`Demo covers refreshed: ${updated} post updated.`);
} finally {
  await database.end();
}
