'use client';

import React, { useEffect, useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import ProjectCard from '@/components/portfolio/ProjectCard';
import styles from './Projects.module.css';
import { motion } from 'framer-motion';

const ProjectsPage = () => {
    const { projects, loading, error, fetchProjects } = useProjectStore();
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const categories = ['All', 'Web', 'Mobile', 'IA', 'Automation', 'BI'];

    const filteredProjects = filter === 'All'
        ? projects
        : projects.filter(p => p.category === filter);

    if (loading && projects.length === 0) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Chargement des projets...</p>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.container}>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={styles.title}
                    >
                        Notre <span className="tech-gradient-text">Portfolio</span>
                    </motion.h1>
                    <p className={styles.subtitle}>
                        Découvrez nos réalisations technologiques à travers la République Démocratique du Congo.
                    </p>
                </div>
            </header>

            <div className={styles.container}>
                <div className={styles.filters}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`${styles.filterBtn} ${filter === cat ? styles.active : ''}`}
                            onClick={() => setFilter(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {error && <div className={styles.error}>Erreur: {error}</div>}

                <div className={styles.grid}>
                    {filteredProjects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>

                {filteredProjects.length === 0 && !loading && (
                    <div className={styles.empty}>
                        <p>Aucun projet trouvé dans cette catégorie.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectsPage;
