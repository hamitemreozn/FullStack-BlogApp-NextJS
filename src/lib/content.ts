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
  content: z.unknown(),
  categoryId: z.string().uuid().nullable(),
  coverImageKey: z
    .string()
    .regex(/^posts\/[^/]+\/[0-9a-f-]{36}\.(jpg|png|webp)$/)
    .nullable(),
  publish: z.boolean(),
  publishedAt: z.string().datetime({ offset: true }).nullable(),
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
    content: body
      ? [{ type: "paragraph", content: [{ type: "text", text: body }] }]
      : [{ type: "paragraph" }],
  };
}

type RichTextMark = { type: "bold" | "italic" };
export type RichTextNode =
  | { type: "text"; text: string; marks?: RichTextMark[] }
  | { type: "hardBreak" }
  | { type: "paragraph"; content?: RichTextNode[] }
  | { type: "heading"; attrs: { level: 2 | 3 }; content?: RichTextNode[] }
  | { type: "blockquote"; content: RichTextNode[] }
  | { type: "bulletList" | "orderedList"; content: RichTextNode[] }
  | { type: "listItem"; content: RichTextNode[] };
export type RichTextDocument = { type: "doc"; content: RichTextNode[] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeMarks(value: unknown): RichTextMark[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) return undefined;
  const marks = value.map((mark) => {
    if (
      !isRecord(mark) ||
      (mark.type !== "bold" && mark.type !== "italic") ||
      Object.keys(mark).some((key) => key !== "type")
    )
      return null;
    return { type: mark.type };
  });
  return marks.some((mark) => mark === null)
    ? undefined
    : (marks as RichTextMark[]);
}

function normalizeInlineNodes(value: unknown): RichTextNode[] | null {
  if (!Array.isArray(value)) return null;
  const nodes: RichTextNode[] = [];
  for (const node of value) {
    if (!isRecord(node)) return null;
    if (node.type === "hardBreak" && Object.keys(node).length === 1) {
      nodes.push({ type: "hardBreak" });
      continue;
    }
    if (
      node.type !== "text" ||
      typeof node.text !== "string" ||
      node.text.length > 20_000 ||
      Object.keys(node).some(
        (key) => key !== "type" && key !== "text" && key !== "marks",
      )
    )
      return null;
    const marks = normalizeMarks(node.marks);
    if (node.marks !== undefined && marks === undefined) return null;
    nodes.push(
      marks?.length
        ? { type: "text", text: node.text, marks }
        : { type: "text", text: node.text },
    );
  }
  return nodes;
}

function normalizeBlockNode(value: unknown): RichTextNode | null {
  if (!isRecord(value) || typeof value.type !== "string") return null;
  if (value.type === "paragraph") {
    if (Object.keys(value).some((key) => key !== "type" && key !== "content"))
      return null;
    const content =
      value.content === undefined ? [] : normalizeInlineNodes(value.content);
    return content === null
      ? null
      : content.length
        ? { type: "paragraph", content }
        : { type: "paragraph" };
  }
  if (value.type === "heading") {
    if (
      !isRecord(value.attrs) ||
      (value.attrs.level !== 2 && value.attrs.level !== 3) ||
      Object.keys(value.attrs).some((key) => key !== "level") ||
      Object.keys(value).some(
        (key) => key !== "type" && key !== "attrs" && key !== "content",
      )
    )
      return null;
    const content =
      value.content === undefined ? [] : normalizeInlineNodes(value.content);
    return content === null
      ? null
      : content.length
        ? { type: "heading", attrs: { level: value.attrs.level }, content }
        : { type: "heading", attrs: { level: value.attrs.level } };
  }
  if (
    value.type === "blockquote" ||
    value.type === "listItem" ||
    value.type === "bulletList" ||
    value.type === "orderedList"
  ) {
    if (
      Object.keys(value).some((key) => key !== "type" && key !== "content") ||
      !Array.isArray(value.content)
    )
      return null;
    const children = value.content.map(normalizeBlockNode);
    if (children.some((child) => child === null)) return null;
    const normalizedChildren = children as RichTextNode[];
    const validChildren =
      value.type === "blockquote"
        ? normalizedChildren.every(
            (child) => child.type === "paragraph" || child.type === "heading",
          )
        : value.type === "listItem"
          ? normalizedChildren.every(
              (child) =>
                child.type === "paragraph" ||
                child.type === "bulletList" ||
                child.type === "orderedList",
            )
          : normalizedChildren.every((child) => child.type === "listItem");
    if (!validChildren) return null;
    return { type: value.type, content: normalizedChildren };
  }
  return null;
}

export function normalizeRichTextDocument(
  value: unknown,
): RichTextDocument | null {
  if (
    !isRecord(value) ||
    value.type !== "doc" ||
    Object.keys(value).some((key) => key !== "type" && key !== "content") ||
    !Array.isArray(value.content)
  )
    return null;
  const nodes = value.content.map(normalizeBlockNode);
  if (nodes.some((node) => node === null)) return null;
  const normalizedNodes = nodes as RichTextNode[];
  if (
    !normalizedNodes.every(
      (node) =>
        node.type === "paragraph" ||
        node.type === "heading" ||
        node.type === "blockquote" ||
        node.type === "bulletList" ||
        node.type === "orderedList",
    )
  )
    return null;
  return { type: "doc", content: normalizedNodes };
}

export function richTextToPlainText(
  value: RichTextDocument | RichTextNode | unknown,
): string {
  if (!isRecord(value)) return "";
  if (value.type === "text" && typeof value.text === "string")
    return value.text;
  if (value.type === "hardBreak") return "\n";
  if (!Array.isArray(value.content)) return "";
  const separator =
    value.type === "doc" ||
    value.type === "blockquote" ||
    value.type === "bulletList" ||
    value.type === "orderedList" ||
    value.type === "listItem"
      ? "\n"
      : "";
  return value.content.map((node) => richTextToPlainText(node)).join(separator);
}

export function isMeaningfulRichTextDocument(value: unknown) {
  const document = normalizeRichTextDocument(value);
  return document &&
    richTextToPlainText(document).trim().length > 0 &&
    richTextToPlainText(document).length <= 20_000
    ? document
    : null;
}
