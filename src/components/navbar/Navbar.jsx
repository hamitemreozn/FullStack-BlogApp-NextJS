import React from 'react';
import styles from './navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import AuthLinks from '../authLinks/AuthLinks';
import ThemeToggle from '../themeToggle/ThemeToggle';

const Navbar = () => {
    return (
        <div className={styles.container}>
            <div className={styles.social}>
                <a
                    href="https://www.facebook.com/mr.muratipek"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        src="/facebook.png"
                        alt="facebook"
                        width={24}
                        height={24}
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
                        width={24}
                        height={24}
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
                        width={24}
                        height={24}
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
                        width={24}
                        height={24}
                    />
                </a>
            </div>
            <div className={styles.logo}>
                <Image src={'/icon.png'} alt="icon" width={40} height={40} />
                <div className={styles.logoTitle}>Murat İpek</div>
            </div>
            <div className={styles.links}>
                <ThemeToggle />
                <Link
                    href="https://muratipekastroloji.com"
                    className={styles.link}
                >
                    Anasayfa
                </Link>
                <Link href="/contact" className={styles.link}>
                    Danışmanlıklar
                </Link>
                {/* <Link href="/" className={styles.link}>
                    Hakkımda
                </Link> */}
                <AuthLinks />
            </div>
        </div>
    );
};

export default Navbar;
