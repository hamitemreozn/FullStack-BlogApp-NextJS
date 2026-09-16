"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ManagedComment = {
  id: string;
  authorName: string;
  body: string;
  postTitle: string;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
};

export function CommentModeration({
  comments,
}: {
  comments: ManagedComment[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  async function moderate(id: string, status: "APPROVED" | "REJECTED") {
    setProcessingId(id);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/comments/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Yorum güncellenemedi.");
      setMessage(
        status === "APPROVED"
          ? "Yorum yayınlandı."
          : "Yorum yayından kaldırıldı.",
      );
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Yorum güncellenemedi.",
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Bu yorum kalıcı olarak silinsin mi?")) return;
    setProcessingId(id);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/comments/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Yorum silinemedi.");
      setMessage("Yorum silindi.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Yorum silinemedi.");
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <section className="content-manager-section moderation-section">
      <div className="manager-heading">
        <div>
          <p className="eyebrow">Moderasyon</p>
          <h2>Yorumlar</h2>
        </div>
        <span className="status-badge is-draft">{comments.length}</span>
      </div>
      {comments.length ? (
        <div className="moderation-list">
          {comments.map((comment) => (
            <article className="moderation-item" key={comment.id}>
              <div>
                <p>
                  <strong>{comment.authorName}</strong> · {comment.postTitle}
                </p>
                <span
                  className={`status-badge ${comment.status === "APPROVED" ? "is-published" : "is-draft"}`}
                >
                  {comment.status === "APPROVED"
                    ? "Yayında"
                    : comment.status === "REJECTED"
                      ? "Reddedildi"
                      : "Bekliyor"}
                </span>
                <time dateTime={comment.createdAt}>
                  {new Date(comment.createdAt).toLocaleString("tr-TR")}
                </time>
                <blockquote>{comment.body}</blockquote>
              </div>
              <div className="item-actions">
                {comment.status !== "APPROVED" ? (
                  <button
                    className="text-action"
                    type="button"
                    disabled={processingId === comment.id}
                    onClick={() => moderate(comment.id, "APPROVED")}
                  >
                    Onayla
                  </button>
                ) : null}
                {comment.status !== "REJECTED" ? (
                  <button
                    className="danger-action"
                    type="button"
                    disabled={processingId === comment.id}
                    onClick={() => moderate(comment.id, "REJECTED")}
                  >
                    {comment.status === "APPROVED"
                      ? "Yayından kaldır"
                      : "Reddet"}
                  </button>
                ) : null}
                <button
                  className="danger-action"
                  type="button"
                  disabled={processingId === comment.id}
                  onClick={() => remove(comment.id)}
                >
                  Sil
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="manager-empty">Yorum bulunamadı.</p>
      )}
      {message ? (
        <p className="notice" role="status">
          {message}
        </p>
      ) : null}
    </section>
  );
}
