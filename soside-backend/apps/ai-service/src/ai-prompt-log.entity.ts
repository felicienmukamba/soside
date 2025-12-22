import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class AIPromptLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string; // Reference to User from Auth-Service

    @Column('text')
    prompt: string;

    @Column('text')
    response: string;

    @Column()
    modelUsed: string;

    @Column()
    tokensUsed: number;

    @CreateDateColumn()
    createdAt: Date;
}
