import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { MovementReferenceType, MovementType, ProductStatus } from '@app/store-contracts';
import { Address, Brand, Category, Inventory, Product, ProductImage, ProductVariant, StockMovement, Warehouse } from '../entities';
import { CatalogService } from '../catalog/catalog.service';
import { InventoryService } from '../inventory/inventory.service';
import { InvoicesService } from '../orders/invoices.service';
import { slugify } from '../common/helpers';
import { seedCategories, seedProducts, seedWarehouses } from './catalog.seed';

const VAT_RATE = 16; // TVA RDC, incluse dans les prix affichés

@Injectable()
export class SeedService implements OnApplicationBootstrap {
    private readonly logger = new Logger(SeedService.name);

    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
        private readonly catalogService: CatalogService,
        private readonly inventoryService: InventoryService,
        private readonly invoicesService: InvoicesService,
    ) { }

    async onApplicationBootstrap() {
        await this.catalogService.enableUnaccent();
        await this.invoicesService.ensureSequence();
        if (process.env.STORE_SEED === 'false') return;
        if ((await this.dataSource.getRepository(Category).count()) > 0) return;

        await this.dataSource.transaction(async (manager) => {
            const categories = new Map<string, Category>();
            for (const [position, c] of seedCategories.entries()) {
                const parent = c.parent ? categories.get(c.parent) : undefined;
                categories.set(c.slug, await manager.save(Category, manager.create(Category, {
                    slug: c.slug, name: c.name, description: c.description ?? null, parentId: parent?.id ?? null, level: parent ? parent.level + 1 : 0, position,
                })));
            }

            const brands = new Map<string, Brand>();
            for (const name of [...new Set(seedProducts.flatMap((p) => (p.brand ? [p.brand] : [])))].sort()) {
                brands.set(name, await manager.save(Brand, manager.create(Brand, { name, slug: slugify(name) })));
            }

            const warehouses: Warehouse[] = [];
            for (const [index, w] of seedWarehouses.entries()) {
                const address = await manager.save(Address, manager.create(Address, { userId: null, city: w.city, line1: w.line1 }));
                warehouses.push(await manager.save(Warehouse, manager.create(Warehouse, { code: w.code, name: w.name, addressId: address.id, isDefault: index === 0 })));
            }
            const [main, secondary] = warehouses;

            const variantIds: string[] = [];
            for (const [productIndex, p] of seedProducts.entries()) {
                const product = await manager.save(Product, manager.create(Product, {
                    slug: p.slug,
                    name: p.name,
                    status: ProductStatus.PUBLISHED,
                    categoryId: categories.get(p.category)!.id,
                    brandId: p.brand ? brands.get(p.brand)!.id : null,
                    condition: p.condition,
                    descriptionShort: p.descriptionShort,
                    descriptionHtml: p.descriptionHtml,
                    tags: p.tags,
                    specs: p.specs,
                    options: p.options,
                    seoTitle: p.seoTitle,
                    seoDescription: p.seoDescription,
                    isFeatured: p.isFeatured,
                    rating: p.rating,
                    soldCount: p.soldCount,
                    publishedAt: new Date(),
                }));

                if (p.images.length) {
                    await manager.insert(ProductImage, p.images.map((image, displayOrder) => ({
                        productId: product.id, imageUrl: image.imageUrl, altText: image.altText ?? p.name, displayOrder,
                    })));
                }

                for (const [position, v] of p.variants.entries()) {
                    const variant = await manager.save(ProductVariant, manager.create(ProductVariant, {
                        productId: product.id,
                        sku: v.sku,
                        name: v.name || Object.values(v.attributes).join(' · ') || 'Standard',
                        attributes: v.attributes,
                        price: v.price,
                        compareAtPrice: v.compareAtPrice,
                        costPrice: Math.round(v.price * 0.78),
                        taxRate: VAT_RATE,
                        weightKg: v.weightKg,
                        dimensionsLwh: v.dimensionsLwh,
                        mainImageUrl: v.mainImageUrl,
                        position,
                    }));
                    variantIds.push(variant.id);

                    // Stock initial réparti entre les deux dépôts, tracé comme un réapprovisionnement.
                    const split = [
                        { warehouse: main, quantity: Math.ceil(v.stock * 0.6) },
                        { warehouse: secondary, quantity: v.stock - Math.ceil(v.stock * 0.6) },
                    ];
                    for (const { warehouse, quantity } of split) {
                        const binLocation = `${String.fromCharCode(65 + (productIndex % 6))}-${String(position + 1).padStart(2, '0')}`;
                        const { identifiers } = await manager.insert(Inventory, { variantId: variant.id, warehouseId: warehouse.id, quantityOnHand: quantity, binLocation });
                        if (quantity > 0) {
                            await manager.insert(StockMovement, {
                                inventoryId: identifiers[0].id, type: MovementType.RESTOCK, quantityChange: quantity, quantity,
                                beforeQuantity: 0, afterQuantity: quantity, reservedBefore: 0, reservedAfter: 0,
                                referenceType: MovementReferenceType.MANUAL, reason: 'Stock initial',
                            });
                        }
                    }
                }
            }
            await this.inventoryService.refreshVariants(manager, variantIds);
        });
        this.logger.log(`Catalogue initial inséré : ${seedProducts.length} produits, ${seedWarehouses.length} entrepôts`);
    }
}
