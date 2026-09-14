"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function CommentForm({ slug }: { slug: string }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setIsSending(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/posts/${slug}/comments`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          authorName: String(form.get("authorName") ?? ""),
          body: String(form.get("body") ?? ""),
          website: String(form.get("website") ?? ""),
        }),
      });
      const result = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      if (!response.ok)
        throw new Error(result?.message ?? "Yorum gönderilemedi.");
      event.currentTarget.reset();
      setMessage("Yorumunuz alındı. Yayınlanmadan önce onaylanır.");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Yorum gönderilemedi.",
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form className="comment-form" onSubmit={submitComment}>
      <label className="field">
        Adınız
        <input
          name="authorName"
          required
          minLength={2}
          maxLength={80}
          autoComplete="name"
        />
      </label>
      <label className="honeypot" aria-hidden="true">
        Web sitesi
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="field">
        Yorumunuz
        <textarea
          name="body"
          rows={5}
          required
          minLength={2}
          maxLength={2_000}
        />
      </label>
      <button className="primary-button" disabled={isSending}>
        {isSending ? "Gönderiliyor…" : "Yorumu gönder"}
      </button>
      {message ? (
        <p className="notice" role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
