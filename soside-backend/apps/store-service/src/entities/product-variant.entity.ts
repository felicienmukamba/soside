import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index, AfterLoad } from 'typeorm';
import { StockStatus } from '@app/store-contracts';
import { numeric } from '../common/helpers';
import { Product } from './product.entity';
import { Inventory } from './inventory.entity';

// Article vendable (SKU) : prix, poids, attributs et totaux de stock tous entrepôts confondus.
@Entity('store_product_variants')
@Index(['productId', 'position'])
export class ProductVariant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    productId: string;

    @ManyToOne(() => Product, (product) => product.variants, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column({ unique: true })
    sku: string;

    @Column({ type: 'varchar', nullable: true })
    barcode: string | null; // EAN / UPC

    @Column()
    name: string; // ex: « 128 Go · Noir »

    @Column('jsonb', { default: {} })
    attributes: Record<string, string>; // ex: { Stockage: '128 Go', Couleur: 'Noir' }

    @Column('numeric', { precision: 10, scale: 2, transformer: numeric })
    price: number; // prix de vente TTC

    @Column('numeric', { precision: 10, scale: 2, nullable: true, transformer: numeric })
    compareAtPrice: number | null; // prix barré

    @Column('numeric', { precision: 10, scale: 2, nullable: true, transformer: numeric })
    costPrice: number | null; // prix de revient, pour la marge

    @Column('numeric', { precision: 5, scale: 2, default: 0, transformer: numeric })
    taxRate: number; // TVA en %, incluse dans le prix

    @Column('numeric', { precision: 8, scale: 3, default: 0, transformer: numeric })
    weightKg: number;

    @Column({ type: 'varchar', nullable: true })
    dimensionsLwh: string | null; // ex: 10x10x20 (cm)

    @Column({ type: 'varchar', nullable: true })
    mainImageUrl: string | null;

    // Totaux maintenus par InventoryService à chaque mouvement (somme des entrepôts actifs).
    @Column({ default: 0 })
    quantityOnHand: number;

    @Column({ default: 0 })
    quantityReserved: number;

    @Column({ default: 2 })
    stockAlertThreshold: number;

    @Column({ type: 'enum', enum: StockStatus, default: StockStatus.OUT_OF_STOCK })
    stockStatus: StockStatus;

    @Column({ default: false })
    allowBackorder: boolean; // commande possible au-delà du stock disponible

    @Column({ default: true })
    trackInventory: boolean; // false : ni contrôle ni mouvement de stock (services, numérique)

    @Column({ default: 0 })
    position: number;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => Inventory, (inventory) => inventory.variant)
    inventories: Inventory[];

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;

    quantityAvailable: number;

    @AfterLoad()
    computeAvailable() {
        this.quantityAvailable = this.quantityOnHand - this.quantityReserved;
    }
}

export function stockStatusOf(available: number, threshold: number, trackInventory = true): StockStatus {
    if (!trackInventory) return StockStatus.IN_STOCK;
    if (available <= 0) return StockStatus.OUT_OF_STOCK;
    return available <= threshold ? StockStatus.LOW_STOCK : StockStatus.IN_STOCK;
}
