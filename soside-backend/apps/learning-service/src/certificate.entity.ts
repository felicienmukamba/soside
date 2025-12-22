import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Enrollment } from './enrollment.entity';

@Entity()
export class Certificate {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Enrollment, (enrollment) => enrollment.certificate)
    @JoinColumn()
    enrollment: Enrollment;

    @Column()
    enrollmentId: string;

    @Column()
    issueDate: Date;

    @Column({ unique: true })
    uniqueCode: string;
}
