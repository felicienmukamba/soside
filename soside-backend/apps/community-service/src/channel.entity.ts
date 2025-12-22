import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Chapter } from './chapter.entity';
import { ChannelType } from './enums/community.enum';
import { Message } from './message.entity';

@Entity()
export class Channel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({
        type: 'enum',
        enum: ChannelType,
    })
    type: ChannelType;

    @ManyToOne(() => Chapter, (chapter) => chapter.channels)
    chapter: Chapter;

    @Column()
    chapterId: string;

    @OneToMany(() => Message, (message) => message.channel)
    messages: Message[];
}
