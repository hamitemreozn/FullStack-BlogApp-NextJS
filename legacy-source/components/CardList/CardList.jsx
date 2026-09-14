'use client';
import React, { useEffect, useState } from 'react';
import styles from './cardList.module.css';
import Pagination from '../pagination/Pagination';
import Card from '../card/Card';

const CardList = ({ page, cat }) => {
    const POSTS_PER_PAGE = 10;
    const [displayedPosts, setDisplayedPosts] = useState([]);
    const [hasPrev, setHasPrev] = useState(false);
    const [hasNext, setHasNext] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching data...');
                const res = await fetch(
                    `http://localhost:3000/api/posts?page=${page}&cat=${
                        cat || ''
                    }`
                );
                if (!res.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await res.json();
                console.log('Data fetched:', data);
                const totalCount = data.count;
                const totalPageCount = Math.ceil(totalCount / POSTS_PER_PAGE);
                setHasPrev(page > 1);
                setHasNext(page < totalPageCount);
                const startIndex = POSTS_PER_PAGE * (page - 1);
                const endIndex = Math.min(
                    startIndex + POSTS_PER_PAGE,
                    totalCount
                );
                const displayedPosts = data.posts.slice(startIndex, endIndex);
                console.log('Displayed posts:', displayedPosts);
                console.log('page:', page);
                setDisplayedPosts(displayedPosts);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [page, cat]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Blog Yazıları</h1>
            <div className={styles.posts}>
                {displayedPosts.map((item, index) => (
                    <div key={index}>
                        <Card key={index} item={item} />
                    </div>
                ))}
            </div>
            <Pagination page={page} hasPrev={hasPrev} hasNext={hasNext} />
        </div>
    );
};

export default CardList;
