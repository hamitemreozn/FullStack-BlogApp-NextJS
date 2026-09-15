import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Danışmanlık",
  description:
    "Astroloji danışmanlığı hakkında bilgi alın ve görüşme talep edin.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="page-shell">
      <section className="contact-hero">
        <div>
          <p className="eyebrow">Danışmanlıklar</p>
          <h1>Haritanızı, kendi hikâyenizin merkezinden okuyalım.</h1>
          <p>
            Görüşme talebinizi WhatsApp üzerinden iletebilirsiniz. Size uygun
            zaman ve görüşme bağlantısı danışmanlık öncesinde paylaşılır.
          </p>
          <Link
            className="primary-button"
            href="https://wa.me/905353377929"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp ile iletişime geç <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <aside className="contact-quote">
          <span aria-hidden="true">✦</span>
          <p>
            “Astroloji, kaderi söylemekten çok; kendine yaklaşmanın dilidir.”
          </p>
        </aside>
      </section>
      <section className="contact-grid">
        <article className="payment-card">
          <p className="eyebrow">Ödeme bilgileri</p>
          <h2>Görüşme öncesi</h2>
          <dl>
            <div>
              <dt>Banka</dt>
              <dd>VakıfBank</dd>
            </div>
            <div>
              <dt>Hesap sahibi</dt>
              <dd>Murat İpek</dd>
            </div>
            <div>
              <dt>Hesap numarası</dt>
              <dd>00158007297829528</dd>
            </div>
            <div>
              <dt>IBAN</dt>
              <dd>TR940001500158007297829528</dd>
            </div>
          </dl>
        </article>
        <article className="steps-card">
          <p className="eyebrow">Süreç</p>
          <h2>Nasıl ilerliyoruz?</h2>
          <ol>
            <li>
              <span>01</span>
              <p>
                <strong>Mesajınızı gönderin</strong>Görüşmek istediğiniz konuyu
                kısaca paylaşın.
              </p>
            </li>
            <li>
              <span>02</span>
              <p>
                <strong>Zamanı netleştirelim</strong>Size uygun gün ve saat için
                dönüş yapalım.
              </p>
            </li>
            <li>
              <span>03</span>
              <p>
                <strong>Görüşmenize katılın</strong>Bağlantınız danışmanlık
                öncesinde iletilir.
              </p>
            </li>
          </ol>
        </article>
      </section>
    </main>
  );
}
