import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Channel } from './channel.entity';

@Entity()
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    content: string;

    @Column()
    senderId: string; // Reference to User from Auth-Service

    @ManyToOne(() => Channel, (channel) => channel.messages)
    channel: Channel;

    @Column()
    channelId: string;

    @CreateDateColumn()
    createdAt: Date;
}
