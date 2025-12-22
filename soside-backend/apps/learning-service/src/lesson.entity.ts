import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Module } from './module.entity';
import { LessonType } from './enums/learning.enum';

@Entity()
export class Lesson {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('text')
    content: string; // Markdown or Video URL

    @Column({
        type: 'enum',
        enum: LessonType,
    })
    type: LessonType;

    @ManyToOne(() => Module, (module) => module.lessons)
    module: Module;

    @Column()
    moduleId: string;
}
