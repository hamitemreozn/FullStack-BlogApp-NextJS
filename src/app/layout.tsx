import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Murat İpek | Astroloji",
  description: "Astroloji yazıları ve danışmanlık bilgileri.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>
        <div className="site-shell">
          <header className="site-header">
            <Link className="brand" href="/" aria-label="Ana sayfa">
              <span className="brand-mark" aria-hidden="true">
                ✦
              </span>
              Murat İpek
            </Link>
            <nav className="main-nav" aria-label="Ana menü">
              <Link href="/">Yazılar</Link>
              <Link href="/contact">Danışmanlıklar</Link>
              <Link href="/admin/login">Yönetim</Link>
            </nav>
          </header>
          {children}
          <footer className="site-footer">
            © {new Date().getFullYear()} Murat İpek Astroloji
          </footer>
        </div>
      </body>
    </html>
  );
}
