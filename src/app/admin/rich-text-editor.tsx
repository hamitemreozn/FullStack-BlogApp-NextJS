"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { useState } from "react";
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
  const [, setToolbarVersion] = useState(0);
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
    onSelectionUpdate: () => setToolbarVersion((version) => version + 1),
  });

  if (!editor)
    return <div className="rich-text-loading">Editör hazırlanıyor…</div>;

  return (
    <div className="rich-text-editor">
      <div className="editor-toolbar" aria-label="Metin biçimlendirme">
        <button
          type="button"
          className={editor.isActive("bold") ? "is-active" : undefined}
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-label="Kalın metin"
          aria-pressed={editor.isActive("bold")}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          className={editor.isActive("italic") ? "is-active" : undefined}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-label="İtalik metin"
          aria-pressed={editor.isActive("italic")}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          className={
            editor.isActive("heading", { level: 2 }) ? "is-active" : undefined
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          aria-pressed={editor.isActive("heading", { level: 2 })}
        >
          Başlık
        </button>
        <button
          type="button"
          className={
            editor.isActive("heading", { level: 3 }) ? "is-active" : undefined
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          aria-pressed={editor.isActive("heading", { level: 3 })}
        >
          Alt başlık
        </button>
        <button
          type="button"
          className={editor.isActive("bulletList") ? "is-active" : undefined}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          aria-pressed={editor.isActive("bulletList")}
        >
          Liste
        </button>
        <button
          type="button"
          className={editor.isActive("blockquote") ? "is-active" : undefined}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          aria-pressed={editor.isActive("blockquote")}
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
      <p className="editor-hint">
        Metni seçip araç çubuğundan biçimlendirebilirsiniz. Sağ tık yalnızca
        tarayıcının bağlam menüsünü açar; içeriği değiştirmez.
      </p>
    </div>
  );
}
