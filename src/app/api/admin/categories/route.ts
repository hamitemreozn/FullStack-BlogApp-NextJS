import { database } from "@/lib/database";
import { categoryInputSchema } from "@/lib/content";
import { hasTrustedOrigin, requireAdmin } from "@/lib/admin-api";

export async function POST(request: Request) {
  if (!hasTrustedOrigin(request))
    return Response.json({ message: "Invalid origin" }, { status: 403 });
  if (!(await requireAdmin(request.headers)))
    return Response.json(
      { message: "Authentication required" },
      { status: 401 },
    );

  const parsed = categoryInputSchema.safeParse(await request.json());
  if (!parsed.success)
    return Response.json(
      { message: "Invalid category input" },
      { status: 400 },
    );

  try {
    const category = await database
      .insertInto("categories")
      .values(parsed.data)
      .returning(["id", "slug", "title"])
      .executeTakeFirstOrThrow();
    return Response.json(category, { status: 201 });
  } catch {
    return Response.json(
      { message: "This category slug is already in use." },
      { status: 409 },
    );
  }
}
