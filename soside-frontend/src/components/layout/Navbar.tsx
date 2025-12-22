'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Menu, X, User, LogOut } from 'lucide-react';
import styles from './Navbar.module.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, isAuthenticated, logout } = useAuthStore();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    SOSI<span>DE</span>
                </Link>

                {/* Desktop Menu */}
                <div className={styles.desktopMenu}>
                    <Link href="/projects" className={styles.navLink}>Portfolio</Link>
                    <Link href="/learning" className={styles.navLink}>Formation</Link>
                    <Link href="/community" className={styles.navLink}>Communauté</Link>
                    <Link href="/blog" className={styles.navLink}>Blog</Link>
                    <Link href="/recruitment" className={styles.navLink}>Recrutement</Link>

                    {isAuthenticated ? (
                        <div className={styles.userSection}>
                            <span className={styles.userName}>{user?.profile?.firstName || 'User'}</span>
                            <button onClick={logout} className={styles.logoutBtn}>
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className="glow-btn">Connexion</Link>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className={styles.mobileToggle} onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className={styles.mobileMenu}>
                    <Link href="/projects" onClick={() => setIsOpen(false)}>Portfolio</Link>
                    <Link href="/learning" onClick={() => setIsOpen(false)}>Formation</Link>
                    <Link href="/community" onClick={() => setIsOpen(false)}>Communauté</Link>
                    <Link href="/blog" onClick={() => setIsOpen(false)}>Blog</Link>
                    <Link href="/recruitment" onClick={() => setIsOpen(false)}>Recrutement</Link>
                    {!isAuthenticated && (
                        <Link href="/login" className="glow-btn" onClick={() => setIsOpen(false)}>Connexion</Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
