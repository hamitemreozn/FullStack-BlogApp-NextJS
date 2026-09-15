"use client";

import { FormEvent, useState } from "react";

import { authClient } from "@/lib/auth-client";

export function PasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const currentPassword = String(form.get("currentPassword") ?? "");
    const newPassword = String(form.get("newPassword") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    if (newPassword.length < 12) {
      setMessage("Yeni parola en az 12 karakter olmalı.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("Yeni parola ve tekrarı eşleşmiyor.");
      return;
    }

    setIsSaving(true);
    setMessage(null);
    const result = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });
    setIsSaving(false);

    if (result.error) {
      setMessage("Parola güncellenemedi. Mevcut parolanızı kontrol edin.");
      return;
    }

    formElement.reset();
    setMessage("Parola güncellendi; diğer açık oturumlar kapatıldı.");
  }

  return (
    <form className="form-stack" onSubmit={changePassword}>
      <label className="field">
        Mevcut parola
        <input
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
      <label className="field">
        Yeni parola
        <input
          name="newPassword"
          type="password"
          autoComplete="new-password"
          minLength={12}
          maxLength={128}
          required
        />
      </label>
      <label className="field">
        Yeni parolayı tekrar yazın
        <input
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={12}
          maxLength={128}
          required
        />
      </label>
      <button className="primary-button" disabled={isSaving}>
        {isSaving ? "Güncelleniyor…" : "Parolayı güncelle"}
      </button>
      {message ? (
        <p className="notice" role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
