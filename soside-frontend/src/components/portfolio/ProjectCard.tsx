'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, MapPin } from 'lucide-react';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
    project: {
        id: string;
        title: string;
        category: string;
        imageUrl: string;
        techStack: string[];
        location?: { city: string };
    };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    return (
        <motion.div
            className={styles.card}
            whileHover={{ y: -10 }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <div className={styles.imageWrapper}>
                <img src={project.imageUrl || 'https://via.placeholder.com/600x400'} alt={project.title} className={styles.image} />
                <div className={styles.overlay}>
                    <Link href={`/projects/${project.id}`} className={styles.link}>
                        <span>Détails</span>
                        <ArrowUpRight size={20} />
                    </Link>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.header}>
                    <span className={styles.category}>{project.category}</span>
                    {project.location && (
                        <div className={styles.location}>
                            <MapPin size={14} />
                            <span>{project.location.city}</span>
                        </div>
                    )}
                </div>

                <h3 className={styles.title}>{project.title}</h3>

                <div className={styles.techStack}>
                    {project.techStack?.slice(0, 3).map((tech, idx) => (
                        <span key={idx} className={styles.techTag}>{tech}</span>
                    ))}
                    {project.techStack?.length > 3 && (
                        <span className={styles.techTag}>+{project.techStack.length - 3}</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectCard;
