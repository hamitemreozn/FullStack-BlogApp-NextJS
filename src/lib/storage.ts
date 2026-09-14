import "server-only";

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { env } from "@/lib/env";

export const maxImageSizeBytes = 5 * 1024 * 1024;

const imageExtensions = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

export type AllowedImageContentType = keyof typeof imageExtensions;

export const storage = new S3Client({
  region: env.S3_REGION,
  endpoint: env.S3_ENDPOINT,
  forcePathStyle: env.S3_FORCE_PATH_STYLE === "true",
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
});

export function isAllowedImageContentType(
  value: string,
): value is AllowedImageContentType {
  return value in imageExtensions;
}

export async function createImageUpload(
  userId: string,
  contentType: AllowedImageContentType,
) {
  const extension = imageExtensions[contentType];
  const key = `posts/${userId}/${crypto.randomUUID()}.${extension}`;
  const upload = await createPresignedPost(storage, {
    Bucket: env.S3_BUCKET,
    Key: key,
    Expires: 60,
    Conditions: [
      ["content-length-range", 1, maxImageSizeBytes],
      ["eq", "$Content-Type", contentType],
    ],
    Fields: {
      "Content-Type": contentType,
    },
  });

  return { key, ...upload };
}

export async function createImageDownload(key: string) {
  return getSignedUrl(
    storage,
    new GetObjectCommand({ Bucket: env.S3_BUCKET, Key: key }),
    {
      expiresIn: 600,
    },
  );
}
