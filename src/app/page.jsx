import React from 'react';
import CardList from '@/components/CardList/CardList';
import Menu from '@/components/Menu/Menu';
import CategoryList from '@/components/categoryList/CategoryList';
import Featured from '@/components/feautured/Featured'; // Featured bileşenini import edin
import styles from './homepage.module.css';

export default function Home({ searchParams }) {
    const page = parseInt(searchParams.page) || 1;
    const cat = searchParams.cat;

    return (
        <div className={styles.container}>
            {/* Featured bileşeni burada yer almalı */}
            <Featured />
            <CategoryList />
            <div className={styles.content}>
                <CardList page={page} cat={cat} />
                <Menu />
            </div>
        </div>
    );
}
