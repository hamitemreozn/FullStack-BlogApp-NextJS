"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { slugify } from "@/lib/content";

type Category = { id: string; slug: string; title: string };
type ManagedPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  categoryId: string | null;
  coverImageKey: string | null;
  published: boolean;
  updatedAt: string;
};
type UploadForm = { url: string; fields: Record<string, string>; key: string };

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxImageSizeBytes = 5 * 1024 * 1024;

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

  async function createCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "");
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, slug: slugify(title) }),
      });
      if (!response.ok) throw new Error("Kategori kaydedilemedi.");
      event.currentTarget.reset();
      setMessage("Kategori kaydedildi.");
      router.refresh();
    } catch {
      setMessage(
        "Kategori kaydedilemedi. Başlığın benzersiz olduğundan emin ol.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function savePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "");
    const coverImage = form.get("coverImage");
    setIsSaving(true);
    setMessage(null);

    try {
      const coverImageKey =
        coverImage instanceof File && coverImage.size > 0
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
            body: String(form.get("body") ?? ""),
            categoryId: String(form.get("categoryId") ?? "") || null,
            coverImageKey,
            publish: form.get("publish") === "on",
          }),
        },
      );
      if (!response.ok) throw new Error("Yazı kaydedilemedi.");
      setEditingPost(null);
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
      if (editingPost?.id === post.id) setEditingPost(null);
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
            onClick={() => setEditingPost(null)}
          >
            Yeni yazı
          </button>
        </div>
        <div className="post-manager-list">
          {posts.length ? (
            posts.map((post) => (
              <article className="post-manager-item" key={post.id}>
                <div>
                  <span
                    className={`status-badge ${post.published ? "is-published" : "is-draft"}`}
                  >
                    {post.published ? "Yayında" : "Taslak"}
                  </span>
                  <h3>{post.title}</h3>
                  <p>
                    Son değişiklik:{" "}
                    {new Date(post.updatedAt).toLocaleDateString("tr-TR")}
                  </p>
                </div>
                <div className="item-actions">
                  <button
                    className="text-action"
                    type="button"
                    onClick={() => setEditingPost(post)}
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
            ))
          ) : (
            <p className="manager-empty">
              Henüz bir yazı yok. İlk yazınızı aşağıdaki formdan oluşturun.
            </p>
          )}
        </div>
      </section>
      <form
        className="form-stack content-editor"
        key={editingPost?.id ?? "new"}
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
              onClick={() => setEditingPost(null)}
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
        <label className="field">
          Kapak görseli (JPG, PNG veya WebP; en fazla 5 MB)
          <input
            name="coverImage"
            type="file"
            accept="image/jpeg,image/png,image/webp"
          />
          {editingPost?.coverImageKey ? (
            <span className="field-hint">
              Yeni görsel seçilmezse mevcut kapak korunur.
            </span>
          ) : null}
        </label>
        <label className="field">
          İçerik
          <textarea
            name="body"
            rows={12}
            required
            maxLength={20_000}
            defaultValue={editingPost?.body}
          />
        </label>
        <label className="checkbox-field">
          <input
            name="publish"
            type="checkbox"
            defaultChecked={editingPost?.published}
          />{" "}
          Hemen yayımla
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
