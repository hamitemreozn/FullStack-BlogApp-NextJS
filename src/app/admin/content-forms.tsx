"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { createDocument, slugify } from "@/lib/content";
import { RichTextEditor } from "./rich-text-editor";

type Category = { id: string; slug: string; title: string };
type ManagedPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: unknown;
  categoryId: string | null;
  coverImageKey: string | null;
  published: boolean;
  publishedAt: string | null;
  scheduled: boolean;
  updatedAt: string;
};
type UploadForm = { url: string; fields: Record<string, string>; key: string };

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxImageSizeBytes = 5 * 1024 * 1024;

function toDateTimeLocal(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

async function uploadCoverImage(file: File) {
  if (!allowedImageTypes.has(file.type) || file.size > maxImageSizeBytes) {
    throw new Error("Kapak görseli en fazla 5 MB JPG, PNG veya WebP olmalı.");
  }

  const permission = await fetch("/api/admin/uploads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type,
      contentLength: file.size,
    }),
  });
  if (!permission.ok)
    throw new Error("Görsel için güvenli yükleme izni oluşturulamadı.");

  const upload = (await permission.json()) as UploadForm;
  const formData = new FormData();
  Object.entries(upload.fields).forEach(([name, value]) =>
    formData.append(name, value),
  );
  formData.append("file", file);

  const response = await fetch(upload.url, { method: "POST", body: formData });
  if (!response.ok) throw new Error("Görsel depolama alanına yüklenemedi.");

  return upload.key;
}

async function responseError(response: Response, fallback: string) {
  const payload = (await response.json().catch(() => null)) as {
    error?: string;
    message?: string;
  } | null;
  return payload?.message ?? payload?.error ?? fallback;
}

export function ContentForms({
  categories,
  posts,
}: {
  categories: Category[];
  posts: ManagedPost[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editingPost, setEditingPost] = useState<ManagedPost | null>(null);
  const [editorContent, setEditorContent] = useState<unknown>(() =>
    createDocument(""),
  );
  const [editorVersion, setEditorVersion] = useState(0);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const coverPreviewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (coverPreviewUrlRef.current)
        URL.revokeObjectURL(coverPreviewUrlRef.current);
    };
  }, []);

  function selectCoverImage(file: File | null) {
    if (coverPreviewUrlRef.current)
      URL.revokeObjectURL(coverPreviewUrlRef.current);
    const previewUrl = file ? URL.createObjectURL(file) : null;
    coverPreviewUrlRef.current = previewUrl;
    setCoverImage(file);
    setCoverPreviewUrl(previewUrl);
  }

  function selectPost(post: ManagedPost | null) {
    setEditingPost(post);
    setEditorContent(post?.content ?? createDocument(""));
    selectCoverImage(null);
    setEditorVersion((version) => version + 1);
  }

  async function createCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const title = String(form.get("title") ?? "");
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, slug: slugify(title) }),
      });
      if (!response.ok)
        throw new Error(
          await responseError(response, "Kategori kaydedilemedi."),
        );
      formElement.reset();
      setMessage("Kategori kaydedildi.");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Kategori kaydedilemedi.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function savePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "");
    const scheduledValue = String(form.get("publishedAt") ?? "");
    const scheduledDate = scheduledValue ? new Date(scheduledValue) : null;
    if (scheduledDate && Number.isNaN(scheduledDate.getTime())) {
      setMessage("Yayın zamanı geçerli bir tarih olmalı.");
      return;
    }
    const publishedAt = scheduledDate?.toISOString() ?? null;
    setIsSaving(true);
    setMessage(null);

    try {
      const coverImageKey =
        coverImage && coverImage.size > 0
          ? await uploadCoverImage(coverImage)
          : (editingPost?.coverImageKey ?? null);
      const response = await fetch(
        editingPost ? `/api/admin/posts/${editingPost.id}` : "/api/admin/posts",
        {
          method: editingPost ? "PATCH" : "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            title,
            slug: slugify(title),
            excerpt: String(form.get("excerpt") ?? ""),
            content: editorContent,
            categoryId: String(form.get("categoryId") ?? "") || null,
            coverImageKey,
            publish: form.get("publish") === "on",
            publishedAt,
          }),
        },
      );
      if (!response.ok)
        throw new Error(await responseError(response, "Yazı kaydedilemedi."));
      selectPost(null);
      setMessage(editingPost ? "Yazı güncellendi." : "Yazı kaydedildi.");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Yazı kaydedilemedi.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function deletePost(post: ManagedPost) {
    if (!window.confirm(`“${post.title}” yazısı kalıcı olarak silinsin mi?`))
      return;
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/posts/${post.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Yazı silinemedi.");
      if (editingPost?.id === post.id) selectPost(null);
      setMessage("Yazı silindi.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Yazı silinemedi.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="content-manager">
      <section className="content-manager-section">
        <div className="manager-heading">
          <div>
            <p className="eyebrow">İçerik</p>
            <h2>Yazılar</h2>
          </div>
          <button
            className="secondary-button"
            type="button"
            onClick={() => selectPost(null)}
          >
            Yeni yazı
          </button>
        </div>
        <div className="post-manager-list">
          {posts.length ? (
            posts.map((post) => {
              return (
                <article className="post-manager-item" key={post.id}>
                  <div>
                    <span
                      className={`status-badge ${post.published && !post.scheduled ? "is-published" : "is-draft"}`}
                    >
                      {post.scheduled
                        ? "Planlandı"
                        : post.published
                          ? "Yayında"
                          : "Taslak"}
                    </span>
                    <h3>{post.title}</h3>
                    <p>
                      {post.scheduled ? "Yayın zamanı" : "Son değişiklik"}:{" "}
                      {new Date(
                        post.scheduled ? post.publishedAt! : post.updatedAt,
                      ).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                  <div className="item-actions">
                    <button
                      className="text-action"
                      type="button"
                      onClick={() => selectPost(post)}
                    >
                      Düzenle
                    </button>
                    <button
                      className="danger-action"
                      type="button"
                      disabled={isSaving}
                      onClick={() => deletePost(post)}
                    >
                      Sil
                    </button>
                  </div>
                </article>
              );
            })
          ) : (
            <p className="manager-empty">
              Henüz bir yazı yok. İlk yazınızı aşağıdaki formdan oluşturun.
            </p>
          )}
        </div>
      </section>
      <form
        className="form-stack content-editor"
        key={editorVersion}
        onSubmit={savePost}
      >
        <div className="manager-heading">
          <div>
            <p className="eyebrow">
              {editingPost ? "Düzenleme" : "Yeni içerik"}
            </p>
            <h2>{editingPost ? editingPost.title : "Yeni yazı"}</h2>
          </div>
          {editingPost ? (
            <button
              className="text-action"
              type="button"
              onClick={() => selectPost(null)}
            >
              İptal
            </button>
          ) : null}
        </div>
        <label className="field">
          Başlık
          <input
            name="title"
            required
            maxLength={200}
            defaultValue={editingPost?.title}
          />
        </label>
        <label className="field">
          Özet
          <input
            name="excerpt"
            maxLength={500}
            defaultValue={editingPost?.excerpt}
          />
        </label>
        <label className="field">
          Kategori
          <select
            name="categoryId"
            defaultValue={editingPost?.categoryId ?? ""}
          >
            <option value="">Kategorisiz</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </label>
        <div className="field">
          <span>Kapak görseli (JPG, PNG veya WebP; en fazla 5 MB)</span>
          <input
            className="visually-hidden-file-input"
            id="cover-image"
            name="coverImage"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) =>
              selectCoverImage(event.currentTarget.files?.[0] ?? null)
            }
          />
          <label className="file-picker" htmlFor="cover-image">
            <span className="file-picker-button">Görsel seç</span>
            <span className="file-picker-name">
              {coverImage?.name ??
                (editingPost?.coverImageKey
                  ? "Mevcut kapak korunuyor"
                  : "Henüz dosya seçilmedi")}
            </span>
          </label>
          {coverPreviewUrl ? (
            <div
              className="cover-preview"
              role="img"
              aria-label="Seçilen kapak görseli önizlemesi"
              style={{ backgroundImage: `url(${coverPreviewUrl})` }}
            />
          ) : null}
          {editingPost?.coverImageKey && !coverImage ? (
            <span className="field-hint">
              Yeni görsel seçilmezse mevcut kapak korunur.
            </span>
          ) : null}
        </div>
        <div className="field">
          <span>İçerik</span>
          <RichTextEditor
            key={editorVersion}
            initialContent={editorContent}
            onChange={setEditorContent}
          />
        </div>
        <label className="checkbox-field">
          <input
            name="publish"
            type="checkbox"
            defaultChecked={editingPost?.published}
          />{" "}
          Yayına al
        </label>
        <label className="field">
          Yayın zamanı (boş bırakılırsa hemen)
          <input
            name="publishedAt"
            type="datetime-local"
            defaultValue={toDateTimeLocal(editingPost?.publishedAt)}
          />
          <span className="field-hint">
            Gelecek bir tarih seçerseniz yazı o ana kadar kamuya açık olmaz.
          </span>
        </label>
        <button className="primary-button" disabled={isSaving}>
          {isSaving
            ? "Kaydediliyor…"
            : editingPost
              ? "Değişiklikleri kaydet"
              : "Yazıyı kaydet"}
        </button>
      </form>
      <form className="form-stack category-form" onSubmit={createCategory}>
        <div className="manager-heading">
          <div>
            <p className="eyebrow">Yapı</p>
            <h2>Kategori ekle</h2>
          </div>
        </div>
        <label className="field">
          Başlık
          <input name="title" required maxLength={100} />
        </label>
        <button className="secondary-button" disabled={isSaving}>
          Kategori kaydet
        </button>
      </form>
      {message ? (
        <p className="notice" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
