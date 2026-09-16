import { z } from "zod";

import { hasTrustedOrigin, requireAdmin } from "@/lib/admin-api";
import { database } from "@/lib/database";

const commentIdSchema = z.string().uuid();
const moderationSchema = z.object({ status: z.enum(["APPROVED", "REJECTED"]) });
type CommentRouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: CommentRouteContext) {
  if (!hasTrustedOrigin(request))
    return Response.json(
      { message: "Geçersiz istek kaynağı." },
      { status: 403 },
    );
  if (!(await requireAdmin(request.headers)))
    return Response.json(
      { message: "Yönetici yetkisi gerekli." },
      { status: 401 },
    );

  const id = commentIdSchema.safeParse((await context.params).id);
  const moderation = moderationSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!id.success || !moderation.success)
    return Response.json(
      { message: "Geçersiz yorum işlemi." },
      { status: 400 },
    );

  const updated = await database
    .updateTable("comments")
    .set({ status: moderation.data.status, updated_at: new Date() })
    .where("id", "=", id.data)
    .returning("id")
    .executeTakeFirst();
  if (!updated)
    return Response.json({ message: "Yorum bulunamadı." }, { status: 404 });

  return Response.json({ id: updated.id, status: moderation.data.status });
}

export async function DELETE(request: Request, context: CommentRouteContext) {
  if (!hasTrustedOrigin(request))
    return Response.json(
      { message: "Geçersiz istek kaynağı." },
      { status: 403 },
    );
  if (!(await requireAdmin(request.headers)))
    return Response.json(
      { message: "Yönetici yetkisi gerekli." },
      { status: 401 },
    );

  const id = commentIdSchema.safeParse((await context.params).id);
  if (!id.success)
    return Response.json(
      { message: "Geçersiz yorum kimliği." },
      { status: 400 },
    );

  const deleted = await database
    .deleteFrom("comments")
    .where("id", "=", id.data)
    .returning("id")
    .executeTakeFirst();
  if (!deleted)
    return Response.json({ message: "Yorum bulunamadı." }, { status: 404 });

  return new Response(null, { status: 204 });
}
