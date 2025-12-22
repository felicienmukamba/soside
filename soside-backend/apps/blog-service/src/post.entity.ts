import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { Tag } from './tag.entity';
import { Comment } from './comment.entity';

@Entity()
export class Post {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ unique: true })
    slug: string;

    @Column('text')
    content: string; // Markdown content

    @Column('text', { nullable: true })
    summary: string;

    @Column({ nullable: true })
    coverImage: string;

    @Column({ nullable: true })
    readingTime: number; // in minutes

    @Column()
    authorId: string; // Reference to User from Auth-Service

    @Column({ default: false })
    isPublished: boolean;

    @ManyToMany(() => Category, (category) => category.posts)
    @JoinTable()
    categories: Category[];

    @ManyToMany(() => Tag, (tag) => tag.posts)
    @JoinTable()
    tags: Tag[];

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
