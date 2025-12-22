import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    content: string;

    @Column()
    authorId: string; // Reference to User from Auth-Service

    @ManyToOne(() => Post, (post) => post.comments)
    post: Post;

    @Column()
    postId: string;

    @CreateDateColumn()
    createdAt: Date;
}
