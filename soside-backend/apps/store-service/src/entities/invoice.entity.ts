import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { InvoiceStatus } from '@app/store-contracts';
import { numeric } from '../common/helpers';
import { Order } from './order.entity';

// Facture de vente : émise à la confirmation de la commande, payée avec elle, annulée (VOID) si la commande l'est.
@Entity('store_invoices')
export class Invoice {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid', { unique: true })
    orderId: string;

    @OneToOne(() => Order, (order) => order.invoice, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @Column({ unique: true })
    invoiceNumber: string; // séquence continue : INV-000001

    @Column({ type: 'date' })
    issueDate: string;

    @Column({ type: 'date' })
    dueDate: string;

    @Column('numeric', { precision: 10, scale: 2, transformer: numeric })
    totalExclTax: number;

    @Column('numeric', { precision: 10, scale: 2, transformer: numeric })
    totalTax: number;

    @Column('numeric', { precision: 10, scale: 2, transformer: numeric })
    totalInclTax: number;

    @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.DRAFT })
    status: InvoiceStatus;

    @Column({ type: 'varchar', nullable: true })
    pdfUrl: string | null;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
