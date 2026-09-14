import { z } from "zod";

import { hasTrustedOrigin, requireAdmin } from "@/lib/admin-api";
import { createDocument, postInputSchema } from "@/lib/content";
import { database } from "@/lib/database";

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

  if (!(await requireAdmin(request.headers))) {
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

  return { id: parsedId.data };
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

  const { body, categoryId, coverImageKey, publish, ...post } = parsed.data;
  try {
    const updated = await database
      .updateTable("posts")
      .set({
        ...post,
        category_id: categoryId,
        cover_image_key: coverImageKey,
        content: createDocument(body),
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
    .returning("id")
    .executeTakeFirst();

  if (!deleted) {
    return Response.json({ message: "Yazı bulunamadı." }, { status: 404 });
  }

  return new Response(null, { status: 204 });
}
