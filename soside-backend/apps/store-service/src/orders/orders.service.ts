import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import {
    AddressDto, CancelOrderDto, CartOwner, CheckoutDto, InvoiceStatus, MovementReferenceType, OrderQueryDto, OrderStatus,
    PaymentMethod, PaymentStatus, ProductStatus, RecordPaymentDto, ShipOrderDto,
} from '@app/store-contracts';
import { Address, AddressSnapshot, Cart, CartItem, Order, OrderItem, Payment, Product, ProductVariant } from '../entities';
import { InventoryService, MovementContext } from '../inventory/inventory.service';
import { AddressesService } from '../addresses/addresses.service';
import { InvoicesService } from './invoices.service';
import { fail, loadSettings, money, shippingFeeFor } from '../common/helpers';

const digits = (phone: string) => phone.replace(/\D/g, '');

const snapshotOf = (a: Pick<AddressDto, 'fullName' | 'phone' | 'city' | 'line1' | 'line2' | 'landmark'>): AddressSnapshot => ({
    fullName: a.fullName.trim(),
    phone: a.phone.trim(),
    city: a.city,
    line1: a.line1.trim(),
    line2: a.line2?.trim() || null,
    landmark: a.landmark?.trim() || null,
});

@Injectable()
export class OrdersService {
    private readonly settings = loadSettings();

    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectDataSource()
        private readonly dataSource: DataSource,
        private readonly inventoryService: InventoryService,
        private readonly addressesService: AddressesService,
        private readonly invoicesService: InvoicesService,
    ) { }

    // ===================== Tunnel de commande =====================

    async checkout(owner: CartOwner, dto: CheckoutDto): Promise<Order> {
        const shipping = await this.resolveShipping(owner, dto);
        const billing = dto.billingAddress ? snapshotOf(dto.billingAddress) : shipping;

        const reference = await this.dataSource.transaction(async (manager) => {
            const where = owner.userId ? { customerId: owner.userId } : owner.sessionId ? { sessionId: owner.sessionId } : null;
            if (!where) fail(HttpStatus.BAD_REQUEST, 'Panier non identifié');
            const cart = await manager.findOne(Cart, { where, relations: { items: true } });
            if (!cart || cart.items.length === 0) fail(HttpStatus.BAD_REQUEST, 'Votre panier est vide');

            const variants = await manager.find(ProductVariant, {
                where: { id: In(cart.items.map((i) => i.variantId)) },
                relations: { product: { images: true } },
            });
            const byId = new Map(variants.map((v) => [v.id, v]));
            const available = await this.inventoryService.lockAvailability(manager, variants.filter((v) => v.trackInventory).map((v) => v.id));

            // Snapshot : nom, SKU, attributs, prix et TVA sont figés dans la commande.
            const items = cart.items.map((line) => {
                const variant = byId.get(line.variantId);
                if (!variant || !variant.isActive || variant.product.status !== ProductStatus.PUBLISHED) {
                    fail(HttpStatus.CONFLICT, `${variant?.product.name ?? 'Un article'} n'est plus disponible : retirez-le du panier`);
                }
                const stock = available.get(variant.id) ?? 0;
                if (variant.trackInventory && !variant.allowBackorder && stock < line.quantity) {
                    fail(HttpStatus.CONFLICT, `Plus que ${Math.max(0, stock)} exemplaire(s) de ${variant.product.name} en stock`);
                }
                const images = [...variant.product.images].sort((a, b) => a.displayOrder - b.displayOrder);
                return manager.create(OrderItem, {
                    productVariantId: variant.id,
                    productId: variant.productId,
                    productNameSnapshot: variant.product.name,
                    productSlug: variant.product.slug,
                    variantNameSnapshot: variant.name,
                    skuSnapshot: variant.sku,
                    attributesSnapshot: variant.attributes,
                    imageUrl: variant.mainImageUrl ?? (images.find((i) => i.variantId === variant.id) ?? images[0])?.imageUrl ?? null,
                    quantity: line.quantity,
                    unitPrice: variant.price,
                    taxRate: variant.taxRate,
                    totalLine: money(variant.price * line.quantity),
                    weightKg: variant.product.isDigital ? 0 : Number((variant.weightKg * line.quantity).toFixed(3)),
                    trackInventory: variant.trackInventory,
                    allocations: [],
                    backorderedQuantity: 0,
                });
            });

            const subtotal = money(items.reduce((n, i) => n + i.totalLine, 0));
            const physical = variants.some((v) => !v.product.isDigital);
            const shippingFee = physical ? shippingFeeFor(subtotal, this.settings) : 0;
            const totalAmount = money(subtotal + shippingFee);
            const order = manager.create(Order, {
                reference: this.newReference(),
                customerId: owner.userId ?? null,
                email: dto.email ?? null,
                shippingAddressSnapshot: shipping,
                billingAddressSnapshot: billing,
                subtotal,
                shippingFee,
                taxAmount: money(items.reduce((n, i) => n + (i.totalLine - i.totalLine / (1 + i.taxRate / 100)), 0)),
                totalAmount,
                paymentMethod: dto.paymentMethod,
                currencyCode: this.settings.currency,
                noteToSeller: dto.noteToSeller?.trim() || null,
                totalWeightKg: Number(items.reduce((n, i) => n + i.weightKg, 0).toFixed(3)),
                items,
                payments: [manager.create(Payment, { method: dto.paymentMethod, amount: totalAmount, currencyCode: this.settings.currency })],
            });
            await manager.save(Order, order);

            if (owner.userId && !dto.addressId && dto.saveAddress) {
                const isFirst = !(await manager.exists(Address, { where: { userId: owner.userId } }));
                await manager.insert(Address, { ...shipping, userId: owner.userId, isDefault: isFirst });
            }
            await manager.delete(CartItem, { cartId: cart.id });
            await manager.update(Cart, { id: cart.id }, { lastActivity: new Date() });
            return order.reference;
        });

        return this.findByReference(reference);
    }

    myOrders(customerId: string): Promise<Order[]> {
        return this.orderRepository.find({ where: { customerId }, relations: { items: true, invoice: true }, order: { createdAt: 'DESC' } });
    }

    async myOrder(customerId: string, reference: string): Promise<Order> {
        const order = await this.findByReference(reference);
        if (order.customerId !== customerId) fail(HttpStatus.NOT_FOUND, 'Commande introuvable');
        return order;
    }

    // Suivi invité : la référence seule ne suffit pas, il faut aussi le téléphone de livraison.
    async lookup(reference: string, phone: string): Promise<Order> {
        const order = await this.orderRepository.findOne({ where: { reference }, relations: { items: true, payments: true, invoice: true } });
        if (!order || digits(order.shippingAddressSnapshot.phone) !== digits(phone)) fail(HttpStatus.NOT_FOUND, 'Commande introuvable');
        return order;
    }

    // ===================== Back-office =====================

    adminOrders(query: OrderQueryDto = {}): Promise<Order[]> {
        const qb = this.orderRepository
            .createQueryBuilder('o')
            .leftJoinAndSelect('o.items', 'i')
            .leftJoinAndSelect('o.invoice', 'inv')
            .orderBy('o.createdAt', 'DESC')
            .take(200);
        if (query.status) qb.andWhere('o.orderStatus = :status', { status: query.status });
        if (query.paymentStatus) qb.andWhere('o.paymentStatus = :paymentStatus', { paymentStatus: query.paymentStatus });
        if (query.q) {
            qb.andWhere(
                `(o.reference ILIKE :q OR o."shippingAddressSnapshot"->>'fullName' ILIKE :q OR o."shippingAddressSnapshot"->>'phone' ILIKE :q)`,
                { q: `%${query.q}%` },
            );
        }
        return qb.getMany();
    }

    adminOrder(reference: string): Promise<Order> {
        return this.findByReference(reference);
    }

    // Confirmation : le stock passe de « disponible » à « réservé » et la facture est émise.
    confirm(reference: string, actorId?: string) {
        return this.mutate(reference, async (manager, order) => {
            if (order.orderStatus !== OrderStatus.PENDING) fail(HttpStatus.CONFLICT, `Commande déjà ${order.orderStatus}`);
            await this.process(manager, order, actorId);
        });
    }

    // Validation du paiement : confirme automatiquement la commande (réservation du stock) si besoin.
    recordPayment(reference: string, dto: RecordPaymentDto, actorId?: string) {
        return this.mutate(reference, async (manager, order) => {
            if (order.orderStatus === OrderStatus.CANCELLED) fail(HttpStatus.CONFLICT, 'Commande annulée');
            if (order.paymentStatus === PaymentStatus.PAID) fail(HttpStatus.CONFLICT, 'Paiement déjà enregistré');
            this.markPaid(manager, order, dto);
            if (order.orderStatus === OrderStatus.PENDING) await this.process(manager, order, actorId);
            await this.invoicesService.setStatus(manager, order.id, InvoiceStatus.PAID);
        });
    }

    // Expédition : le stock réservé sort physiquement de l'entrepôt, le client reçoit le numéro de suivi.
    ship(reference: string, dto: ShipOrderDto, actorId?: string) {
        return this.mutate(reference, async (manager, order) => {
            if (order.orderStatus !== OrderStatus.PROCESSING) fail(HttpStatus.CONFLICT, 'Seule une commande en préparation peut être expédiée');
            const ctx = this.ctx(order, actorId, `Expédition ${dto.carrier}`);

            // Précommandes : le reliquat doit être couvert par le stock arrivé depuis.
            const pending = order.items.filter((i) => i.backorderedQuantity > 0);
            if (pending.length) {
                const reserved = await this.inventoryService.reserve(
                    manager,
                    pending.map((i) => ({ variantId: i.productVariantId, quantity: i.backorderedQuantity, label: `${i.productNameSnapshot} (${i.skuSnapshot}) en précommande`, allowBackorder: false })),
                    ctx,
                );
                for (const item of pending) {
                    item.allocations = [...item.allocations, ...reserved.get(item.productVariantId)!.allocations];
                    item.backorderedQuantity = 0;
                }
            }

            await this.inventoryService.commitSale(manager, order.items.filter((i) => i.trackInventory), ctx);
            for (const item of order.items) await manager.increment(Product, { id: item.productId }, 'soldCount', item.quantity);
            Object.assign(order, { orderStatus: OrderStatus.SHIPPED, carrier: dto.carrier, trackingNumber: dto.trackingNumber, shippedAt: new Date() });
        });
    }

    deliver(reference: string) {
        return this.mutate(reference, async (manager, order) => {
            if (order.orderStatus !== OrderStatus.SHIPPED) fail(HttpStatus.CONFLICT, "La commande n'a pas encore été expédiée");
            // Paiement à la livraison : l'argent est encaissé à la remise du colis.
            if (order.paymentMethod === PaymentMethod.CASH_ON_DELIVERY && order.paymentStatus === PaymentStatus.PENDING) {
                this.markPaid(manager, order, { provider: 'cash' });
                await this.invoicesService.setStatus(manager, order.id, InvoiceStatus.PAID);
            }
            Object.assign(order, { orderStatus: OrderStatus.COMPLETED, deliveredAt: new Date() });
        });
    }

    cancel(reference: string, dto: CancelOrderDto, actorId?: string) {
        return this.mutate(reference, async (manager, order) => {
            if (order.orderStatus !== OrderStatus.PENDING && order.orderStatus !== OrderStatus.PROCESSING) {
                fail(HttpStatus.CONFLICT, 'Une commande expédiée ou livrée ne peut plus être annulée');
            }
            if (order.orderStatus === OrderStatus.PROCESSING) {
                await this.inventoryService.release(manager, order.items.filter((i) => i.trackInventory), this.ctx(order, actorId, dto.reason));
                for (const item of order.items) item.allocations = [];
            }
            await this.invoicesService.setStatus(manager, order.id, InvoiceStatus.VOID);
            Object.assign(order, { orderStatus: OrderStatus.CANCELLED, cancelReason: dto.reason, cancelledAt: new Date() });
        });
    }

    // ===================== Interne =====================

    private async findByReference(reference: string): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { reference },
            relations: { items: true, payments: true, invoice: true },
            order: { payments: { createdAt: 'ASC' } },
        });
        if (!order) fail(HttpStatus.NOT_FOUND, 'Commande introuvable');
        return order;
    }

    // Verrouille la commande, applique la transition, enregistre, puis renvoie la commande à jour.
    private async mutate(reference: string, change: (manager: EntityManager, order: Order) => Promise<void>): Promise<Order> {
        await this.dataSource.transaction(async (manager) => {
            const order = await manager
                .getRepository(Order)
                .createQueryBuilder('o')
                .where('o.reference = :reference', { reference })
                .setLock('pessimistic_write')
                .getOne();
            if (!order) fail(HttpStatus.NOT_FOUND, 'Commande introuvable');
            order.items = await manager.find(OrderItem, { where: { orderId: order.id } });
            order.payments = await manager.find(Payment, { where: { orderId: order.id }, order: { createdAt: 'ASC' } });

            await change(manager, order);

            const { id, items, payments, invoice: _invoice, createdAt: _createdAt, updatedAt: _updatedAt, ...columns } = order;
            await manager.update(Order, { id }, columns);
            for (const item of items) {
                await manager.update(OrderItem, { id: item.id }, { allocations: item.allocations, backorderedQuantity: item.backorderedQuantity });
            }
            for (const payment of payments) await manager.save(Payment, payment);
        });
        return this.findByReference(reference);
    }

    // PENDING → PROCESSING : réservation du stock et émission de la facture.
    private async process(manager: EntityManager, order: Order, actorId?: string) {
        const tracked = order.items.filter((i) => i.trackInventory);
        const variants = await manager.find(ProductVariant, { where: { id: In(tracked.map((i) => i.productVariantId)) } });
        const reserved = await this.inventoryService.reserve(
            manager,
            tracked.map((i) => ({
                variantId: i.productVariantId,
                quantity: i.quantity,
                label: `${i.productNameSnapshot} (${i.skuSnapshot})`,
                allowBackorder: variants.find((v) => v.id === i.productVariantId)?.allowBackorder ?? false,
            })),
            this.ctx(order, actorId),
        );
        for (const item of tracked) {
            const r = reserved.get(item.productVariantId)!;
            item.allocations = r.allocations;
            item.backorderedQuantity = r.backordered;
        }
        Object.assign(order, { orderStatus: OrderStatus.PROCESSING, confirmedAt: new Date() });
        await this.invoicesService.issue(manager, order);
    }

    private markPaid(manager: EntityManager, order: Order, dto: RecordPaymentDto) {
        let payment = order.payments.find((p) => p.status === PaymentStatus.PENDING);
        if (!payment) {
            payment = manager.create(Payment, { orderId: order.id, method: order.paymentMethod, currencyCode: order.currencyCode, amount: order.totalAmount });
            order.payments.push(payment);
        }
        Object.assign(payment, {
            status: PaymentStatus.PAID,
            provider: dto.provider ?? payment.provider ?? 'manual',
            transactionRef: dto.transactionRef ?? null,
            amount: dto.amount ?? order.totalAmount,
            paidAt: new Date(),
        });
        order.paymentStatus = PaymentStatus.PAID;
    }

    private ctx(order: Order, createdBy?: string, reason?: string): MovementContext {
        return { referenceType: MovementReferenceType.ORDER, referenceId: order.reference, createdBy, reason };
    }

    private async resolveShipping(owner: CartOwner, dto: CheckoutDto): Promise<AddressSnapshot> {
        if (dto.addressId) {
            if (!owner.userId) fail(HttpStatus.UNAUTHORIZED, 'Connectez-vous pour utiliser une adresse enregistrée');
            const saved = await this.addressesService.findOne(owner.userId, dto.addressId);
            this.addressesService.assertCity(saved.city);
            return snapshotOf({ ...saved, fullName: saved.fullName ?? '', phone: saved.phone ?? '', line2: saved.line2 ?? undefined, landmark: saved.landmark ?? undefined });
        }
        if (!dto.address) fail(HttpStatus.BAD_REQUEST, 'Adresse de livraison manquante');
        this.addressesService.assertCity(dto.address.city);
        return snapshotOf(dto.address);
    }

    // ORD-AAAA-XXXXXX : lisible au téléphone, sans caractères ambigus (0/O, 1/I).
    private newReference(date = new Date()): string {
        const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
        const suffix = [...randomBytes(6)].map((b) => alphabet[b % alphabet.length]).join('');
        return `ORD-${date.getUTCFullYear()}-${suffix}`;
    }
}
