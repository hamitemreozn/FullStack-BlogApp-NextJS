import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { LoginForm } from "./login-form";
import { auth } from "@/lib/auth";

export default async function AdminLoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user.role === "admin") redirect("/admin");

  return (
    <main className="page-shell">
      <LoginForm />
    </main>
  );
}
