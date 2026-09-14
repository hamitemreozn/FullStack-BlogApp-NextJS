import React from 'react';
import styles from './featured.module.css';
import Image from 'next/image';
import Link from 'next/link';

const Featured = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                <b className={styles.boldDesc}>
                    Astroloji, meteoroloji gibidir!
                </b>{' '}
                <p>Geçmiş verileri, günümüz gökyüzüyle karşılaştırıp</p>
                <p>gelecek için öngörüde bulunur.</p>
            </h1>
            <div className={styles.post}>
                <div className={styles.imgContainer}>
                    <Image
                        src="/mainphoto1.jpeg"
                        alt=""
                        fill
                        className={styles.image}
                    />
                </div>
                <div className={styles.textContainer}>
                    {/* <h1 className={styles.postTitle}>
                        Neden Astrolog Murat İPEK?
                    </h1> */}
                    <p className={styles.postDesc}>
                        İnsanın sahip olmak istediği en önemli veri kuşkusuz
                        geleceği hakkındadır. <br />
                        Öngörü konusunda birçok disiplinde yaklaşık 35 yıldır
                        sayısız danışmanımın yaşamlarına dokunmanın ve onların
                        hayat kalitelerini yükselttiğimi bilmemin haklı gururunu
                        yaşıyorum.
                        <br />
                        Bu öngörü teknikleri içinde astroloji, spiritüel
                        alanlara kaymadan, matematik bir akılla kendini var
                        ettiği için, bendeki yeri diğer öngörü tekniklerimin hep
                        önüne geçmiştir.
                        <br />
                        Sizlerle bu zaman paylaşımı benim için hep çok kutsal
                        oldu. Çünkü dünyayı döndüren şeyin farkındalık olduğunu
                        da her seans da sizler bana öğrettiniz. <br />
                        Hep yan yana olmak ümidiyle.
                    </p>
                    <Link className={styles.button} href="/contact">
                        Danışmanlık için tıklayınız.
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Featured;
