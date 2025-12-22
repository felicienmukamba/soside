import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Course } from './course.entity';
import { Certificate } from './certificate.entity';

@Entity()
export class Enrollment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    studentId: string; // Reference to User from Auth-Service

    @ManyToOne(() => Course, (course) => course.enrollments)
    course: Course;

    @Column()
    courseId: string;

    @Column('decimal', { precision: 5, scale: 2, default: 0 })
    progressPercentage: number;

    @Column({ nullable: true })
    completedAt: Date;

    @OneToOne(() => Certificate, (certificate) => certificate.enrollment)
    certificate: Certificate;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
