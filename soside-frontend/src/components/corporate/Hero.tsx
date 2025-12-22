'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './Hero.module.css';

const Hero = () => {
    return (
        <section className={styles.hero}>
            <div className={styles.background}>
                <div className={styles.grid}></div>
                <div className={styles.glow}></div>
            </div>

            <div className={styles.content}>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className={styles.title}
                >
                    Propulsez votre <span className="tech-gradient-text">Avenir Numérique</span> en RDC
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={styles.subtitle}
                >
                    Experts en IA, Développement d'Apps, Automatisation et Formation de pointe à Goma, Bukavu, Kinshasa et Mbujimayi.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className={styles.actions}
                >
                    <button className="glow-btn">Découvrir nos services</button>
                    <button className={styles.outlineBtn}>Explorer le portfolio</button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.6 }}
                    className={styles.scrollDown}
                >
                    <div className={styles.mouse}></div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
