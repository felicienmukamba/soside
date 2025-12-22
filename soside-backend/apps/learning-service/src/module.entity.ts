import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Course } from './course.entity';
import { Lesson } from './lesson.entity';

@Entity()
export class Module {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    order: number;

    @ManyToOne(() => Course, (course) => course.modules)
    course: Course;

    @Column()
    courseId: string;

    @OneToMany(() => Lesson, (lesson) => lesson.module)
    lessons: Lesson[];
}
