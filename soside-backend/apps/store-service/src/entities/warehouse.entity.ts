import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Address } from './address.entity';

@Entity('store_warehouses')
export class Warehouse {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    code: string; // ex: GOMA-01

    @Column()
    name: string;

    @Column('uuid')
    addressId: string;

    @ManyToOne(() => Address, { onDelete: 'RESTRICT', eager: true })
    @JoinColumn({ name: 'addressId' })
    address: Address;

    // Entrepôt servi en premier lors des réservations ; un seul à la fois.
    @Column({ default: false })
    isDefault: boolean;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
