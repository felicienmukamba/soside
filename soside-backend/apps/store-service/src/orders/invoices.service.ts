import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { InvoiceStatus } from '@app/store-contracts';
import { Invoice, Order } from '../entities';
import { fail, money } from '../common/helpers';

const SEQUENCE = 'store_invoice_number_seq';
const DUE_DAYS = 7;

const isoDate = (date: Date) => date.toISOString().slice(0, 10);

// Les prix sont TTC : la TVA d'une ligne est la part incluse, prix - prix / (1 + taux).
export function invoiceTotals(order: Pick<Order, 'items' | 'totalAmount'>) {
    const totalTax = money(order.items.reduce((n, i) => n + (i.totalLine - i.totalLine / (1 + i.taxRate / 100)), 0));
    return { totalInclTax: order.totalAmount, totalTax, totalExclTax: money(order.totalAmount - totalTax) };
}

@Injectable()
export class InvoicesService {
    constructor(
        @InjectRepository(Invoice)
        private readonly invoiceRepository: Repository<Invoice>,
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) { }

    // Séquence Postgres : numéros continus et uniques, même avec des confirmations simultanées.
    async ensureSequence() {
        await this.dataSource.query(`CREATE SEQUENCE IF NOT EXISTS ${SEQUENCE} START 1`);
    }

    async issue(manager: EntityManager, order: Order): Promise<Invoice> {
        const existing = await manager.findOne(Invoice, { where: { orderId: order.id } });
        if (existing) return existing;
        const [{ next }] = await manager.query(`SELECT nextval('${SEQUENCE}') AS next`);
        const today = new Date();
        const due = new Date(today.getTime() + DUE_DAYS * 86_400_000);
        return manager.save(Invoice, manager.create(Invoice, {
            orderId: order.id,
            invoiceNumber: `INV-${String(next).padStart(6, '0')}`,
            issueDate: isoDate(today),
            dueDate: isoDate(due),
            ...invoiceTotals(order),
            status: InvoiceStatus.ISSUED,
        }));
    }

    async setStatus(manager: EntityManager, orderId: string, status: InvoiceStatus.PAID | InvoiceStatus.VOID) {
        await manager.update(Invoice, { orderId }, { status });
    }

    findAll(status?: InvoiceStatus): Promise<Invoice[]> {
        return this.invoiceRepository.find({
            where: status ? { status } : {},
            relations: { order: true },
            order: { invoiceNumber: 'DESC' },
            take: 200,
        });
    }

    // Facture complète (avec la commande et ses lignes) ; customerId limite l'accès au client concerné.
    async findOne(invoiceNumber: string, customerId?: string): Promise<Invoice> {
        const invoice = await this.invoiceRepository.findOne({
            where: { invoiceNumber },
            relations: { order: { items: true, payments: true } },
        });
        if (!invoice || (customerId && invoice.order.customerId !== customerId)) fail(HttpStatus.NOT_FOUND, 'Facture introuvable');
        return invoice;
    }
}
