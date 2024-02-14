import React from 'react';
import styles from './footer.module.css';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
    return (
        <div className={styles.container}>
            <div className={styles.info}>
                <div className={styles.logo}>
                    <Image
                        src="/icon.png"
                        alt="astroloji blog"
                        width={50}
                        height={50}
                    />
                    <h1 className={styles.logoText}>murat ipek</h1>
                </div>
                <p className={styles.desc}>
                    <b>Astroloji, meteoroloji gibidir!</b> Geçmiş verileri,
                    günümüz gökyüzüyle karşılaştırıp gelecek için öngörüde
                    bulunur.
                </p>
                <div className={styles.icons}>
                    <a
                        href="https://www.facebook.com/mr.muratipek"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Image
                            src="/facebook.png"
                            alt="facebook"
                            width={18}
                            height={18}
                        />
                    </a>
                    <a
                        href="https://www.instagram.com/mr.ipek/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Image
                            src="/instagram.png"
                            alt="instagram"
                            width={18}
                            height={18}
                        />
                    </a>
                    <a
                        href="https://www.youtube.com/@muratipekastroloji"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Image
                            src="/youtube.png"
                            alt="youtube"
                            width={18}
                            height={18}
                        />
                    </a>
                    <a
                        href="https://wa.me/905353377929"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Image
                            className={styles.whatsappLogo}
                            src="/whatsapp.png"
                            alt="whatsapp"
                            width={18}
                            height={18}
                        />
                    </a>
                </div>
            </div>
            <div className={styles.links}>
                <div className={styles.list}>
                    <span className={styles.listTitle}>Bağlantı</span>
                    <Link href="/">Anasayfa</Link>
                    {/* <Link href="/">Blog</Link>
                    <Link href="/">About</Link> */}
                    <Link href="/contact">İletişim</Link>
                </div>
                {/* <div className={styles.list}>
                    <span className={styles.listTitle}>Tags</span>
                    <Link href="/">Style</Link>
                    <Link href="/">Rektifikasyon</Link>
                    <Link href="/">Coding</Link>
                    <Link href="/">Travel</Link>
                </div> */}
                <div className={styles.list}>
                    <span className={styles.listTitle}>Sosyal Medya</span>
                    <Link
                        href="https://www.facebook.com/mr.muratipek"
                        target="_blank"
                    >
                        Facebook
                    </Link>
                    <Link
                        href="https://www.instagram.com/mr.ipek/"
                        target="_blank"
                    >
                        Instagram
                    </Link>
                    <Link href="https://wa.me/905353377929" target="_blank">
                        WhatsApp
                    </Link>
                    <Link
                        href="https://www.youtube.com/@muratipekastroloji"
                        target="_blank"
                    >
                        Youtube
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Footer;
