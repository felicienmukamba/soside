import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { JobPost } from './job-post.entity';
import { ApplicationStatus } from './enums/recruitment.enum';

@Entity()
export class Application {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => JobPost, (jobPost) => jobPost.applications)
    jobPost: JobPost;

    @Column()
    jobPostId: string;

    @Column()
    candidateId: string; // Reference to User from Auth-Service

    @Column()
    resumeUrl: string;

    @Column({
        type: 'enum',
        enum: ApplicationStatus,
        default: ApplicationStatus.PENDING,
    })
    status: ApplicationStatus;

    @CreateDateColumn()
    createdAt: Date;
}
