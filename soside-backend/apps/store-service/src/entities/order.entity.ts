import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, OneToOne, JoinColumn, Index } from 'typeorm';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@app/store-contracts';
import { numeric } from '../common/helpers';
import type { Invoice } from './invoice.entity';

// Copie figée d'une adresse : l'historique ne bouge pas si le client modifie son carnet.
export interface AddressSnapshot {
    fullName: string;
    phone: string;
    city: string;
    line1: string;
    line2?: string | null;
    landmark?: string | null;
}

// Entrepôt(s) où le stock d'une ligne a été réservé.
export interface StockAllocation {
    warehouseId: string;
    warehouseCode: string;
    warehouseName: string;
    binLocation: string | null;
    quantity: number;
}

@Entity('store_orders')
@Index(['customerId', 'createdAt'])
@Index(['orderStatus', 'createdAt'])
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    reference: string; // ex: ORD-2026-7KQ4MZ

    @Column('uuid', { nullable: true })
    customerId: string | null; // null = commande invitée

    @Column({ type: 'varchar', nullable: true })
    email: string | null;

    @Column('jsonb')
    shippingAddressSnapshot: AddressSnapshot;

    @Column('jsonb')
    billingAddressSnapshot: AddressSnapshot;

    @Column('numeric', { precision: 10, scale: 2, transformer: numeric })
    subtotal: number;

    @Column('numeric', { precision: 10, scale: 2, transformer: numeric })
    shippingFee: number;

    @Column('numeric', { precision: 10, scale: 2, transformer: numeric })
    taxAmount: number; // TVA incluse dans le total

    @Column('numeric', { precision: 10, scale: 2, transformer: numeric })
    totalAmount: number; // total payé par le client

    @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
    paymentStatus: PaymentStatus;

    @Column({ type: 'enum', enum: PaymentMethod })
    paymentMethod: PaymentMethod;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
    orderStatus: OrderStatus;

    @Column({ default: 'USD' })
    currencyCode: string;

    @Column('text', { nullable: true })
    noteToSeller: string | null;

    @Column('numeric', { precision: 8, scale: 3, default: 0, transformer: numeric })
    totalWeightKg: number;

    @Column({ type: 'varchar', nullable: true })
    carrier: string | null;

    @Column({ type: 'varchar', nullable: true })
    trackingNumber: string | null;

    @Column({ type: 'varchar', nullable: true })
    cancelReason: string | null;

    @Column({ type: 'timestamptz', nullable: true })
    confirmedAt: Date | null;

    @Column({ type: 'timestamptz', nullable: true })
    shippedAt: Date | null;

    @Column({ type: 'timestamptz', nullable: true })
    deliveredAt: Date | null;

    @Column({ type: 'timestamptz', nullable: true })
    cancelledAt: Date | null;

    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
    items: OrderItem[];

    @OneToMany(() => Payment, (payment) => payment.order, { cascade: true })
    payments: Payment[];

    @OneToOne('Invoice', 'order')
    invoice: Invoice | null;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}

// Ligne de commande avec snapshot : nom, SKU, attributs, prix et TVA figés au moment de l'achat.
@Entity('store_order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    orderId: string;

    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'orderId' })
    order: Order;

    // Gardé sans clé étrangère : l'historique survit aux modifications du catalogue.
    @Column('uuid')
    productVariantId: string;

    @Column('uuid')
    productId: string;

    @Column()
    productNameSnapshot: string;

    @Column()
    productSlug: string;

    @Column()
    variantNameSnapshot: string;

    @Column()
    skuSnapshot: string;

    @Column('jsonb', { default: {} })
    attributesSnapshot: Record<string, string>;

    @Column({ type: 'varchar', nullable: true })
    imageUrl: string | null;

    @Column()
    quantity: number;

    @Column('numeric', { precision: 10, scale: 2, transformer: numeric })
    unitPrice: number; // TTC

    @Column('numeric', { precision: 5, scale: 2, default: 0, transformer: numeric })
    taxRate: number;

    @Column('numeric', { precision: 10, scale: 2, transformer: numeric })
    totalLine: number; // TTC

    @Column('numeric', { precision: 8, scale: 3, default: 0, transformer: numeric })
    weightKg: number;

    @Column({ default: true })
    trackInventory: boolean;

    @Column('jsonb', { default: [] })
    allocations: StockAllocation[];

    // Quantité commandée en précommande (allow_backorder), en attente de réapprovisionnement.
    @Column({ default: 0 })
    backorderedQuantity: number;
}

@Entity('store_payments')
@Index(['orderId'])
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    orderId: string;

    @ManyToOne(() => Order, (order) => order.payments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @Column({ type: 'enum', enum: PaymentMethod })
    method: PaymentMethod;

    @Column({ default: 'manual' })
    provider: string; // manual, cash, mpesa, airtel, orange, stripe…

    @Column('numeric', { precision: 10, scale: 2, transformer: numeric })
    amount: number;

    @Column({ default: 'USD' })
    currencyCode: string;

    @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
    status: PaymentStatus;

    @Column({ type: 'varchar', nullable: true })
    transactionRef: string | null;

    @Column({ type: 'timestamptz', nullable: true })
    paidAt: Date | null;

    @Column('jsonb', { nullable: true })
    metadata: Record<string, unknown> | null;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
