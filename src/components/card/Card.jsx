import Image from 'next/image';
import styles from './card.module.css';
import Link from 'next/link';

const Card = ({ item }) => {
    return (
        <div className={styles.container}>
            {item.img && (
                <div className={styles.imageContainer}>
                    <Image
                        src={item.img}
                        alt=""
                        fill
                        className={styles.image}
                    />
                </div>
            )}
            <div className={styles.textContainer}>
                <div className={styles.detail}>
                    <span className={styles.date}>
                        {item.createdAt
                            .substring(0, 10)
                            .split('-')
                            .reverse()
                            .join('-')}{' '}
                    </span>
                    {/* <span className={styles.category}>{item.catSlug}</span> */}
                </div>
                <Link href={`/posts/${item.slug}`}>
                    <h1>{item.title}</h1>
                </Link>
                <p className={styles.desc}>
                    {item.desc.replace(/<[^>]*>/g, '').substring(0, 60)}
                </p>
                <Link href={`/posts/${item.slug}`} className={styles.link}>
                    Devamını Oku
                </Link>
            </div>
        </div>
    );
};

export default Card;
