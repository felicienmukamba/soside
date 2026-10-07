import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique, Check, AfterLoad } from 'typeorm';
import { ProductVariant } from './product-variant.entity';
import { Warehouse } from './warehouse.entity';

// Stock d'une variante dans un entrepôt.
// En main = présent physiquement. Réservé = promis à des commandes non expédiées. Disponible = en main - réservé.
@Entity('store_inventories')
@Unique(['variantId', 'warehouseId'])
@Check(`"quantityReserved" >= 0 AND "quantityReserved" <= "quantityOnHand"`)
export class Inventory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    warehouseId: string;

    @ManyToOne(() => Warehouse, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'warehouseId' })
    warehouse: Warehouse;

    @Column('uuid')
    variantId: string;

    @ManyToOne(() => ProductVariant, (variant) => variant.inventories, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'variantId' })
    variant: ProductVariant;

    @Column({ default: 0 })
    quantityOnHand: number;

    @Column({ default: 0 })
    quantityReserved: number;

    @Column({ type: 'varchar', nullable: true })
    binLocation: string | null; // ex: Rayon A, Étagère 2

    @Column({ default: 2 })
    reorderLevel: number; // seuil d'alerte

    @UpdateDateColumn({ type: 'timestamptz' })
    lastStockUpdate: Date;

    quantityAvailable: number;

    @AfterLoad()
    computeAvailable() {
        this.quantityAvailable = this.quantityOnHand - this.quantityReserved;
    }
}
