"use client";

import { useState } from "react";

type UnreferencedImage = {
  key: string;
  lastModified: string | null;
  size: number;
};

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

export function MediaAudit() {
  const [images, setImages] = useState<UnreferencedImage[] | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  async function scan() {
    setIsScanning(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/uploads");
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        images?: UnreferencedImage[];
      } | null;
      if (!response.ok)
        throw new Error(payload?.error ?? "Görseller taranamadı.");
      setImages(payload?.images ?? []);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Görseller taranamadı.",
      );
    } finally {
      setIsScanning(false);
    }
  }

  return (
    <section className="content-manager-section media-audit">
      <div className="manager-heading">
        <div>
          <p className="eyebrow">Depolama denetimi</p>
          <h2>Kullanılmayan görseller</h2>
        </div>
        <button
          className="secondary-button"
          disabled={isScanning}
          onClick={scan}
        >
          {isScanning ? "Taranıyor…" : "Görselleri tara"}
        </button>
      </div>
      <p className="field-hint">
        Bu ekran yalnızca yazıya bağlı olmayan yüklemeleri listeler; hiçbir
        dosya otomatik silinmez.
      </p>
      {message ? (
        <p className="notice" role="status">
          {message}
        </p>
      ) : null}
      {images ? (
        images.length ? (
          <ul className="media-audit-list">
            {images.map((image) => (
              <li key={image.key}>
                <code>{image.key}</code>
                <span>
                  {formatBytes(image.size)}
                  {image.lastModified
                    ? ` · ${new Date(image.lastModified).toLocaleDateString("tr-TR")}`
                    : ""}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="manager-empty">Sahipsiz görsel bulunmadı.</p>
        )
      ) : null}
    </section>
  );
}
