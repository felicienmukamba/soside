'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code, Cpu, LineChart, Users, Zap, Globe } from 'lucide-react';
import styles from './Services.module.css';

const services = [
    {
        icon: <Code size={32} />,
        title: "Développement d'Apps",
        description: "Web, Mobile et Solutions ERP sur mesure pour booster votre productivité."
    },
    {
        icon: <Cpu size={32} />,
        title: "Intelligence Artificielle",
        description: "Intégration de LLMs et biométrie pour des systèmes intelligents et sécurisés."
    },
    {
        icon: <Zap size={32} />,
        title: "Automatisation",
        description: "Optimisez vos workflows complexes avec nos solutions d'automatisation intelligente."
    },
    {
        icon: <LineChart size={32} />,
        title: "Marketing Digital",
        description: "Stratégies axées sur les données pour accroître votre visibilité et vos revenus."
    },
    {
        icon: <Users size={32} />,
        title: "Formation Pro",
        description: "Certification tech et parcours financés pour vos équipes et talents."
    },
    {
        icon: <Globe size={32} />,
        title: "Presence Regionale",
        description: "Support local fort à Goma, Bukavu, Kinshasa et Mbujimayi."
    }
];

const Services = () => {
    return (
        <section className={styles.services}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Nos <span className="tech-gradient-text">Services</span></h2>
                    <p className={styles.subtitle}>Une expertise multidimensionnelle pour répondre aux défis de demain.</p>
                </div>

                <div className={styles.grid}>
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="glass-card"
                        >
                            <div className={styles.cardContent}>
                                <div className={styles.icon}>{service.icon}</div>
                                <h3>{service.title}</h3>
                                <p>{service.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
