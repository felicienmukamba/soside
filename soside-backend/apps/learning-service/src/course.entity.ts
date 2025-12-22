import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Module } from './module.entity';
import { CourseLevel } from './enums/learning.enum';
import { Enrollment } from './enrollment.entity';

@Entity()
export class Course {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column({
        type: 'enum',
        enum: CourseLevel,
        default: CourseLevel.BEGINNER,
    })
    level: CourseLevel;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    price: number;

    @Column({ nullable: true })
    thumbnail: string;

    @OneToMany(() => Module, (module) => module.course)
    modules: Module[];

    @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
    enrollments: Enrollment[];

    @CreateDateColumn()
    createdAt: Date;
}
