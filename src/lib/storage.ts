import "server-only";

import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { env } from "@/lib/env";
import type { StoredImageSummary } from "@/lib/media-audit";
import {
  hasExpectedImageSignature,
  type AllowedImageContentType,
} from "@/lib/image-validation";

export const maxImageSizeBytes = 5 * 1024 * 1024;

export {
  findUnreferencedImages,
  type StoredImageSummary,
} from "@/lib/media-audit";

const imageExtensions = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

export type { AllowedImageContentType } from "@/lib/image-validation";

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

export async function verifyOwnedImage(userId: string, key: string) {
  if (!key.startsWith(`posts/${userId}/`)) return false;

  try {
    const metadata = await storage.send(
      new HeadObjectCommand({ Bucket: env.S3_BUCKET, Key: key }),
    );
    if (
      !metadata.ContentType ||
      !isAllowedImageContentType(metadata.ContentType) ||
      !metadata.ContentLength ||
      metadata.ContentLength > maxImageSizeBytes
    )
      return false;

    const object = await storage.send(
      new GetObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: key,
        Range: "bytes=0-31",
      }),
    );
    const bytes = await object.Body?.transformToByteArray();
    return (
      bytes !== undefined &&
      hasExpectedImageSignature(metadata.ContentType, bytes)
    );
  } catch {
    return false;
  }
}

export async function discardImage(key: string) {
  await storage.send(
    new DeleteObjectCommand({ Bucket: env.S3_BUCKET, Key: key }),
  );
}

export async function listImagesForUser(userId: string) {
  const images: StoredImageSummary[] = [];
  const prefix = `posts/${userId}/`;
  let continuationToken: string | undefined;

  do {
    const page = await storage.send(
      new ListObjectsV2Command({
        Bucket: env.S3_BUCKET,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      }),
    );
    for (const object of page.Contents ?? []) {
      if (!object.Key || object.Size === undefined) continue;
      images.push({
        key: object.Key,
        lastModified: object.LastModified ?? null,
        size: object.Size,
      });
    }
    continuationToken = page.IsTruncated
      ? page.NextContinuationToken
      : undefined;
  } while (continuationToken);

  return images;
}
