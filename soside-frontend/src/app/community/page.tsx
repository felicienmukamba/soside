'use client';

import React, { useEffect } from 'react';
import ChatModule from '@/components/community/ChatModule';
import styles from './Community.module.css';

const CommunityPage = () => {
    return (
        <div className={styles.page}>
            <ChatModule />
        </div>
    );
};

export default CommunityPage;
