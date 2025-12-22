import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Event } from './event.entity';
import { Channel } from './channel.entity';

@Entity()
export class Chapter {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string; // e.g., "GDG Bukavu"

    @Column()
    leaderId: string; // Reference to User from Auth-Service

    @Column({ nullable: true })
    locationId: string; // Reference to Location

    @OneToMany(() => Event, (event) => event.chapter)
    events: Event[];

    @OneToMany(() => Channel, (channel) => channel.chapter)
    channels: Channel[];
}
