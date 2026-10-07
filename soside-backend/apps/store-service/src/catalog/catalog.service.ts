import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, In, Not, Repository } from 'typeorm';
import sanitizeHtml from 'sanitize-html';
import {
    AdminProductQueryDto, CreateBrandDto, CreateCategoryDto, CreateProductDto, ProductQueryDto, ProductStatus,
    SetImagesDto, SetVariantsDto, StockStatus, UpdateBrandDto, UpdateCategoryDto, UpdateProductDto,
} from '@app/store-contracts';
import { Brand, Category, Product, ProductImage, ProductOption, ProductVariant } from '../entities';
import { InventoryService } from '../inventory/inventory.service';
import { fail, slugify } from '../common/helpers';

export interface CategoryNode {
    id: string;
    parentId: string | null;
    name: string;
    slug: string;
    iconUrl: string | null;
    level: number;
    description: string | null;
    position: number;
    isActive: boolean;
    productCount: number;
    children: CategoryNode[];
}

const HTML_OPTIONS: sanitizeHtml.IOptions = {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img', 'h1', 'h2'],
    allowedAttributes: { a: ['href', 'target', 'rel'], img: ['src', 'alt', 'width', 'height'], '*': ['class'] },
    allowedSchemes: ['http', 'https', 'mailto'],
};

const cleanHtml = (html?: string | null) => (html ? sanitizeHtml(html, HTML_OPTIONS) : null);

// Quantité vendable d'une variante : null = illimitée (stock non suivi).
export function sellableQuantity(variant: ProductVariant): number | null {
    if (!variant.trackInventory) return null;
    return Math.max(0, variant.quantityOnHand - variant.quantityReserved);
}

@Injectable()
export class CatalogService {
    private readonly logger = new Logger(CatalogService.name);
    private hasUnaccent = false;

    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Brand)
        private readonly brandRepository: Repository<Brand>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(ProductVariant)
        private readonly variantRepository: Repository<ProductVariant>,
        private readonly inventoryService: InventoryService,
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) { }

    // Recherche insensible aux accents (« ecran » trouve « Écran ») si l'extension est disponible.
    async enableUnaccent() {
        try {
            await this.dataSource.query('CREATE EXTENSION IF NOT EXISTS unaccent');
            this.hasUnaccent = true;
        } catch {
            this.logger.warn('Extension unaccent indisponible : recherche sensible aux accents');
        }
    }

    // ===================== Taxonomie =====================

    async categoryTree(includeInactive = false): Promise<CategoryNode[]> {
        const categories = await this.categoryRepository.find({ order: { position: 'ASC', name: 'ASC' } });
        const counts: { categoryId: string; count: string }[] = await this.productRepository
            .createQueryBuilder('p')
            .select('p.categoryId', 'categoryId')
            .addSelect('COUNT(*)', 'count')
            .where('p.status = :status', { status: ProductStatus.PUBLISHED })
            .groupBy('p.categoryId')
            .getRawMany();
        const countBy = new Map(counts.map((c) => [c.categoryId, Number(c.count)]));

        const nodes = new Map<string, CategoryNode>();
        for (const c of categories) {
            if (!includeInactive && !c.isActive) continue;
            nodes.set(c.id, {
                id: c.id, parentId: c.parentId, name: c.name, slug: c.slug, iconUrl: c.iconUrl, level: c.level,
                description: c.description, position: c.position, isActive: c.isActive, productCount: countBy.get(c.id) ?? 0, children: [],
            });
        }
        const roots: CategoryNode[] = [];
        for (const node of nodes.values()) {
            const parent = node.parentId ? nodes.get(node.parentId) : undefined;
            if (parent) parent.children.push(node);
            else if (!node.parentId) roots.push(node);
        }
        // Le compteur d'une catégorie inclut ses sous-catégories.
        const total = (node: CategoryNode): number => (node.productCount += node.children.reduce((n, c) => n + total(c), 0));
        roots.forEach(total);
        return roots;
    }

    // Ids de la catégorie et de toutes ses descendantes.
    async categoryWithDescendants(slug: string): Promise<string[]> {
        const all = await this.categoryRepository.find({ select: { id: true, slug: true, parentId: true } });
        const root = all.find((c) => c.slug === slug);
        if (!root) return [];
        const ids = [root.id];
        for (let i = 0; i < ids.length; i++) all.filter((c) => c.parentId === ids[i]).forEach((c) => ids.push(c.id));
        return ids;
    }

    async createCategory(dto: CreateCategoryDto): Promise<Category> {
        const slug = dto.slug ?? slugify(dto.name);
        if (await this.categoryRepository.exists({ where: { slug } })) fail(HttpStatus.CONFLICT, `Le slug « ${slug} » existe déjà`);
        let level = 0;
        if (dto.parentId) {
            const parent = await this.categoryRepository.findOne({ where: { id: dto.parentId } });
            if (!parent) fail(HttpStatus.BAD_REQUEST, 'Catégorie parente introuvable');
            level = parent.level + 1;
        }
        return this.categoryRepository.save(this.categoryRepository.create({ ...dto, slug, level }));
    }

    async updateCategory(id: string, dto: UpdateCategoryDto): Promise<Category> {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) fail(HttpStatus.NOT_FOUND, 'Catégorie introuvable');
        if (dto.slug && dto.slug !== category.slug && (await this.categoryRepository.exists({ where: { slug: dto.slug } }))) {
            fail(HttpStatus.CONFLICT, `Le slug « ${dto.slug} » existe déjà`);
        }

        const all = await this.categoryRepository.find({ select: { id: true, parentId: true, level: true } });
        const byId = new Map(all.map((c) => [c.id, c]));
        const moving = dto.parentId !== undefined && dto.parentId !== category.parentId;
        if (moving && dto.parentId) {
            // Interdit de placer une catégorie sous elle-même ou sous une de ses descendantes.
            if (!byId.has(dto.parentId)) fail(HttpStatus.BAD_REQUEST, 'Catégorie parente introuvable');
            for (let cursor: string | null | undefined = dto.parentId; cursor; cursor = byId.get(cursor)?.parentId) {
                if (cursor === id) fail(HttpStatus.BAD_REQUEST, 'Une catégorie ne peut pas être rangée dans ses propres sous-catégories');
            }
        }

        return this.dataSource.transaction(async (manager) => {
            const saved = await manager.save(Category, manager.merge(Category, category, dto));
            if (moving) {
                // Recalcule la profondeur de la catégorie déplacée et de toute sa descendance.
                const level = dto.parentId ? byId.get(dto.parentId)!.level + 1 : 0;
                const queue: [string, number][] = [[id, level]];
                while (queue.length) {
                    const [nodeId, nodeLevel] = queue.shift()!;
                    await manager.update(Category, { id: nodeId }, { level: nodeLevel });
                    all.filter((c) => c.parentId === nodeId && c.id !== id).forEach((c) => queue.push([c.id, nodeLevel + 1]));
                }
                saved.level = level;
            }
            return saved;
        });
    }

    async deleteCategory(id: string): Promise<{ id: string; deleted: true }> {
        if (await this.categoryRepository.exists({ where: { parentId: id } })) {
            fail(HttpStatus.CONFLICT, "Déplacez ou supprimez d'abord les sous-catégories");
        }
        if (await this.productRepository.exists({ where: { categoryId: id } })) {
            fail(HttpStatus.CONFLICT, 'Des produits utilisent encore cette catégorie');
        }
        const result = await this.categoryRepository.delete({ id });
        if (!result.affected) fail(HttpStatus.NOT_FOUND, 'Catégorie introuvable');
        return { id, deleted: true };
    }

    findBrands(includeInactive = false): Promise<Brand[]> {
        return this.brandRepository.find({ where: includeInactive ? {} : { isActive: true }, order: { name: 'ASC' } });
    }

    async createBrand(dto: CreateBrandDto): Promise<Brand> {
        const slug = dto.slug ?? slugify(dto.name);
        if (await this.brandRepository.exists({ where: [{ slug }, { name: dto.name }] })) {
            fail(HttpStatus.CONFLICT, `La marque ${dto.name} existe déjà`);
        }
        return this.brandRepository.save(this.brandRepository.create({ ...dto, slug }));
    }

    async updateBrand(id: string, dto: UpdateBrandDto): Promise<Brand> {
        const brand = await this.brandRepository.findOne({ where: { id } });
        if (!brand) fail(HttpStatus.NOT_FOUND, 'Marque introuvable');
        const conflicts = [
            ...(dto.slug ? [{ slug: dto.slug, id: Not(id) }] : []),
            ...(dto.name ? [{ name: dto.name, id: Not(id) }] : []),
        ];
        if (conflicts.length && (await this.brandRepository.exists({ where: conflicts }))) {
            fail(HttpStatus.CONFLICT, 'Une autre marque porte déjà ce nom ou ce slug');
        }
        return this.brandRepository.save(this.brandRepository.merge(brand, dto));
    }

    async deleteBrand(id: string): Promise<{ id: string; deleted: true }> {
        if (await this.productRepository.exists({ where: { brandId: id } })) fail(HttpStatus.CONFLICT, 'Des produits utilisent encore cette marque');
        const result = await this.brandRepository.delete({ id });
        if (!result.affected) fail(HttpStatus.NOT_FOUND, 'Marque introuvable');
        return { id, deleted: true };
    }

    // ===================== Catalogue public =====================

    async findProducts(query: ProductQueryDto = {}) {
        const limit = query.limit ?? 24;
        const qb = this.productRepository
            .createQueryBuilder('p')
            .leftJoinAndSelect('p.brand', 'b')
            .innerJoinAndSelect('p.category', 'c')
            .innerJoinAndSelect('p.variants', 'v', 'v.isActive = true')
            .leftJoinAndSelect('p.images', 'img')
            .where('p.status = :status', { status: ProductStatus.PUBLISHED });

        if (query.category) {
            const ids = await this.categoryWithDescendants(query.category);
            if (ids.length === 0) return { items: [], total: 0, page: 1, limit };
            qb.andWhere({ categoryId: In(ids) });
        }
        if (query.brand) qb.andWhere('b.slug = :brand', { brand: query.brand });
        if (query.condition) qb.andWhere('p.condition = :condition', { condition: query.condition });
        if (query.featured) qb.andWhere('p.isFeatured = true');

        const fold = (sql: string) => (this.hasUnaccent ? `unaccent(${sql})` : sql);
        const terms = (query.q ?? '').trim().split(/\s+/).filter(Boolean).slice(0, 8);
        terms.forEach((term, i) => {
            const param = { [`t${i}`]: `%${term.replace(/[\\%_]/g, '\\$&')}%` };
            qb.andWhere(
                new Brackets((w) => {
                    for (const column of ['p.name', 'b.name', 'c.name', 'p.descriptionShort', 'p.specs::text', 'p.tags::text']) {
                        w.orWhere(`${fold(column)} ILIKE ${fold(`:t${i}`)}`, param);
                    }
                }),
            );
        });

        let items = (await qb.getMany()).map((p) => this.toSummary(p));
        if (query.promo) items = items.filter((p) => p.compareAtPrice !== null);

        const by: Record<NonNullable<ProductQueryDto['sort']>, (a: Summary, b: Summary) => number> = {
            relevance: (a, b) => Number(b.isFeatured) - Number(a.isFeatured) || b.soldCount - a.soldCount,
            popular: (a, b) => b.soldCount - a.soldCount,
            newest: (a, b) => +new Date(b.publishedAt ?? 0) - +new Date(a.publishedAt ?? 0),
            price_asc: (a, b) => a.priceFrom - b.priceFrom,
            price_desc: (a, b) => b.priceFrom - a.priceFrom,
        };
        items.sort(by[query.sort ?? 'relevance']);

        const page = query.page ?? 1;
        return { items: items.slice((page - 1) * limit, page * limit), total: items.length, page, limit };
    }

    async findProduct(slug: string) {
        const product = await this.productRepository.findOne({
            where: { slug, status: ProductStatus.PUBLISHED },
            relations: { brand: true, category: true, variants: true, images: true },
            order: { variants: { position: 'ASC' }, images: { displayOrder: 'ASC' } },
        });
        if (!product) fail(HttpStatus.NOT_FOUND, `Produit introuvable : ${slug}`);

        const variants = product.variants.filter((v) => v.isActive);
        return {
            ...this.toSummary({ ...product, variants }),
            descriptionHtml: product.descriptionHtml,
            specs: product.specs,
            options: product.options,
            tags: product.tags,
            isDigital: product.isDigital,
            seoTitle: product.seoTitle,
            seoDescription: product.seoDescription,
            breadcrumb: await this.breadcrumb(product.categoryId),
            images: product.images,
            variants: variants.map((v) => ({
                id: v.id,
                sku: v.sku,
                name: v.name,
                attributes: v.attributes,
                price: v.price,
                compareAtPrice: v.compareAtPrice,
                weightKg: v.weightKg,
                dimensionsLwh: v.dimensionsLwh,
                mainImageUrl: v.mainImageUrl,
                stockStatus: v.stockStatus,
                available: sellableQuantity(v),
                allowBackorder: v.allowBackorder,
                purchasable: isPurchasable(v),
            })),
        };
    }

    // ===================== Back-office produits =====================

    async adminProducts(query: AdminProductQueryDto = {}) {
        const qb = this.productRepository
            .createQueryBuilder('p')
            .leftJoinAndSelect('p.brand', 'b')
            .leftJoinAndSelect('p.category', 'c')
            .leftJoinAndSelect('p.variants', 'v')
            .leftJoinAndSelect('p.images', 'img')
            .orderBy('p.updatedAt', 'DESC');
        if (query.status) qb.andWhere('p.status = :status', { status: query.status });
        if (query.q) qb.andWhere('(p.name ILIKE :q OR v.sku ILIKE :q)', { q: `%${query.q}%` });

        return (await qb.getMany()).map((p) => {
            const active = p.variants.filter((v) => v.isActive);
            const prices = active.map((v) => v.price);
            const tracked = active.filter((v) => v.trackInventory);
            return {
                id: p.id,
                name: p.name,
                slug: p.slug,
                status: p.status,
                brand: p.brand?.name ?? null,
                category: p.category?.name ?? null,
                image: [...p.images].sort((a, b) => a.displayOrder - b.displayOrder)[0]?.imageUrl ?? active[0]?.mainImageUrl ?? null,
                variantsCount: active.length,
                priceMin: prices.length ? Math.min(...prices) : null,
                priceMax: prices.length ? Math.max(...prices) : null,
                quantityOnHand: tracked.reduce((n, v) => n + v.quantityOnHand, 0),
                quantityReserved: tracked.reduce((n, v) => n + v.quantityReserved, 0),
                quantityAvailable: tracked.reduce((n, v) => n + v.quantityAvailable, 0),
                stockStatus: worstStatus(tracked),
                updatedAt: p.updatedAt,
            };
        });
    }

    async adminProduct(id: string) {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: { brand: true, category: true, variants: { inventories: { warehouse: true } }, images: true },
            order: { variants: { position: 'ASC' }, images: { displayOrder: 'ASC' } },
        });
        if (!product) fail(HttpStatus.NOT_FOUND, 'Produit introuvable');
        return product;
    }

    async createProduct(dto: CreateProductDto): Promise<Product> {
        if (dto.status === ProductStatus.PUBLISHED) {
            fail(HttpStatus.BAD_REQUEST, 'Enregistrez le produit en brouillon et ajoutez ses variantes avant de le publier');
        }
        await this.assertTaxonomy(dto.categoryId, dto.brandId);
        this.assertOptions(dto.options ?? []);

        const slug = dto.slug ?? (await this.uniqueSlug(slugify(dto.name)));
        if (dto.slug && (await this.productRepository.exists({ where: { slug } }))) fail(HttpStatus.CONFLICT, `Le slug « ${slug} » existe déjà`);

        return this.productRepository.save(this.productRepository.create({ ...dto, slug, descriptionHtml: cleanHtml(dto.descriptionHtml) }));
    }

    async updateProduct(id: string, dto: UpdateProductDto): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) fail(HttpStatus.NOT_FOUND, 'Produit introuvable');

        if (dto.categoryId || dto.brandId) await this.assertTaxonomy(dto.categoryId ?? product.categoryId, dto.brandId);
        if (dto.options) this.assertOptions(dto.options);
        if (dto.slug && dto.slug !== product.slug && (await this.productRepository.exists({ where: { slug: dto.slug } }))) {
            fail(HttpStatus.CONFLICT, `Le slug « ${dto.slug} » existe déjà`);
        }
        if (dto.status === ProductStatus.PUBLISHED && !(await this.variantRepository.exists({ where: { productId: id, isActive: true } }))) {
            fail(HttpStatus.BAD_REQUEST, 'Ajoutez au moins une variante active avant de publier');
        }

        const next = this.productRepository.merge(product, dto);
        if (dto.descriptionHtml !== undefined) next.descriptionHtml = cleanHtml(dto.descriptionHtml);
        if (next.status === ProductStatus.PUBLISHED && !next.publishedAt) next.publishedAt = new Date();
        return this.productRepository.save(next);
    }

    // Enregistre la matrice complète des variantes : création, mise à jour, et archivage des lignes retirées.
    async setVariants(productId: string, dto: SetVariantsDto) {
        await this.dataSource.transaction(async (manager) => {
            const product = await manager.findOne(Product, { where: { id: productId }, relations: { variants: true } });
            if (!product) fail(HttpStatus.NOT_FOUND, 'Produit introuvable');
            this.assertVariantMatrix(product.options, dto);

            const skus = dto.variants.map((v) => v.sku);
            const taken = await manager.find(ProductVariant, { where: { sku: In(skus), productId: Not(productId) }, select: { sku: true } });
            if (taken.length) fail(HttpStatus.CONFLICT, `SKU déjà utilisé(s) par un autre produit : ${taken.map((t) => t.sku).join(', ')}`);

            const kept: string[] = [];
            for (const [position, input] of dto.variants.entries()) {
                const existing = product.variants.find((v) => (input.id ? v.id === input.id : v.sku === input.sku));
                if (input.id && !existing) fail(HttpStatus.BAD_REQUEST, `Variante ${input.id} inconnue pour ce produit`);
                const values: Partial<ProductVariant> = {
                    sku: input.sku,
                    barcode: input.barcode ?? null,
                    name: input.name?.trim() || Object.values(input.attributes).join(' · ') || 'Standard',
                    attributes: input.attributes,
                    price: input.price,
                    compareAtPrice: input.compareAtPrice && input.compareAtPrice > input.price ? input.compareAtPrice : null,
                    costPrice: input.costPrice ?? null,
                    taxRate: input.taxRate ?? 0,
                    weightKg: product.isDigital ? 0 : (input.weightKg ?? 0),
                    dimensionsLwh: input.dimensionsLwh ?? null,
                    mainImageUrl: input.mainImageUrl ?? null,
                    stockAlertThreshold: input.stockAlertThreshold ?? existing?.stockAlertThreshold ?? 2,
                    allowBackorder: input.allowBackorder ?? false,
                    trackInventory: input.trackInventory ?? !product.isDigital,
                    isActive: input.isActive ?? true,
                    position,
                };
                if (existing) {
                    if (existing.trackInventory && values.trackInventory === false && existing.quantityReserved > 0) {
                        fail(HttpStatus.CONFLICT, `${existing.sku} a du stock réservé : impossible de désactiver le suivi`);
                    }
                    await manager.update(ProductVariant, { id: existing.id }, values);
                    kept.push(existing.id);
                } else {
                    kept.push((await manager.save(ProductVariant, manager.create(ProductVariant, { ...values, productId }))).id);
                }
            }

            // Les variantes retirées sont archivées : elles restent liées aux commandes et au journal de stock.
            const removed = product.variants.filter((v) => !kept.includes(v.id)).map((v) => v.id);
            if (removed.length) await manager.update(ProductVariant, { id: In(removed) }, { isActive: false });

            if (product.status === ProductStatus.PUBLISHED && !dto.variants.some((v) => v.isActive ?? true)) {
                fail(HttpStatus.BAD_REQUEST, 'Un produit publié doit garder au moins une variante active');
            }
            await this.inventoryService.refreshVariants(manager, kept);
        });
        return this.adminProduct(productId);
    }

    async setImages(productId: string, dto: SetImagesDto) {
        await this.dataSource.transaction(async (manager) => {
            const product = await manager.findOne(Product, { where: { id: productId }, relations: { variants: true } });
            if (!product) fail(HttpStatus.NOT_FOUND, 'Produit introuvable');
            const variantIds = new Set(product.variants.map((v) => v.id));
            for (const image of dto.images) {
                if (image.variantId && !variantIds.has(image.variantId)) fail(HttpStatus.BAD_REQUEST, 'Image liée à une variante inconnue');
            }
            await manager.delete(ProductImage, { productId });
            if (dto.images.length) {
                await manager.insert(ProductImage, dto.images.map((image, displayOrder) => ({
                    productId, imageUrl: image.imageUrl, altText: image.altText ?? product.name, variantId: image.variantId ?? null, displayOrder,
                })));
            }
        });
        return this.adminProduct(productId);
    }

    // ===================== Utilitaires =====================

    toSummary(product: Product) {
        const variants = [...product.variants].sort((a, b) => a.price - b.price);
        const cheapest = variants[0];
        const images = [...(product.images ?? [])].sort((a, b) => a.displayOrder - b.displayOrder);
        const discounted = variants.find((v) => v.compareAtPrice !== null && v.compareAtPrice > v.price);
        const quantities = variants.map(sellableQuantity);
        return {
            id: product.id,
            slug: product.slug,
            name: product.name,
            brand: product.brand ? { name: product.brand.name, slug: product.brand.slug } : null,
            category: { name: product.category.name, slug: product.category.slug },
            condition: product.condition,
            descriptionShort: product.descriptionShort,
            isFeatured: product.isFeatured,
            isDigital: product.isDigital,
            rating: product.rating,
            soldCount: product.soldCount,
            publishedAt: product.publishedAt,
            image: images[0]?.imageUrl ?? cheapest.mainImageUrl ?? null,
            priceFrom: cheapest.price,
            compareAtPrice: discounted ? (discounted.compareAtPrice as number) : null,
            hasVariants: variants.length > 1,
            defaultVariantId: (variants.find(isPurchasable) ?? cheapest).id,
            available: quantities.includes(null) ? null : (quantities as number[]).reduce((n, q) => n + q, 0),
            stockStatus: bestStatus(variants),
            purchasable: variants.some(isPurchasable),
        };
    }

    private async breadcrumb(categoryId: string) {
        const all = await this.categoryRepository.find({ select: { id: true, name: true, slug: true, parentId: true } });
        const byId = new Map(all.map((c) => [c.id, c]));
        const trail: { name: string; slug: string }[] = [];
        for (let c = byId.get(categoryId); c; c = c.parentId ? byId.get(c.parentId) : undefined) trail.unshift({ name: c.name, slug: c.slug });
        return trail;
    }

    private async uniqueSlug(base: string): Promise<string> {
        let slug = base || 'produit';
        for (let n = 2; await this.productRepository.exists({ where: { slug } }); n++) slug = `${base}-${n}`;
        return slug;
    }

    private async assertTaxonomy(categoryId: string, brandId?: string | null) {
        if (!(await this.categoryRepository.exists({ where: { id: categoryId } }))) fail(HttpStatus.BAD_REQUEST, 'Catégorie introuvable');
        if (brandId && !(await this.brandRepository.exists({ where: { id: brandId } }))) fail(HttpStatus.BAD_REQUEST, 'Marque introuvable');
    }

    private assertOptions(options: ProductOption[]) {
        const names = options.map((o) => o.name.trim().toLowerCase());
        if (new Set(names).size !== names.length) fail(HttpStatus.BAD_REQUEST, 'Deux attributs portent le même nom');
        for (const option of options) {
            if (option.values.length === 0) fail(HttpStatus.BAD_REQUEST, `L'attribut ${option.name} n'a aucune valeur`);
            if (new Set(option.values).size !== option.values.length) fail(HttpStatus.BAD_REQUEST, `Valeurs en double pour ${option.name}`);
        }
    }

    // Chaque variante doit renseigner exactement les attributs du produit, avec des valeurs connues, sans doublon.
    private assertVariantMatrix(options: ProductOption[], dto: SetVariantsDto) {
        const skus = dto.variants.map((v) => v.sku);
        if (new Set(skus).size !== skus.length) fail(HttpStatus.BAD_REQUEST, 'Chaque variante doit avoir un SKU unique');

        const combos = new Set<string>();
        for (const variant of dto.variants) {
            const keys = Object.keys(variant.attributes);
            if (keys.length !== options.length || options.some((o) => !keys.includes(o.name))) {
                fail(HttpStatus.BAD_REQUEST, `${variant.sku} : renseignez exactement les attributs ${options.map((o) => o.name).join(', ') || '(aucun)'}`);
            }
            for (const option of options) {
                if (!option.values.includes(variant.attributes[option.name])) {
                    fail(HttpStatus.BAD_REQUEST, `${variant.sku} : valeur « ${variant.attributes[option.name]} » inconnue pour ${option.name}`);
                }
            }
            const combo = options.map((o) => variant.attributes[o.name]).join('|');
            if (combos.has(combo)) fail(HttpStatus.BAD_REQUEST, `Deux variantes ont la même combinaison : ${combo || 'Standard'}`);
            combos.add(combo);
        }
    }
}

type Summary = ReturnType<CatalogService['toSummary']>;

export function isPurchasable(variant: ProductVariant): boolean {
    const quantity = sellableQuantity(variant);
    return quantity === null || quantity > 0 || variant.allowBackorder;
}

const STATUS_RANK = { [StockStatus.IN_STOCK]: 2, [StockStatus.LOW_STOCK]: 1, [StockStatus.OUT_OF_STOCK]: 0 };

// Statut affiché en vitrine : le meilleur des variantes (le produit est « en stock » si au moins une l'est).
function bestStatus(variants: ProductVariant[]): StockStatus {
    return variants.reduce<StockStatus>((best, v) => (STATUS_RANK[v.stockStatus] > STATUS_RANK[best] ? v.stockStatus : best), StockStatus.OUT_OF_STOCK);
}

// Statut affiché au back-office : le pire des variantes suivies, pour repérer les ruptures.
function worstStatus(variants: ProductVariant[]): StockStatus | null {
    if (variants.length === 0) return null;
    return variants.reduce<StockStatus>((worst, v) => (STATUS_RANK[v.stockStatus] < STATUS_RANK[worst] ? v.stockStatus : worst), StockStatus.IN_STOCK);
}

