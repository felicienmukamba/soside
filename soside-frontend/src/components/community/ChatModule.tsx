'use client';

import React, { useState } from 'react';
import { Send, Hash, Users, Info, Settings } from 'lucide-react';
import styles from './ChatModule.module.css';

interface Message {
    id: string;
    sender: string;
    text: string;
    timestamp: string;
    avatar?: string;
}

const ChatModule = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender: 'Gloire', text: 'Salut tout le monde ! Prêt pour le hackathon ?', timestamp: '14:30', avatar: 'https://i.pravatar.cc/150?u=gloire' },
        { id: '2', sender: 'Sarah', text: 'Oui ! Je suis en train de finaliser la maquette.', timestamp: '14:32', avatar: 'https://i.pravatar.cc/150?u=sarah' },
        { id: '3', sender: 'Dev Team', text: 'N\'oubliez pas de pusher vos branches de démo.', timestamp: '14:35' },
    ]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            sender: 'Moi',
            text: message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages([...messages, newMessage]);
        setMessage('');
    };

    return (
        <div className={styles.chatModule}>
            <div className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h3>Chapitres</h3>
                </div>
                <div className={styles.channels}>
                    <div className={`${styles.channel} ${styles.active}`}>
                        <Hash size={18} />
                        <span>Goma - General</span>
                    </div>
                    <div className={styles.channel}>
                        <Hash size={18} />
                        <span>Bukavu - Tech</span>
                    </div>
                    <div className={styles.channel}>
                        <Hash size={18} />
                        <span>Kinshasa - Events</span>
                    </div>
                </div>
            </div>

            <div className={styles.chatArea}>
                <div className={styles.chatHeader}>
                    <div className={styles.headerInfo}>
                        <Hash size={20} />
                        <h4>Goma - General</h4>
                    </div>
                    <div className={styles.headerActions}>
                        <Users size={20} />
                        <Info size={20} />
                        <Settings size={20} />
                    </div>
                </div>

                <div className={styles.messageList}>
                    {messages.map((msg) => (
                        <div key={msg.id} className={styles.message}>
                            <div className={styles.avatar}>
                                {msg.avatar ? <img src={msg.avatar} alt={msg.sender} /> : <div className={styles.defaultAvatar}>{msg.sender[0]}</div>}
                            </div>
                            <div className={styles.msgContent}>
                                <div className={styles.msgHeader}>
                                    <span className={styles.sender}>{msg.sender}</span>
                                    <span className={styles.time}>{msg.timestamp}</span>
                                </div>
                                <p className={styles.text}>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <form className={styles.inputArea} onSubmit={handleSend}>
                    <input
                        type="text"
                        placeholder="Écrire un message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button type="submit" className={styles.sendBtn}>
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatModule;
