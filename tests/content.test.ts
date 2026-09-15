import { describe, expect, it } from "vitest";

import {
  createDocument,
  isMeaningfulRichTextDocument,
  normalizeRichTextDocument,
  postInputSchema,
  richTextToPlainText,
  slugify,
} from "../src/lib/content";

describe("content security", () => {
  it("normalizes the supported editor document and preserves readable text", () => {
    const document = {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Başlık" }],
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Güvenli ", marks: [{ type: "bold" }] },
            { type: "text", text: "metin" },
          ],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Madde" }],
                },
              ],
            },
          ],
        },
      ],
    };

    const normalized = isMeaningfulRichTextDocument(document);
    expect(normalized).not.toBeNull();
    expect(richTextToPlainText(normalized!)).toContain("Güvenli metin");
  });

  it("rejects raw HTML-like, link and unknown editor nodes", () => {
    const maliciousMark = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Tıkla",
              marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }],
            },
          ],
        },
      ],
    };
    const unknownNode = {
      type: "doc",
      content: [
        { type: "image", attrs: { src: "https://example.test/image" } },
      ],
    };
    const malformedRootListItem = {
      type: "doc",
      content: [{ type: "listItem", content: [] }],
    };

    expect(normalizeRichTextDocument(maliciousMark)).toBeNull();
    expect(normalizeRichTextDocument(unknownNode)).toBeNull();
    expect(normalizeRichTextDocument(malformedRootListItem)).toBeNull();
  });

  it("rejects empty documents and creates a compatible plain-text document", () => {
    expect(
      isMeaningfulRichTextDocument({
        type: "doc",
        content: [{ type: "paragraph" }],
      }),
    ).toBeNull();
    expect(
      isMeaningfulRichTextDocument(createDocument("İlk güvenli yazı")),
    ).not.toBeNull();
    expect(normalizeRichTextDocument(createDocument(""))).toEqual({
      type: "doc",
      content: [{ type: "paragraph" }],
    });
  });

  it("creates Turkish-safe slugs", () => {
    expect(slugify("Gökyüzü & İlişkiler")).toBe("gokyuzu-iliskiler");
  });

  it("accepts an ISO publication time and rejects an invalid planned publish time", () => {
    const basePost = {
      title: "Planlı yayın",
      slug: "planli-yayin",
      excerpt: "",
      content: createDocument("Güvenli içerik"),
      categoryId: null,
      coverImageKey: null,
      publish: true,
    };

    expect(
      postInputSchema.safeParse({
        ...basePost,
        publishedAt: "2026-12-20T09:00:00.000Z",
      }).success,
    ).toBe(true);
    expect(
      postInputSchema.safeParse({ ...basePost, publishedAt: "yarın" }).success,
    ).toBe(false);
  });
});
