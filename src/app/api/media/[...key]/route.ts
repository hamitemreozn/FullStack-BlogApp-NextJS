import { NextResponse } from "next/server";

import { database } from "@/lib/database";
import { createImageDownload } from "@/lib/storage";

type MediaRouteProps = { params: Promise<{ key: string[] }> };

export async function GET(_: Request, { params }: MediaRouteProps) {
  const key = (await params).key.join("/");
  const publishedPost = await database
    .selectFrom("posts")
    .select("id")
    .where("cover_image_key", "=", key)
    .where("status", "=", "PUBLISHED")
    .where("published_at", "<=", new Date())
    .executeTakeFirst();

  if (!publishedPost) {
    return NextResponse.json({ error: "Görsel bulunamadı." }, { status: 404 });
  }

  const url = await createImageDownload(key);
  return NextResponse.redirect(url, {
    headers: { "Cache-Control": "public, max-age=600" },
  });
}
