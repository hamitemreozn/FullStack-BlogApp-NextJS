import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { LogoutButton } from "./logout-button";
import { ContentForms } from "./content-forms";
import { auth } from "@/lib/auth";
import { database } from "@/lib/database";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    redirect("/admin/login");
  }

  const categories = await database
    .selectFrom("categories")
    .select(["id", "slug", "title"])
    .orderBy("title")
    .execute();

  return (
    <main className="page-shell">
      <section className="admin-card">
        <p className="eyebrow">Yönetim</p>
        <h1>Hoş geldin, {session.user.name}</h1>
        <p className="notice">
          Kimlik doğrulama ve rol kontrolü aktif. Yalnızca admin kullanıcıları
          içerik oluşturabilir.
        </p>
        <ContentForms categories={categories} />
        <LogoutButton />
      </section>
    </main>
  );
}
