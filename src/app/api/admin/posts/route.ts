import { database } from "@/lib/database";
import { isMeaningfulRichTextDocument, postInputSchema } from "@/lib/content";
import { hasTrustedOrigin, requireAdmin } from "@/lib/admin-api";
import { verifyOwnedImage } from "@/lib/storage";

export async function POST(request: Request) {
  if (!hasTrustedOrigin(request))
    return Response.json({ message: "Invalid origin" }, { status: 403 });
  const session = await requireAdmin(request.headers);
  if (!session)
    return Response.json(
      { message: "Authentication required" },
      { status: 401 },
    );

  const parsed = postInputSchema.safeParse(await request.json());
  if (!parsed.success)
    return Response.json({ message: "Invalid post input" }, { status: 400 });

  const { content, categoryId, coverImageKey, publish, ...post } = parsed.data;
  const document = isMeaningfulRichTextDocument(content);
  if (!document)
    return Response.json(
      { message: "Yazı içeriği geçersiz." },
      { status: 400 },
    );
  if (
    coverImageKey &&
    !(await verifyOwnedImage(session.user.id, coverImageKey))
  )
    return Response.json(
      { message: "Kapak görseli doğrulanamadı. Lütfen yeniden yükleyin." },
      { status: 400 },
    );

  try {
    const created = await database
      .insertInto("posts")
      .values({
        ...post,
        category_id: categoryId,
        cover_image_key: coverImageKey,
        author_id: session.user.id,
        content: document,
        status: publish ? "PUBLISHED" : "DRAFT",
        published_at: publish ? new Date() : null,
      })
      .returning(["id", "slug", "status"])
      .executeTakeFirstOrThrow();

    return Response.json(created, { status: 201 });
  } catch {
    return Response.json(
      { message: "This post slug is already in use." },
      { status: 409 },
    );
  }
}
