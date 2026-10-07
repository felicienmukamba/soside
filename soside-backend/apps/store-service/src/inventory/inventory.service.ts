import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Not, Repository } from 'typeorm';
import {
    CreateWarehouseDto, InventoryQueryDto, InventorySettingsDto, MovementQueryDto, MovementReferenceType, MovementType,
    StockOperationDto, StockStatus, StockTransferDto, UpdateWarehouseDto,
} from '@app/store-contracts';
import { Address, Inventory, ProductVariant, stockStatusOf, StockAllocation, StockMovement, Warehouse } from '../entities';
import { fail } from '../common/helpers';

export interface MovementContext {
    reason?: string | null;
    referenceType?: MovementReferenceType;
    referenceId?: string | null;
    createdBy?: string | null;
}

export interface StockLine {
    variantId: string;
    quantity: number;
    label: string; // nom affiché dans les messages d'erreur
    allowBackorder: boolean;
}

export interface Reservation {
    allocations: StockAllocation[];
    backordered: number; // reliquat non couvert par le stock (précommande)
}

@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(Warehouse)
        private readonly warehouseRepository: Repository<Warehouse>,
        @InjectRepository(StockMovement)
        private readonly movementRepository: Repository<StockMovement>,
        @InjectRepository(ProductVariant)
        private readonly variantRepository: Repository<ProductVariant>,
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) { }

    // ===================== Entrepôts =====================

    findWarehouses(): Promise<Warehouse[]> {
        return this.warehouseRepository.find({ order: { isDefault: 'DESC', code: 'ASC' } });
    }

    async createWarehouse(dto: CreateWarehouseDto): Promise<Warehouse> {
        if (await this.warehouseRepository.exists({ where: { code: dto.code } })) {
            fail(HttpStatus.CONFLICT, `Le code entrepôt ${dto.code} existe déjà`);
        }
        const id = await this.dataSource.transaction(async (manager) => {
            const address = await manager.save(Address, manager.create(Address, { ...dto.address, userId: null }));
            const isDefault = dto.isDefault ?? !(await manager.exists(Warehouse, {}));
            if (isDefault) await manager.update(Warehouse, { isDefault: true }, { isDefault: false });
            const warehouse = await manager.save(Warehouse, manager.create(Warehouse, {
                code: dto.code, name: dto.name, addressId: address.id, isDefault, isActive: dto.isActive ?? true,
            }));
            return warehouse.id;
        });
        return this.warehouseRepository.findOneOrFail({ where: { id } });
    }

    async updateWarehouse(id: string, dto: UpdateWarehouseDto): Promise<Warehouse> {
        const warehouse = await this.warehouseRepository.findOne({ where: { id } });
        if (!warehouse) fail(HttpStatus.NOT_FOUND, 'Entrepôt introuvable');
        if (dto.code && dto.code !== warehouse.code && (await this.warehouseRepository.exists({ where: { code: dto.code } }))) {
            fail(HttpStatus.CONFLICT, `Le code entrepôt ${dto.code} existe déjà`);
        }
        if (dto.isDefault === false && warehouse.isDefault) fail(HttpStatus.BAD_REQUEST, 'Choisissez un autre entrepôt par défaut à la place');
        if (dto.isActive === false && warehouse.isDefault) fail(HttpStatus.BAD_REQUEST, "L'entrepôt par défaut ne peut pas être désactivé");

        await this.dataSource.transaction(async (manager) => {
            if (dto.address) await manager.update(Address, { id: warehouse.addressId }, dto.address);
            if (dto.isDefault) await manager.update(Warehouse, { id: Not(id) }, { isDefault: false });
            const { address: _address, ...fields } = dto;
            if (Object.keys(fields).length) await manager.update(Warehouse, { id }, fields);

            // Activer / désactiver un entrepôt change les totaux de toutes les variantes qui y ont du stock.
            if (dto.isActive !== undefined && dto.isActive !== warehouse.isActive) {
                const rows = await manager.find(Inventory, { where: { warehouseId: id }, select: { variantId: true } });
                await this.refreshVariants(manager, rows.map((r) => r.variantId));
            }
        });
        return this.warehouseRepository.findOneOrFail({ where: { id } });
    }

    // ===================== Console logistique =====================

    async findInventory(query: InventoryQueryDto = {}) {
        const qb = this.variantRepository
            .createQueryBuilder('v')
            .innerJoinAndSelect('v.product', 'p')
            .leftJoinAndSelect('v.inventories', 'i')
            .leftJoinAndSelect('i.warehouse', 'w')
            .where("p.status <> 'archived'")
            .andWhere('v.isActive = true')
            .andWhere('v.trackInventory = true')
            .orderBy('p.name', 'ASC')
            .addOrderBy('v.position', 'ASC');
        if (query.q) qb.andWhere('(p.name ILIKE :q OR v.sku ILIKE :q OR v.name ILIKE :q)', { q: `%${query.q}%` });

        const rows = (await qb.getMany()).map((variant) => ({
            variantId: variant.id,
            sku: variant.sku,
            variantName: variant.name,
            productId: variant.productId,
            productName: variant.product.name,
            quantityOnHand: variant.quantityOnHand,
            quantityReserved: variant.quantityReserved,
            quantityAvailable: variant.quantityAvailable,
            stockStatus: variant.stockStatus,
            stockAlertThreshold: variant.stockAlertThreshold,
            allowBackorder: variant.allowBackorder,
            levels: (variant.inventories ?? [])
                .filter((i) => !query.warehouseId || i.warehouseId === query.warehouseId)
                .map((i) => ({
                    inventoryId: i.id,
                    warehouseId: i.warehouseId,
                    warehouseCode: i.warehouse.code,
                    warehouseName: i.warehouse.name,
                    warehouseActive: i.warehouse.isActive,
                    binLocation: i.binLocation,
                    reorderLevel: i.reorderLevel,
                    quantityOnHand: i.quantityOnHand,
                    quantityReserved: i.quantityReserved,
                    quantityAvailable: i.quantityAvailable,
                    needsReorder: i.quantityAvailable <= i.reorderLevel,
                    lastStockUpdate: i.lastStockUpdate,
                }))
                .sort((a, b) => a.warehouseCode.localeCompare(b.warehouseCode)),
        }));

        if (!query.lowStock) return rows;
        return rows.filter((r) => r.stockStatus !== StockStatus.IN_STOCK || r.levels.some((l) => l.needsReorder));
    }

    findMovements(query: MovementQueryDto = {}): Promise<StockMovement[]> {
        return this.movementRepository.find({
            where: {
                ...(query.type && { type: query.type }),
                ...((query.variantId || query.warehouseId) && {
                    inventory: {
                        ...(query.variantId && { variantId: query.variantId }),
                        ...(query.warehouseId && { warehouseId: query.warehouseId }),
                    },
                }),
            },
            relations: { inventory: { variant: { product: true }, warehouse: true } },
            order: { createdAt: 'DESC' },
            take: query.limit ?? 100,
        });
    }

    // ===================== Opérations manuelles =====================

    async applyOperation(dto: StockOperationDto, createdBy?: string) {
        if ((dto.type === MovementType.DAMAGE || dto.type === MovementType.ADJUSTMENT) && !dto.reason) {
            fail(HttpStatus.BAD_REQUEST, dto.type === MovementType.DAMAGE ? 'Indiquez la cause de la perte' : "Indiquez le motif de l'ajustement");
        }

        return this.dataSource.transaction(async (manager) => {
            await this.assertTrackedVariant(manager, dto.variantId);
            await this.assertWarehouse(manager, dto.warehouseId);
            const [inventory] = await this.lockRows(manager, [{ variantId: dto.variantId, warehouseId: dto.warehouseId }], true);
            const ctx: MovementContext = {
                reason: dto.reason,
                referenceId: dto.referenceId ?? null,
                referenceType: dto.referenceId
                    ? dto.type === MovementType.RETURN ? MovementReferenceType.ORDER : MovementReferenceType.PURCHASE
                    : MovementReferenceType.MANUAL,
                createdBy,
            };

            switch (dto.type) {
                case MovementType.RESTOCK:
                case MovementType.RETURN:
                    await this.move(manager, inventory, dto.type, dto.quantity, { onHand: dto.quantity }, ctx);
                    break;
                case MovementType.DAMAGE:
                    if (inventory.quantityOnHand - dto.quantity < inventory.quantityReserved) {
                        fail(HttpStatus.CONFLICT, `Perte impossible : seulement ${inventory.quantityAvailable} disponible(s), le reste est réservé`);
                    }
                    await this.move(manager, inventory, dto.type, dto.quantity, { onHand: -dto.quantity }, ctx);
                    break;
                case MovementType.ADJUSTMENT: {
                    if (dto.quantity < inventory.quantityReserved) {
                        fail(HttpStatus.CONFLICT, `Le stock compté (${dto.quantity}) est inférieur au stock réservé (${inventory.quantityReserved})`);
                    }
                    const delta = dto.quantity - inventory.quantityOnHand;
                    await this.move(manager, inventory, dto.type, Math.abs(delta), { onHand: delta }, ctx);
                    break;
                }
            }
            await this.refreshVariants(manager, [dto.variantId]);
            return inventory;
        });
    }

    async transfer(dto: StockTransferDto, createdBy?: string) {
        if (dto.fromWarehouseId === dto.toWarehouseId) fail(HttpStatus.BAD_REQUEST, 'Choisissez deux entrepôts différents');

        return this.dataSource.transaction(async (manager) => {
            await this.assertTrackedVariant(manager, dto.variantId);
            await this.assertWarehouse(manager, dto.fromWarehouseId);
            await this.assertWarehouse(manager, dto.toWarehouseId);
            const rows = await this.lockRows(
                manager,
                [dto.fromWarehouseId, dto.toWarehouseId].map((warehouseId) => ({ variantId: dto.variantId, warehouseId })),
                true,
            );
            const from = rows.find((r) => r.warehouseId === dto.fromWarehouseId)!;
            const to = rows.find((r) => r.warehouseId === dto.toWarehouseId)!;
            if (from.quantityAvailable < dto.quantity) {
                fail(HttpStatus.CONFLICT, `Seulement ${from.quantityAvailable} disponible(s) dans l'entrepôt de départ`);
            }
            const ctx: MovementContext = { reason: dto.reason ?? 'Transfert', referenceType: MovementReferenceType.TRANSFER, referenceId: `${from.id}>${to.id}`, createdBy };
            await this.move(manager, from, MovementType.TRANSFER_OUT, dto.quantity, { onHand: -dto.quantity }, ctx);
            await this.move(manager, to, MovementType.TRANSFER_IN, dto.quantity, { onHand: dto.quantity }, ctx);
            await this.refreshVariants(manager, [dto.variantId]);
            return [from, to];
        });
    }

    // Emplacement en rayon et seuil de réapprovisionnement d'une variante dans un entrepôt.
    async updateSettings(dto: InventorySettingsDto) {
        return this.dataSource.transaction(async (manager) => {
            await this.assertTrackedVariant(manager, dto.variantId);
            await this.assertWarehouse(manager, dto.warehouseId);
            const [inventory] = await this.lockRows(manager, [{ variantId: dto.variantId, warehouseId: dto.warehouseId }], true);
            const changes = {
                ...(dto.binLocation !== undefined && { binLocation: dto.binLocation?.trim() || null }),
                ...(dto.reorderLevel !== undefined && { reorderLevel: dto.reorderLevel }),
            };
            if (Object.keys(changes).length) await manager.update(Inventory, { id: inventory.id }, changes);
            return { ...inventory, ...changes };
        });
    }

    // ===================== Utilisé par les commandes (dans leur transaction) =====================

    // Stock disponible par variante (entrepôts actifs), lignes verrouillées jusqu'à la fin de la transaction.
    async lockAvailability(manager: EntityManager, variantIds: string[]): Promise<Map<string, number>> {
        const rows = await this.lockVariantRows(manager, variantIds);
        const available = new Map<string, number>(variantIds.map((id) => [id, 0]));
        for (const row of rows) available.set(row.variantId, available.get(row.variantId)! + row.quantityAvailable);
        return available;
    }

    // Réserve le stock en servant d'abord l'entrepôt par défaut. Avec allow_backorder, le reliquat est mis en précommande.
    async reserve(manager: EntityManager, lines: StockLine[], ctx: MovementContext): Promise<Map<string, Reservation>> {
        const rows = await this.lockVariantRows(manager, lines.map((l) => l.variantId));
        const result = new Map<string, Reservation>();

        for (const line of lines) {
            const candidates = rows.filter((r) => r.variantId === line.variantId && r.quantityAvailable > 0);
            const total = candidates.reduce((n, r) => n + r.quantityAvailable, 0);
            if (total < line.quantity && !line.allowBackorder) {
                fail(HttpStatus.CONFLICT, `Stock insuffisant pour ${line.label} : ${total} disponible(s), ${line.quantity} demandé(s)`);
            }

            let remaining = line.quantity;
            const allocations: StockAllocation[] = [];
            for (const row of candidates) {
                if (remaining === 0) break;
                const take = Math.min(row.quantityAvailable, remaining);
                await this.move(manager, row, MovementType.RESERVATION, take, { reserved: take }, ctx);
                allocations.push(this.allocationOf(row, take));
                remaining -= take;
            }
            result.set(line.variantId, { allocations, backordered: remaining });
        }
        await this.refreshVariants(manager, lines.map((l) => l.variantId));
        return result;
    }

    // Annulation : le stock réservé redevient disponible.
    release(manager: EntityManager, lines: { productVariantId: string; allocations: StockAllocation[] }[], ctx: MovementContext) {
        return this.settle(manager, lines, MovementType.RELEASE, ctx);
    }

    // Expédition : le stock réservé quitte physiquement l'entrepôt.
    commitSale(manager: EntityManager, lines: { productVariantId: string; allocations: StockAllocation[] }[], ctx: MovementContext) {
        return this.settle(manager, lines, MovementType.SALE, ctx);
    }

    // Recalcule les totaux et le statut de stock des variantes à partir des entrepôts actifs.
    async refreshVariants(manager: EntityManager, variantIds: string[]) {
        const ids = [...new Set(variantIds)];
        if (ids.length === 0) return;
        const variants = await manager.find(ProductVariant, { where: { id: In(ids) } });
        const sums: { variantId: string; onHand: string; reserved: string }[] = await manager
            .getRepository(Inventory)
            .createQueryBuilder('i')
            .innerJoin('i.warehouse', 'w', 'w.isActive = true')
            .select('i.variantId', 'variantId')
            .addSelect('SUM(i.quantityOnHand)', 'onHand')
            .addSelect('SUM(i.quantityReserved)', 'reserved')
            .where({ variantId: In(ids) })
            .groupBy('i.variantId')
            .getRawMany();
        const byId = new Map(sums.map((s) => [s.variantId, { onHand: Number(s.onHand), reserved: Number(s.reserved) }]));

        for (const variant of variants) {
            const { onHand, reserved } = byId.get(variant.id) ?? { onHand: 0, reserved: 0 };
            await manager.update(ProductVariant, { id: variant.id }, {
                quantityOnHand: onHand,
                quantityReserved: reserved,
                stockStatus: stockStatusOf(onHand - reserved, variant.stockAlertThreshold, variant.trackInventory),
            });
        }
    }

    // ===================== Primitives =====================

    private async settle(
        manager: EntityManager,
        lines: { productVariantId: string; allocations: StockAllocation[] }[],
        type: MovementType.RELEASE | MovementType.SALE,
        ctx: MovementContext,
    ) {
        const keys = lines.flatMap((l) => l.allocations.map((a) => ({ variantId: l.productVariantId, warehouseId: a.warehouseId })));
        const rows = await this.lockRows(manager, keys, false);
        for (const line of lines) {
            for (const allocation of line.allocations) {
                const row = rows.find((r) => r.variantId === line.productVariantId && r.warehouseId === allocation.warehouseId);
                if (!row) fail(HttpStatus.CONFLICT, `Stock introuvable dans l'entrepôt ${allocation.warehouseCode}`);
                const change = type === MovementType.SALE
                    ? { onHand: -allocation.quantity, reserved: -allocation.quantity }
                    : { reserved: -allocation.quantity };
                await this.move(manager, row, type, allocation.quantity, change, ctx);
            }
        }
        await this.refreshVariants(manager, lines.map((l) => l.productVariantId));
    }

    private async move(
        manager: EntityManager,
        inventory: Inventory,
        type: MovementType,
        quantity: number,
        change: { onHand?: number; reserved?: number },
        ctx: MovementContext,
    ): Promise<Inventory> {
        const beforeQuantity = inventory.quantityOnHand;
        const reservedBefore = inventory.quantityReserved;
        const afterQuantity = beforeQuantity + (change.onHand ?? 0);
        const reservedAfter = reservedBefore + (change.reserved ?? 0);

        if (afterQuantity < 0 || reservedAfter < 0 || reservedAfter > afterQuantity) {
            fail(HttpStatus.CONFLICT, 'Mouvement refusé : le stock deviendrait incohérent');
        }

        await manager.update(Inventory, { id: inventory.id }, { quantityOnHand: afterQuantity, quantityReserved: reservedAfter });
        await manager.insert(StockMovement, {
            inventoryId: inventory.id,
            type,
            quantityChange: afterQuantity - beforeQuantity,
            quantity,
            beforeQuantity,
            afterQuantity,
            reservedBefore,
            reservedAfter,
            referenceType: ctx.referenceType ?? MovementReferenceType.MANUAL,
            referenceId: ctx.referenceId ?? null,
            reason: ctx.reason ?? null,
            createdBy: ctx.createdBy ?? null,
        });

        inventory.quantityOnHand = afterQuantity;
        inventory.quantityReserved = reservedAfter;
        inventory.computeAvailable();
        return inventory;
    }

    private allocationOf(row: Inventory, quantity: number): StockAllocation {
        return { warehouseId: row.warehouseId, warehouseCode: row.warehouse.code, warehouseName: row.warehouse.name, binLocation: row.binLocation, quantity };
    }

    // Lignes de stock des variantes dans les entrepôts actifs, entrepôt par défaut en premier.
    private lockVariantRows(manager: EntityManager, variantIds: string[]): Promise<Inventory[]> {
        if (variantIds.length === 0) return Promise.resolve([]);
        return manager
            .getRepository(Inventory)
            .createQueryBuilder('i')
            .innerJoinAndSelect('i.warehouse', 'w', 'w.isActive = true')
            .where({ variantId: In([...new Set(variantIds)]) })
            .orderBy('w.isDefault', 'DESC')
            .addOrderBy('w.code', 'ASC')
            .setLock('pessimistic_write', undefined, ['i'])
            .getMany();
    }

    // Verrouille (et crée au besoin) des lignes précises variante × entrepôt.
    private async lockRows(manager: EntityManager, keys: { variantId: string; warehouseId: string }[], create: boolean): Promise<Inventory[]> {
        if (keys.length === 0) return [];
        if (create) await manager.createQueryBuilder().insert().into(Inventory).values(keys).orIgnore().execute();
        const rows = await manager
            .getRepository(Inventory)
            .createQueryBuilder('i')
            .innerJoinAndSelect('i.warehouse', 'w')
            .where({ variantId: In([...new Set(keys.map((k) => k.variantId))]), warehouseId: In([...new Set(keys.map((k) => k.warehouseId))]) })
            .orderBy('i.id', 'ASC')
            .setLock('pessimistic_write', undefined, ['i'])
            .getMany();
        return rows.filter((r) => keys.some((k) => k.variantId === r.variantId && k.warehouseId === r.warehouseId));
    }

    private async assertTrackedVariant(manager: EntityManager, id: string) {
        const variant = await manager.findOne(ProductVariant, { where: { id } });
        if (!variant) fail(HttpStatus.NOT_FOUND, 'Variante introuvable');
        if (!variant.trackInventory) fail(HttpStatus.CONFLICT, `${variant.sku} n'est pas suivi en stock (track_inventory désactivé)`);
    }

    private async assertWarehouse(manager: EntityManager, id: string) {
        const warehouse = await manager.findOne(Warehouse, { where: { id } });
        if (!warehouse) fail(HttpStatus.NOT_FOUND, 'Entrepôt introuvable');
        if (!warehouse.isActive) fail(HttpStatus.CONFLICT, `L'entrepôt ${warehouse.code} est désactivé`);
    }
}
