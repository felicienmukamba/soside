import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('store_brands')
export class Brand {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ unique: true })
    slug: string;

    @Column({ type: 'varchar', nullable: true })
    website: string | null;

    @Column({ type: 'varchar', nullable: true })
    logoUrl: string | null;

    @Column('text', { nullable: true })
    description: string | null;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
