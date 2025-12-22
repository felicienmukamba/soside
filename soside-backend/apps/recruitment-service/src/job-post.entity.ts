import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Application } from './application.entity';

@Entity()
export class JobPost {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column('text')
    requirements: string;

    @Column({ nullable: true })
    salaryRange: string;

    @Column()
    deadline: Date;

    @OneToMany(() => Application, (application) => application.jobPost)
    applications: Application[];

    @CreateDateColumn()
    createdAt: Date;
}
