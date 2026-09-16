import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-api";
import { createImageDownload, verifyOwnedImage } from "@/lib/storage";

type UploadPreviewContext = { params: Promise<{ key: string[] }> };

export async function GET(request: Request, context: UploadPreviewContext) {
  const session = await requireAdmin(request.headers);
  const key = (await context.params).key.join("/");
  if (!session || !(await verifyOwnedImage(session.user.id, key))) {
    return new Response(null, { status: 404 });
  }

  return NextResponse.redirect(await createImageDownload(key));
}
