'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Signal } from 'lucide-react';
import styles from './CourseCard.module.css';

interface CourseCardProps {
    course: {
        id: string;
        title: string;
        description: string;
        thumbnail: string;
        duration: string;
        level: string;
        category: string;
    };
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    return (
        <motion.div
            className="glass-card"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
        >
            <div className={styles.cardContent}>
                <div className={styles.thumbnailWrapper}>
                    <img src={course.thumbnail || 'https://via.placeholder.com/400x225'} alt={course.title} className={styles.thumbnail} />
                    <div className={styles.categoryBadge}>{course.category}</div>
                </div>

                <div className={styles.info}>
                    <h3 className={styles.title}>{course.title}</h3>
                    <p className={styles.description}>{course.description.substring(0, 100)}...</p>

                    <div className={styles.meta}>
                        <div className={styles.metaItem}>
                            <Clock size={16} />
                            <span>{course.duration}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <Signal size={16} />
                            <span>{course.level}</span>
                        </div>
                    </div>

                    <Link href={`/learning/${course.id}`} className={styles.enrollBtn}>
                        <span>Voir le parcours</span>
                        <BookOpen size={18} />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default CourseCard;
