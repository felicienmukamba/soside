'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useProjectStore } from '@/store/projectStore';
import { ArrowLeft, Calendar, Tag, User, Globe, MapPin } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './ProjectDetail.module.css';

const ProjectDetailPage = () => {
    const { id } = useParams();
    const { getProjectById, loading, fetchProjects } = useProjectStore();

    const project = getProjectById(id as string);

    useEffect(() => {
        if (!project) {
            fetchProjects();
        }
    }, [id, project, fetchProjects]);

    if (loading || !project) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Chargement du projet...</p>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <header className={styles.hero}>
                <div className={styles.heroOverlay}></div>
                <img src={project.imageUrl} alt={project.title} className={styles.heroImage} />

                <div className={styles.heroContent}>
                    <div className={styles.container}>
                        <Link href="/projects" className={styles.backLink}>
                            <ArrowLeft size={20} />
                            <span>Retour au Portfolio</span>
                        </Link>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={styles.projectInfo}
                        >
                            <div className={styles.badge}>{project.category}</div>
                            <h1 className={styles.title}>{project.title}</h1>
                            <div className={styles.status}>
                                <div className={styles.statusDot}></div>
                                <span>{project.status === 'completed' ? 'Terminé' : 'En cours'}</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </header>

            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.mainContent}>
                        <section className={styles.section}>
                            <h2>Description du <span className="tech-gradient-text">Projet</span></h2>
                            <div className={styles.description}>
                                {project.description}
                            </div>
                        </section>

                        <section className={styles.section}>
                            <h2>Galerie</h2>
                            <div className={styles.gallery}>
                                {/* Mock gallery items */}
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={styles.galleryItem}>
                                        <img src={project.imageUrl} alt={`${project.title} - ${i}`} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <aside className={styles.sidebar}>
                        <div className="glass-card">
                            <div className={styles.sidebarContent}>
                                <h3>Détails Techniques</h3>

                                <div className={styles.detailItem}>
                                    <Tag size={18} />
                                    <div>
                                        <label>Catégorie</label>
                                        <span>{project.category}</span>
                                    </div>
                                </div>

                                <div className={styles.detailItem}>
                                    <User size={18} />
                                    <div>
                                        <label>Client</label>
                                        <span>{project.clientName || 'Confidentiel'}</span>
                                    </div>
                                </div>

                                {project.location && (
                                    <div className={styles.detailItem}>
                                        <MapPin size={18} />
                                        <div>
                                            <label>Localisation</label>
                                            <span>{project.location.city}</span>
                                        </div>
                                    </div>
                                )}

                                <div className={styles.techList}>
                                    <label>Technologies</label>
                                    <div className={styles.tags}>
                                        {project.techStack?.map(tech => (
                                            <span key={tech} className={styles.techTag}>{tech}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.contactCard}>
                            <h3>Intéressé par ce type de solution ?</h3>
                            <p>Contactez notre équipe de consultants pour une étude personnalisée.</p>
                            <button className="glow-btn">Démarrer un projet</button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailPage;
