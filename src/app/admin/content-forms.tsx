"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { slugify } from "@/lib/content";

type Category = { id: string; slug: string; title: string };
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

export function ContentForms({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  async function createPost(event: FormEvent<HTMLFormElement>) {
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
          : null;
      const response = await fetch("/api/admin/posts", {
        method: "POST",
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
      });
      if (!response.ok) throw new Error("Yazı kaydedilemedi.");
      event.currentTarget.reset();
      setMessage("Yazı kaydedildi.");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Yazı kaydedilemedi.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="form-stack">
      <form className="form-stack" onSubmit={createCategory}>
        <h2>Kategori ekle</h2>
        <label className="field">
          Başlık
          <input name="title" required maxLength={100} />
        </label>
        <button className="primary-button" disabled={isSaving}>
          Kategori kaydet
        </button>
      </form>
      <form className="form-stack" onSubmit={createPost}>
        <h2>Yeni yazı</h2>
        <label className="field">
          Başlık
          <input name="title" required maxLength={200} />
        </label>
        <label className="field">
          Özet
          <input name="excerpt" maxLength={500} />
        </label>
        <label className="field">
          Kategori
          <select name="categoryId" defaultValue="">
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
        </label>
        <label className="field">
          İçerik
          <textarea name="body" rows={10} required maxLength={20_000} />
        </label>
        <label>
          <input name="publish" type="checkbox" /> Hemen yayımla
        </label>
        <button className="primary-button" disabled={isSaving}>
          {isSaving ? "Kaydediliyor…" : "Yazıyı kaydet"}
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
