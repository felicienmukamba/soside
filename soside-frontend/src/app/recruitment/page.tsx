'use client';

import React, { useEffect, useState } from 'react';
import { recruitmentService, JobOffer } from '@/services/recruitmentService';
import { MapPin, Briefcase, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './Recruitment.module.css';

const RecruitmentPage = () => {
    const [jobs, setJobs] = useState<JobOffer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await recruitmentService.getJobs();
                setJobs(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    return (
        <div className={styles.page}>
            <header className={styles.hero}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Rejoignez <span className="tech-gradient-text">L'Élite Tech</span></h1>
                    <p className={styles.subtitle}>Bâtissez le futur numérique de la RDC avec nous.</p>
                </div>
            </header>

            <div className={styles.container}>
                <div className={styles.jobList}>
                    <h2 className={styles.sectionTitle}>Postes Ouverts</h2>

                    {loading ? (
                        <div className={styles.loading}>Recherche des opportunités...</div>
                    ) : (
                        <div className={styles.grid}>
                            {jobs.map((job, idx) => (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={styles.jobCard}
                                >
                                    <div className={styles.jobInfo}>
                                        <h3>{job.title}</h3>
                                        <div className={styles.jobMeta}>
                                            <span><MapPin size={16} /> {job.location}</span>
                                            <span><Briefcase size={16} /> {job.type}</span>
                                            <span><Clock size={16} /> Temps plein</span>
                                        </div>
                                    </div>
                                    <button className={styles.applyBtn}>
                                        Détails & Postuler <ChevronRight size={18} />
                                    </button>
                                </motion.div>
                            ))}

                            {jobs.length === 0 && (
                                <div className={styles.empty}>
                                    <p>Aucun poste ouvert pour le moment. Suivez-nous sur LinkedIn !</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecruitmentPage;
