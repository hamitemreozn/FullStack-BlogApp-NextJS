import Link from "next/link";
export default function NotFound() {
  return (
    <main className="page-shell">
      <div className="empty-state">
        Aradığınız yazı bulunamadı. <Link href="/">Ana sayfaya dön</Link>
      </div>
    </main>
  );
}
