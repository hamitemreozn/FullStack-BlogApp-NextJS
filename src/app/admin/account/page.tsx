import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { PasswordForm } from "../password-form";
import { auth } from "@/lib/auth";

export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") redirect("/admin/login");

  return (
    <main className="page-shell">
      <section className="admin-card">
        <p className="eyebrow">Hesap güvenliği</p>
        <h1>Parolanızı güncelleyin</h1>
        <p className="notice">
          Yeni parolanız en az 12 karakter olmalı. Değişiklik, açık olan diğer
          oturumları kapatır.
        </p>
        <PasswordForm />
      </section>
    </main>
  );
}
