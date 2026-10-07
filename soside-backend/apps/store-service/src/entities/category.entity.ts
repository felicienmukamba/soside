import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';

// Taxonomie récursive : chaque catégorie peut avoir un parent (liste d'adjacence).
@Entity('store_categories')
@Index(['parentId', 'position'])
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid', { nullable: true })
    parentId: string | null;

    @ManyToOne(() => Category, (category) => category.children, { nullable: true, onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'parentId' })
    parent: Category | null;

    @OneToMany(() => Category, (category) => category.parent)
    children: Category[];

    @Column()
    name: string;

    @Column({ unique: true })
    slug: string;

    @Column({ type: 'varchar', nullable: true })
    iconUrl: string | null;

    // Profondeur dans l'arbre : 0 pour une racine. Recalculée à chaque déplacement.
    @Column({ default: 0 })
    level: number;

    @Column('text', { nullable: true })
    description: string | null;

    @Column({ default: 0 })
    position: number;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
