import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="page-shell">
      <article className="contact-card">
        <p className="eyebrow">Danışmanlıklar</p>
        <h1>İletişim ve randevu</h1>
        <p className="notice">
          Danışmanlık talebinizi WhatsApp üzerinden iletebilirsiniz. Görüşme
          bağlantısı danışmanlık öncesinde paylaşılır.
        </p>
        <h2>Ödeme bilgileri</h2>
        <ul>
          <li>Banka: VakıfBank</li>
          <li>Hesap sahibi: Murat İpek</li>
          <li>Hesap numarası: 00158007297829528</li>
          <li>IBAN: TR940001500158007297829528</li>
        </ul>
        <Link
          className="primary-button"
          href="https://wa.me/905353377929"
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp ile iletişime geç
        </Link>
      </article>
    </main>
  );
}
