import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class AutomationWorkflow {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    webhookUrl: string; // n8n/Make webhook URL

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    lastTriggered: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
