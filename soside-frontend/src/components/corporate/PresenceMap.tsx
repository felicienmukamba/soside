'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import styles from './PresenceMap.module.css';

const locations = [
    { name: 'Goma', details: 'Siège Social, Incubateur Tech', coords: { top: '45%', left: '85%' } },
    { name: 'Bukavu', details: 'Développement Software & IA', coords: { top: '55%', left: '83%' } },
    { name: 'Kinshasa', details: 'Relations B2G & Stratégie', coords: { top: '50%', left: '20%' } },
    { name: 'Mbujimayi', details: 'Formation & Automatisation', coords: { top: '65%', left: '55%' } },
];

const PresenceMap = () => {
    return (
        <section className={styles.presence}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Notre <span className="tech-gradient-text">Présence</span></h2>
                    <p className={styles.subtitle}>Un impact local avec une vision globale à travers la RDC.</p>
                </div>

                <div className={styles.mapWrapper}>
                    <div className={styles.mapContainer}>
                        {/* Simple abstract map background or use an image */}
                        <div className={styles.mapPlaceholder}>
                            {/* This represents a stylized map of DRC */}
                            <svg viewBox="0 0 500 500" className={styles.drcSvg}>
                                <path d="M100,50 L400,50 L450,150 L420,350 L300,450 L150,420 L50,300 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" />
                            </svg>

                            {locations.map((loc, index) => (
                                <motion.div
                                    key={index}
                                    className={styles.marker}
                                    style={{ top: loc.coords.top, left: loc.coords.left }}
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 }}
                                >
                                    <div className={styles.pin}>
                                        <MapPin size={24} color="var(--primary)" />
                                        <div className={styles.pulse}></div>
                                    </div>
                                    <div className={styles.infoCard}>
                                        <h4>{loc.name}</h4>
                                        <p>{loc.details}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.stats}>
                        <div className={styles.statItem}>
                            <h3>50+</h3>
                            <p>Experts Tech</p>
                        </div>
                        <div className={styles.statItem}>
                            <h3>100+</h3>
                            <p>Projets Livrés</p>
                        </div>
                        <div className={styles.statItem}>
                            <h3>4</h3>
                            <p>Villes Clés</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PresenceMap;
