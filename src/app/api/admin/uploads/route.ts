import { NextResponse } from "next/server";
import { z } from "zod";

import { hasTrustedOrigin, requireAdmin } from "@/lib/admin-api";
import {
  createImageUpload,
  isAllowedImageContentType,
  maxImageSizeBytes,
} from "@/lib/storage";

const uploadSchema = z.object({
  fileName: z.string().min(1).max(255),
  contentType: z.string(),
  contentLength: z.number().int().positive().max(maxImageSizeBytes),
});

export async function POST(request: Request) {
  if (!hasTrustedOrigin(request)) {
    return NextResponse.json(
      { error: "Geçersiz istek kaynağı." },
      { status: 403 },
    );
  }

  const session = await requireAdmin(request.headers);
  if (!session) {
    return NextResponse.json(
      { error: "Yönetici yetkisi gerekli." },
      { status: 401 },
    );
  }

  const parsed = uploadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !isAllowedImageContentType(parsed.data.contentType)) {
    return NextResponse.json(
      {
        error:
          "Yalnızca en fazla 5 MB boyutunda JPG, PNG veya WebP yüklenebilir.",
      },
      { status: 400 },
    );
  }

  const upload = await createImageUpload(
    session.user.id,
    parsed.data.contentType,
  );
  return NextResponse.json(upload, { status: 201 });
}
