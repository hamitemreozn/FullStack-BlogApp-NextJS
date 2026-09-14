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
              <span>
                <strong>Murat İpek</strong>
                <small>Astroloji & Danışmanlık</small>
              </span>
            </Link>
            <nav className="main-nav" aria-label="Ana menü">
              <Link href="/">Ana sayfa</Link>
              <Link href="/#yazilar">Yazılar</Link>
              <Link href="/contact">Danışmanlık</Link>
              <Link className="nav-admin" href="/admin/login">
                Yönetim
              </Link>
            </nav>
          </header>
          {children}
          <footer className="site-footer">
            <div>
              <p className="footer-wordmark">Murat İpek</p>
              <p>Astroloji & kişisel farkındalık</p>
            </div>
            <p>© {new Date().getFullYear()} · Tüm hakları saklıdır.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
