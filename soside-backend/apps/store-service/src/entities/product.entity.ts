import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { DataType, ProductCondition, ProductStatus } from '@app/store-contracts';
import { numeric } from '../common/helpers';
import { Category } from './category.entity';
import { Brand } from './brand.entity';
import { ProductVariant } from './product-variant.entity';
import { ProductImage } from './product-image.entity';

// Axe de la matrice des variantes, ex: { name: 'Couleur', type: 'color', values: ['Noir', 'Bleu'] }.
export interface ProductOption {
    name: string;
    type: DataType;
    values: string[];
}

// Fiche produit parente : contenu, SEO et axes de déclinaison. Prix, poids et stock sont portés par les variantes.
@Entity('store_products')
@Index(['status', 'categoryId'])
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    categoryId: string;

    @ManyToOne(() => Category, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @Column('uuid', { nullable: true })
    brandId: string | null;

    @ManyToOne(() => Brand, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'brandId' })
    brand: Brand | null;

    @Column()
    name: string;

    @Column({ unique: true })
    slug: string;

    @Column('text', { nullable: true })
    descriptionShort: string | null;

    @Column('text', { nullable: true })
    descriptionHtml: string | null; // nettoyé à l'enregistrement (sanitize-html)

    @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.DRAFT })
    status: ProductStatus;

    @Column('jsonb', { default: [] })
    tags: string[];

    @Column({ default: false })
    isDigital: boolean; // pas d'expédition ni de poids

    @Column({ type: 'varchar', nullable: true })
    seoTitle: string | null;

    @Column('text', { nullable: true })
    seoDescription: string | null;

    @Column({ type: 'enum', enum: ProductCondition, default: ProductCondition.NEW })
    condition: ProductCondition;

    @Column('jsonb', { default: {} })
    specs: Record<string, string>; // fiche technique

    @Column('jsonb', { default: [] })
    options: ProductOption[];

    @Column({ default: false })
    isFeatured: boolean;

    @Column('numeric', { precision: 2, scale: 1, default: 0, transformer: numeric })
    rating: number;

    @Column({ default: 0 })
    soldCount: number;

    @OneToMany(() => ProductVariant, (variant) => variant.product)
    variants: ProductVariant[];

    @OneToMany(() => ProductImage, (image) => image.product)
    images: ProductImage[];

    @Column({ type: 'timestamptz', nullable: true })
    publishedAt: Date | null;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
