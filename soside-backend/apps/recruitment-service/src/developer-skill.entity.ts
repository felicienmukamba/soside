import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DeveloperSkill {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    developerId: string; // Reference to User from Auth-Service

    @Column()
    skillName: string;

    @Column('int')
    proficiencyLevel: number; // 1-10 rating
}
