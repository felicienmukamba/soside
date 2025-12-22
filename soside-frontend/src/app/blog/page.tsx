'use client';

import React, { useEffect, useState } from 'react';
import { blogService, BlogPost } from '@/services/blogService';
import { Calendar, User, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './Blog.module.css';

const BlogPage = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await blogService.getPosts();
                setPosts(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Blog <span className="tech-gradient-text">Tech</span></h1>
                    <p className={styles.subtitle}>Actualités, tutoriels et études de cas sur l'innovation en RDC.</p>
                </div>
            </header>

            <div className={styles.container}>
                {loading ? (
                    <div className={styles.loading}>Chargement...</div>
                ) : (
                    <div className={styles.grid}>
                        {posts.map((post, idx) => (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={styles.postCard}
                            >
                                <div className={styles.postImage}>
                                    <img src={post.coverImage || 'https://via.placeholder.com/800x450'} alt={post.title} />
                                </div>
                                <div className={styles.postContent}>
                                    <div className={styles.postMeta}>
                                        <span className={styles.catBadge}>{post.category}</span>
                                        <span className={styles.date}><Calendar size={14} /> {new Date(post.publishedAt).toLocaleDateString()}</span>
                                    </div>
                                    <h2 className={styles.postTitle}>{post.title}</h2>
                                    <p className={styles.summary}>{post.summary}</p>
                                    <Link href={`/blog/${post.id}`} className={styles.readMore}>
                                        Lire la suite <ChevronRight size={16} />
                                    </Link>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogPage;
