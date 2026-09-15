"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@astrology.local");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await authClient.signIn.email({ email, password });
    setIsSubmitting(false);

    if (result.error) {
      setError("E-posta adresi veya parola doğru değil.");
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <section className="admin-card" aria-labelledby="admin-login-heading">
      <p className="eyebrow">Yönetim</p>
      <h1 id="admin-login-heading">Güvenli giriş</h1>
      <p className="notice">
        Bu alan yalnızca site yönetimi içindir. Google/GitHub veya eski müşteri
        hesabı kullanılmaz.
      </p>
      <form className="form-stack" onSubmit={onSubmit}>
        <label className="field">
          E-posta
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="field">
          Parola
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}
        <button
          className="primary-button"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Giriş yapılıyor…" : "Giriş yap"}
        </button>
      </form>
    </section>
  );
}
