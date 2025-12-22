import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class Location {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    city: string; // Bukavu, Goma, Kinshasa, etc.

    @Column('decimal', { precision: 10, scale: 8 })
    latitude: number;

    @Column('decimal', { precision: 11, scale: 8 })
    longitude: number;

    @Column({ nullable: true })
    address: string;

    @OneToMany(() => Project, (project) => project.location)
    projects: Project[];
}
