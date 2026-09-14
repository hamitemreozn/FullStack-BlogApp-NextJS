import {
  CreateBucketCommand,
  HeadBucketCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const required = [
  "S3_ENDPOINT",
  "S3_REGION",
  "S3_BUCKET",
  "S3_ACCESS_KEY",
  "S3_SECRET_KEY",
] as const;

for (const name of required) {
  if (!process.env[name]) {
    throw new Error(`${name} must be set before storage setup.`);
  }
}

const client = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});
const bucket = process.env.S3_BUCKET!;

try {
  await client.send(new HeadBucketCommand({ Bucket: bucket }));
  console.log(`Storage bucket ${bucket} already exists.`);
} catch {
  await client.send(new CreateBucketCommand({ Bucket: bucket }));
  console.log(`Created storage bucket ${bucket}.`);
}

console.log(
  "Bucket is private. Local CORS is configured by Docker's MINIO_API_CORS_ALLOW_ORIGIN setting.",
);
