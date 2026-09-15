import { z } from "zod";

import { hasTrustedOrigin, requireAdmin } from "@/lib/admin-api";
import { isMeaningfulRichTextDocument, postInputSchema } from "@/lib/content";
import { database } from "@/lib/database";
import { discardImage, verifyOwnedImage } from "@/lib/storage";

const postIdSchema = z.string().uuid();
type PostRouteContext = { params: Promise<{ id: string }> };

async function getAuthorizedPostId(
  request: Request,
  params: Promise<{ id: string }>,
) {
  if (!hasTrustedOrigin(request)) {
    return {
      error: Response.json(
        { message: "Geçersiz istek kaynağı." },
        { status: 403 },
      ),
    };
  }

  const session = await requireAdmin(request.headers);
  if (!session) {
    return {
      error: Response.json(
        { message: "Yönetici yetkisi gerekli." },
        { status: 401 },
      ),
    };
  }

  const parsedId = postIdSchema.safeParse((await params).id);
  if (!parsedId.success) {
    return {
      error: Response.json(
        { message: "Geçersiz yazı kimliği." },
        { status: 400 },
      ),
    };
  }

  return { id: parsedId.data, session };
}

export async function PATCH(request: Request, context: PostRouteContext) {
  const authorized = await getAuthorizedPostId(request, context.params);
  if ("error" in authorized) return authorized.error;

  const parsed = postInputSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return Response.json(
      { message: "Yazı alanlarını kontrol edin." },
      { status: 400 },
    );
  }

  const { content, categoryId, coverImageKey, publish, ...post } = parsed.data;
  const document = isMeaningfulRichTextDocument(content);
  if (!document) {
    return Response.json(
      { message: "Yazı içeriği geçersiz." },
      { status: 400 },
    );
  }
  if (
    coverImageKey &&
    !(await verifyOwnedImage(authorized.session.user.id, coverImageKey))
  ) {
    return Response.json(
      { message: "Kapak görseli doğrulanamadı. Lütfen yeniden yükleyin." },
      { status: 400 },
    );
  }
  const previous = await database
    .selectFrom("posts")
    .select("cover_image_key")
    .where("id", "=", authorized.id)
    .executeTakeFirst();
  if (!previous) {
    return Response.json({ message: "Yazı bulunamadı." }, { status: 404 });
  }
  try {
    const updated = await database
      .updateTable("posts")
      .set({
        ...post,
        category_id: categoryId,
        cover_image_key: coverImageKey,
        content: document,
        status: publish ? "PUBLISHED" : "DRAFT",
        published_at: publish ? new Date() : null,
        updated_at: new Date(),
      })
      .where("id", "=", authorized.id)
      .returning(["id", "slug", "status"])
      .executeTakeFirst();

    if (!updated) {
      return Response.json({ message: "Yazı bulunamadı." }, { status: 404 });
    }

    if (
      previous.cover_image_key &&
      previous.cover_image_key !== coverImageKey
    ) {
      discardImage(previous.cover_image_key).catch(console.error);
    }

    return Response.json(updated);
  } catch {
    return Response.json(
      { message: "Bu yazı bağlantısı zaten kullanılıyor." },
      { status: 409 },
    );
  }
}

export async function DELETE(request: Request, context: PostRouteContext) {
  const authorized = await getAuthorizedPostId(request, context.params);
  if ("error" in authorized) return authorized.error;

  const deleted = await database
    .deleteFrom("posts")
    .where("id", "=", authorized.id)
    .returning(["id", "cover_image_key"])
    .executeTakeFirst();

  if (!deleted) {
    return Response.json({ message: "Yazı bulunamadı." }, { status: 404 });
  }

  if (deleted.cover_image_key)
    discardImage(deleted.cover_image_key).catch(console.error);

  return new Response(null, { status: 204 });
}
