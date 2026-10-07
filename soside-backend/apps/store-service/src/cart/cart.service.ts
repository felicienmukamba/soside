import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { AddCartItemDto, CartOwner, ProductStatus } from '@app/store-contracts';
import { Cart, CartItem, ProductVariant } from '../entities';
import { isPurchasable, sellableQuantity } from '../catalog/catalog.service';
import { fail, loadSettings, money, shippingFeeFor } from '../common/helpers';

export type CartIssue = 'unavailable' | 'insufficient_stock' | null;

@Injectable()
export class CartService {
    private readonly settings = loadSettings();

    constructor(
        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,
        @InjectRepository(CartItem)
        private readonly itemRepository: Repository<CartItem>,
        @InjectRepository(ProductVariant)
        private readonly variantRepository: Repository<ProductVariant>,
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) { }

    async getCart(owner: CartOwner) {
        return this.view(await this.findCart(owner, false));
    }

    async addItem(owner: CartOwner, dto: AddCartItemDto) {
        const cart = await this.findCart(owner, true);
        const variant = await this.sellableVariant(dto.variantId);
        const existing = cart.items.find((i) => i.variantId === dto.variantId);
        const quantity = (existing?.quantity ?? 0) + dto.quantity;
        this.assertQuantity(variant, quantity);

        if (existing) await this.itemRepository.update({ id: existing.id }, { quantity });
        else await this.itemRepository.insert({ cartId: cart.id, variantId: dto.variantId, quantity });
        await this.touch(cart.id);
        return this.getCart(owner);
    }

    async updateItem(owner: CartOwner, variantId: string, quantity: number) {
        const cart = await this.findCart(owner, false);
        const item = cart?.items.find((i) => i.variantId === variantId);
        if (!cart || !item) fail(HttpStatus.NOT_FOUND, "Cet article n'est pas dans le panier");

        if (quantity === 0) {
            await this.itemRepository.delete({ id: item.id });
        } else {
            this.assertQuantity(await this.sellableVariant(variantId), quantity);
            await this.itemRepository.update({ id: item.id }, { quantity });
        }
        await this.touch(cart.id);
        return this.getCart(owner);
    }

    // À la connexion : le panier invité rejoint le panier du compte.
    async merge(customerId: string, sessionId: string) {
        await this.dataSource.transaction(async (manager) => {
            const guest = await manager.findOne(Cart, { where: { sessionId }, relations: { items: true } });
            if (!guest) return;
            let target = await manager.findOne(Cart, { where: { customerId }, relations: { items: true } });
            if (!target) target = await manager.save(Cart, manager.create(Cart, { customerId, items: [] }));

            const variants = await manager.find(ProductVariant, { where: { id: In(guest.items.map((i) => i.variantId)) } });
            for (const item of guest.items) {
                const variant = variants.find((v) => v.id === item.variantId);
                if (!variant) continue;
                const existing = target.items.find((i) => i.variantId === item.variantId);
                const wanted = Math.min(50, (existing?.quantity ?? 0) + item.quantity);
                const cap = variant.allowBackorder ? null : sellableQuantity(variant);
                const quantity = Math.max(1, cap === null ? wanted : Math.min(wanted, cap));
                if (existing) await manager.update(CartItem, { id: existing.id }, { quantity });
                else await manager.insert(CartItem, { cartId: target.id, variantId: item.variantId, quantity });
            }
            await manager.update(Cart, { id: target.id }, { lastActivity: new Date() });
            await manager.delete(Cart, { id: guest.id });
        });
        return this.getCart({ userId: customerId });
    }

    // Panier du client connecté en priorité, sinon panier invité.
    async findCart(owner: CartOwner, create: true): Promise<Cart>;
    async findCart(owner: CartOwner, create: false): Promise<Cart | null>;
    async findCart(owner: CartOwner, create: boolean): Promise<Cart | null> {
        const where = owner.userId ? { customerId: owner.userId } : owner.sessionId ? { sessionId: owner.sessionId } : null;
        if (!where) fail(HttpStatus.BAD_REQUEST, 'Panier non identifié');
        const cart = await this.cartRepository.findOne({ where, relations: { items: true }, order: { items: { createdAt: 'ASC' } } });
        if (cart || !create) return cart;
        return this.cartRepository.save(this.cartRepository.create({ ...where, items: [] }));
    }

    async view(cart: Cart | null) {
        const empty = { id: cart?.id ?? null, items: [], count: 0, subtotal: 0, shippingFee: 0, total: 0, currencyCode: this.settings.currency, hasIssues: false };
        if (!cart || cart.items.length === 0) return empty;

        const variants = await this.variantRepository.find({
            where: { id: In(cart.items.map((i) => i.variantId)) },
            relations: { product: { images: true } },
        });
        const byId = new Map(variants.map((v) => [v.id, v]));

        const items = cart.items
            .filter((item) => byId.has(item.variantId))
            .map((item) => {
                const variant = byId.get(item.variantId)!;
                const available = sellableQuantity(variant);
                const sellable = variant.isActive && variant.product.status === ProductStatus.PUBLISHED && isPurchasable(variant);
                const issue: CartIssue = !sellable
                    ? 'unavailable'
                    : available !== null && !variant.allowBackorder && available < item.quantity ? 'insufficient_stock' : null;
                const images = [...variant.product.images].sort((a, b) => a.displayOrder - b.displayOrder);
                return {
                    variantId: variant.id,
                    sku: variant.sku,
                    variantName: variant.name,
                    attributes: variant.attributes,
                    productId: variant.productId,
                    productName: variant.product.name,
                    productSlug: variant.product.slug,
                    isDigital: variant.product.isDigital,
                    imageUrl: variant.mainImageUrl ?? (images.find((i) => i.variantId === variant.id) ?? images[0])?.imageUrl ?? null,
                    unitPrice: variant.price,
                    compareAtPrice: variant.compareAtPrice,
                    quantity: item.quantity,
                    totalLine: money(variant.price * item.quantity),
                    available,
                    backordered: available !== null && variant.allowBackorder ? Math.max(0, item.quantity - available) : 0,
                    issue,
                };
            });

        const valid = items.filter((i) => !i.issue);
        const subtotal = money(valid.reduce((n, i) => n + i.totalLine, 0));
        const shippingFee = valid.every((i) => i.isDigital) ? 0 : shippingFeeFor(subtotal, this.settings);
        return {
            id: cart.id,
            items,
            count: items.reduce((n, i) => n + i.quantity, 0),
            subtotal,
            shippingFee,
            total: money(subtotal + shippingFee),
            currencyCode: this.settings.currency,
            hasIssues: items.some((i) => i.issue),
        };
    }

    private touch(cartId: string) {
        return this.cartRepository.update({ id: cartId }, { lastActivity: new Date() });
    }

    private async sellableVariant(variantId: string) {
        const variant = await this.variantRepository.findOne({ where: { id: variantId }, relations: { product: true } });
        if (!variant || !variant.isActive || variant.product.status !== ProductStatus.PUBLISHED) {
            fail(HttpStatus.NOT_FOUND, "Ce produit n'est plus disponible");
        }
        return variant;
    }

    private assertQuantity(variant: ProductVariant, quantity: number) {
        const available = sellableQuantity(variant);
        if (available === null || variant.allowBackorder) return;
        if (available <= 0) fail(HttpStatus.CONFLICT, `${variant.product.name} est en rupture de stock`);
        if (quantity > available) fail(HttpStatus.CONFLICT, `Plus que ${available} exemplaire(s) de ${variant.product.name} en stock`);
    }
}
