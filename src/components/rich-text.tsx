import type { ReactNode } from "react";

import { normalizeRichTextDocument, type RichTextNode } from "@/lib/content";

function renderInline(nodes: RichTextNode[] | undefined): ReactNode {
  return nodes?.map((node, index) => {
    if (node.type === "hardBreak") return <br key={index} />;
    if (node.type !== "text") return null;
    let value: ReactNode = node.text;
    if (node.marks?.some((mark) => mark.type === "bold"))
      value = <strong>{value}</strong>;
    if (node.marks?.some((mark) => mark.type === "italic"))
      value = <em>{value}</em>;
    return <span key={index}>{value}</span>;
  });
}

function renderBlock(node: RichTextNode, index: number): ReactNode {
  if (node.type === "paragraph")
    return <p key={index}>{renderInline(node.content)}</p>;
  if (node.type === "heading")
    return node.attrs.level === 2 ? (
      <h2 key={index}>{renderInline(node.content)}</h2>
    ) : (
      <h3 key={index}>{renderInline(node.content)}</h3>
    );
  if (node.type === "blockquote")
    return <blockquote key={index}>{node.content.map(renderBlock)}</blockquote>;
  if (node.type === "bulletList")
    return <ul key={index}>{node.content.map(renderBlock)}</ul>;
  if (node.type === "orderedList")
    return <ol key={index}>{node.content.map(renderBlock)}</ol>;
  if (node.type === "listItem")
    return <li key={index}>{node.content.map(renderBlock)}</li>;
  return null;
}

export function RichText({ content }: { content: unknown }) {
  const document = normalizeRichTextDocument(content);
  if (!document) return null;
  return (
    <div className="rich-text-content">{document.content.map(renderBlock)}</div>
  );
}
