"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PendingComment = {
  id: string;
  authorName: string;
  body: string;
  postTitle: string;
  createdAt: string;
};

export function CommentModeration({
  comments,
}: {
  comments: PendingComment[];
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
        status === "APPROVED" ? "Yorum yayınlandı." : "Yorum reddedildi.",
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

  return (
    <section className="content-manager-section moderation-section">
      <div className="manager-heading">
        <div>
          <p className="eyebrow">Moderasyon</p>
          <h2>Bekleyen yorumlar</h2>
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
                <time dateTime={comment.createdAt}>
                  {new Date(comment.createdAt).toLocaleString("tr-TR")}
                </time>
                <blockquote>{comment.body}</blockquote>
              </div>
              <div className="item-actions">
                <button
                  className="text-action"
                  type="button"
                  disabled={processingId === comment.id}
                  onClick={() => moderate(comment.id, "APPROVED")}
                >
                  Onayla
                </button>
                <button
                  className="danger-action"
                  type="button"
                  disabled={processingId === comment.id}
                  onClick={() => moderate(comment.id, "REJECTED")}
                >
                  Reddet
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="manager-empty">Onay bekleyen yorum yok.</p>
      )}
      {message ? (
        <p className="notice" role="status">
          {message}
        </p>
      ) : null}
    </section>
  );
}
