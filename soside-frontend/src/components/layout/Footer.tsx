import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.info}>
                    <div className={styles.logo}>SOSI<span>DE</span></div>
                    <p className={styles.description}>
                        Solutions innovantes pour un avenir numérique. Basé en RDC, nous propulsons votre transition digitale.
                    </p>
                </div>

                <div className={styles.links}>
                    <h4>Navigation</h4>
                    <Link href="/projects">Portfolio</Link>
                    <Link href="/learning">Formation</Link>
                    <Link href="/community">Communauté</Link>
                    <Link href="/blog">Blog</Link>
                </div>

                <div className={styles.links}>
                    <h4>Présence</h4>
                    <span>Goma</span>
                    <span>Bukavu</span>
                    <span>Kinshasa</span>
                    <span>Mbujimayi</span>
                </div>

                <div className={styles.contact}>
                    <h4>Contact</h4>
                    <p>Email: contact@soside.cd</p>
                    <p>Tél: +243 900 000 000</p>
                </div>
            </div>
            <div className={styles.copyright}>
                © 2025 SOSIDE. Tous droits réservés.
            </div>
        </footer>
    );
};

export default Footer;
