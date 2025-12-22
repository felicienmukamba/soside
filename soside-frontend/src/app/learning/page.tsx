'use client';

import React, { useEffect } from 'react';
import { useLearningStore } from '@/store/learningStore';
import CourseCard from '@/components/learning/CourseCard';
import styles from './Learning.module.css';
import { motion } from 'framer-motion';

const LearningPage = () => {
    const { courses, loading, fetchCourses } = useLearningStore();

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    return (
        <div className={styles.page}>
            <header className={styles.hero}>
                <div className={styles.container}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={styles.heroContent}
                    >
                        <h1 className={styles.title}>Devenez un Expert <span className="tech-gradient-text">Tech</span></h1>
                        <p className={styles.subtitle}>
                            Des parcours de formation certifiants conçus par des experts pour propulser votre carrière.
                        </p>
                    </motion.div>
                </div>
            </header>

            <div className={styles.container}>
                <div className={styles.sectionHeader}>
                    <h2>Catalogues des <span className="tech-gradient-text">Formations</span></h2>
                    <div className={styles.filters}>
                        {/* Filter tags could go here */}
                    </div>
                </div>

                {loading && courses.length === 0 ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Chargement des cours...</p>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {courses.length > 0 ? (
                            courses.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))
                        ) : (
                            <div className={styles.empty}>
                                <p>Aucun cours disponible pour le moment.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LearningPage;
