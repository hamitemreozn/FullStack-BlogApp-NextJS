'use client';
import Link from 'next/link';
import styles from './authLinks.module.css';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';

const AuthLinks = () => {
    const [open, setOpen] = useState(false);

    const { status } = useSession();
    return (
        <>
            {status === 'unauthenticated' ? (
                <Link href="/login" className={`${styles.gizliYaz}`}>
                    Giriş
                </Link>
            ) : (
                <>
                    <Link href="/write" className={styles.gizliYaz}>
                        Yaz
                    </Link>
                    <span
                        className={`${styles.link} ${styles.logout}`}
                        onClick={signOut}
                    >
                        Çıkış
                    </span>
                </>
            )}
            <div className={styles.burger} onClick={() => setOpen(!open)}>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
            </div>
            {open && (
                <div className={styles.responsiveMenu}>
                    <Link href="/">Anasayfa</Link>
                    <Link href="/contact">Danışmanlıklar</Link>
                    {status === 'notauthenticated' ? (
                        <Link href="/login">Login</Link>
                    ) : (
                        <>
                            {/* <Link href="/write" className={styles.gizliYaz}>
                                Yaz
                            </Link> */}
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default AuthLinks;
