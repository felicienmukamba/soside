import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';

@Entity('store_product_images')
@Index(['productId', 'displayOrder'])
export class ProductImage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    productId: string;

    @ManyToOne(() => Product, (product) => product.images, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'productId' })
    product: Product;

    // Image propre à une variante (ex: la couleur bleue), sinon image de la fiche.
    @Column('uuid', { nullable: true })
    variantId: string | null;

    @ManyToOne(() => ProductVariant, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'variantId' })
    variant: ProductVariant | null;

    @Column()
    imageUrl: string;

    @Column({ default: 0 })
    displayOrder: number;

    @Column({ type: 'varchar', nullable: true })
    altText: string | null;
}
