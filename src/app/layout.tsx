import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: siteName,
    template: "%s | Murat İpek Astroloji",
  },
  description: siteDescription,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName,
    title: siteName,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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
              <Link className="nav-admin" href="/admin">
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
