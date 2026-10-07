import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { MovementReferenceType, MovementType } from '@app/store-contracts';
import { Inventory } from './inventory.entity';

// Journal d'audit : une ligne par modification de stock, jamais modifiée ni supprimée.
@Entity('store_stock_movements')
@Index(['inventoryId', 'createdAt'])
@Index(['referenceType', 'referenceId'])
export class StockMovement {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    inventoryId: string;

    @ManyToOne(() => Inventory, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'inventoryId' })
    inventory: Inventory;

    @Column({ type: 'enum', enum: MovementType })
    type: MovementType;

    @Column()
    quantityChange: number; // variation du stock en main (+/-), 0 pour une réservation

    @Column()
    quantity: number; // quantité mouvementée, toujours positive

    @Column()
    beforeQuantity: number; // stock en main avant

    @Column()
    afterQuantity: number; // stock en main après

    @Column()
    reservedBefore: number;

    @Column()
    reservedAfter: number;

    @Column({ type: 'enum', enum: MovementReferenceType, default: MovementReferenceType.MANUAL })
    referenceType: MovementReferenceType;

    @Column({ type: 'varchar', nullable: true })
    referenceId: string | null; // référence de commande, n° de bon d'achat…

    @Column({ type: 'varchar', nullable: true })
    reason: string | null;

    @Column('uuid', { nullable: true })
    createdBy: string | null; // utilisateur à l'origine du mouvement

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;
}
