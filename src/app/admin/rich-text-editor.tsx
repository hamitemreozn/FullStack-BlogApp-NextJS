"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { JSONContent } from "@tiptap/core";

type RichTextEditorProps = {
  initialContent: unknown;
  onChange: (content: JSONContent) => void;
};

export function RichTextEditor({
  initialContent,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        code: false,
        codeBlock: false,
        heading: { levels: [2, 3] },
        horizontalRule: false,
        strike: false,
      }),
    ],
    content: initialContent as JSONContent,
    immediatelyRender: false,
    editorProps: { attributes: { class: "rich-text-input" } },
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getJSON()),
  });

  if (!editor)
    return <div className="rich-text-loading">Editör hazırlanıyor…</div>;

  return (
    <div className="rich-text-editor">
      <div className="editor-toolbar" aria-label="Metin biçimlendirme">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-label="Kalın metin"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-label="İtalik metin"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          Başlık
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          Alt başlık
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Liste
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Alıntı
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          aria-label="Geri al"
        >
          ↶
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          aria-label="Yinele"
        >
          ↷
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
