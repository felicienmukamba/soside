import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Chapter } from './chapter.entity';
import { EventType } from './enums/community.enum';

@Entity()
export class Event {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column()
    date: Date;

    @Column({
        type: 'enum',
        enum: EventType,
    })
    type: EventType;

    @Column({ nullable: true })
    liveKitRoomId: string;

    @ManyToOne(() => Chapter, (chapter) => chapter.events)
    chapter: Chapter;

    @Column()
    chapterId: string;

    @CreateDateColumn()
    createdAt: Date;
}
