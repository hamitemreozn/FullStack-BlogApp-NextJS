import { NextResponse } from "next/server";

import { hasTrustedOrigin, requireAdmin } from "@/lib/admin-api";
import { database } from "@/lib/database";
import {
  createImageDownload,
  discardImage,
  verifyOwnedImage,
} from "@/lib/storage";

type UploadPreviewContext = { params: Promise<{ key: string[] }> };

export async function GET(request: Request, context: UploadPreviewContext) {
  const session = await requireAdmin(request.headers);
  const key = (await context.params).key.join("/");
  if (!session || !(await verifyOwnedImage(session.user.id, key))) {
    return new Response(null, { status: 404 });
  }

  return NextResponse.redirect(await createImageDownload(key));
}

export async function DELETE(request: Request, context: UploadPreviewContext) {
  if (!hasTrustedOrigin(request))
    return Response.json(
      { message: "Geçersiz istek kaynağı." },
      { status: 403 },
    );

  const session = await requireAdmin(request.headers);
  const key = (await context.params).key.join("/");
  if (!session || !(await verifyOwnedImage(session.user.id, key)))
    return Response.json({ message: "Görsel bulunamadı." }, { status: 404 });

  const referencedPost = await database
    .selectFrom("posts")
    .select("id")
    .where("cover_image_key", "=", key)
    .executeTakeFirst();
  if (referencedPost)
    return Response.json(
      { message: "Bu görsel artık bir yazıya bağlı; silinemez." },
      { status: 409 },
    );

  await discardImage(key);
  return new Response(null, { status: 204 });
}
