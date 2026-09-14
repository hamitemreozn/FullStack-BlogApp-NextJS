import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const categoryInputSchema = z.object({
  title: z.string().trim().min(1).max(100),
  slug: z.string().trim().regex(slugPattern).max(100),
});

export const postInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().regex(slugPattern).max(200),
  excerpt: z.string().trim().max(500),
  body: z.string().trim().min(1).max(20_000),
  categoryId: z.string().uuid().nullable(),
  coverImageKey: z
    .string()
    .regex(/^posts\/[^/]+\/[0-9a-f-]{36}\.(jpg|png|webp)$/)
    .nullable(),
  publish: z.boolean(),
});

export function slugify(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createDocument(body: string) {
  return {
    type: "doc",
    content: [{ type: "paragraph", content: [{ type: "text", text: body }] }],
  };
}
