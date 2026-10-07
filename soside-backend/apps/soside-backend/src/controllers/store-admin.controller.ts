import { Body, Controller, Delete, Get, HttpCode, Inject, Param, ParseEnumPipe, ParseUUIDPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
    AdminProductQueryDto, CancelOrderDto, CreateBrandDto, CreateCategoryDto, CreateProductDto, CreateWarehouseDto, InventoryQueryDto,
    InventorySettingsDto, InvoiceStatus, MovementQueryDto, OrderQueryDto, RecordPaymentDto, SetImagesDto, SetVariantsDto, ShipOrderDto,
    StockOperationDto, StockTransferDto, STORE, UpdateBrandDto, UpdateCategoryDto, UpdateProductDto, UpdateWarehouseDto,
} from '@app/store-contracts';
import { AdminGuard, CurrentUser } from '../auth/jwt';
import type { AuthUser } from '../auth/jwt';
import { rpc } from '../common/rpc';

// Back-office SOSIDE STORE : réservé au rôle admin (jeton émis par auth-service).
@ApiTags('store-admin')
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller('store/admin')
export class StoreAdminController {
    constructor(@Inject('STORE_SERVICE') private readonly storeClient: ClientProxy) { }

    // ===================== Taxonomie =====================

    @Get('taxonomy')
    @ApiOperation({ summary: 'Full category tree (including inactive) and all brands' })
    taxonomy() {
        return rpc(this.storeClient, STORE.adminCategories);
    }

    @Post('categories')
    createCategory(@Body() dto: CreateCategoryDto) {
        return rpc(this.storeClient, STORE.createCategory, dto);
    }

    @Patch('categories/:id')
    updateCategory(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCategoryDto) {
        return rpc(this.storeClient, STORE.updateCategory, { id, data: dto });
    }

    @Delete('categories/:id')
    deleteCategory(@Param('id', ParseUUIDPipe) id: string) {
        return rpc(this.storeClient, STORE.deleteCategory, id);
    }

    @Post('brands')
    createBrand(@Body() dto: CreateBrandDto) {
        return rpc(this.storeClient, STORE.createBrand, dto);
    }

    @Patch('brands/:id')
    updateBrand(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateBrandDto) {
        return rpc(this.storeClient, STORE.updateBrand, { id, data: dto });
    }

    @Delete('brands/:id')
    deleteBrand(@Param('id', ParseUUIDPipe) id: string) {
        return rpc(this.storeClient, STORE.deleteBrand, id);
    }

    // ===================== Produits & variantes =====================

    @Get('products')
    products(@Query() query: AdminProductQueryDto) {
        return rpc(this.storeClient, STORE.adminProducts, query);
    }

    @Get('products/:id')
    product(@Param('id', ParseUUIDPipe) id: string) {
        return rpc(this.storeClient, STORE.adminProduct, id);
    }

    @Post('products')
    @ApiOperation({ summary: 'Create a parent product (draft)' })
    createProduct(@Body() dto: CreateProductDto) {
        return rpc(this.storeClient, STORE.createProduct, dto);
    }

    @Patch('products/:id')
    @ApiOperation({ summary: 'Update content, SEO, options or status (publish requires an active variant)' })
    updateProduct(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProductDto) {
        return rpc(this.storeClient, STORE.updateProduct, { id, data: dto });
    }

    @Put('products/:id/variants')
    @ApiOperation({ summary: 'Save the whole variant matrix (missing variants are archived)' })
    setVariants(@Param('id', ParseUUIDPipe) id: string, @Body() dto: SetVariantsDto) {
        return rpc(this.storeClient, STORE.setVariants, { id, data: dto });
    }

    @Put('products/:id/images')
    @ApiOperation({ summary: 'Replace the gallery (order = display order)' })
    setImages(@Param('id', ParseUUIDPipe) id: string, @Body() dto: SetImagesDto) {
        return rpc(this.storeClient, STORE.setImages, { id, data: dto });
    }

    // ===================== Logistique =====================

    @Get('warehouses')
    warehouses() {
        return rpc(this.storeClient, STORE.warehouses);
    }

    @Post('warehouses')
    createWarehouse(@Body() dto: CreateWarehouseDto) {
        return rpc(this.storeClient, STORE.createWarehouse, dto);
    }

    @Patch('warehouses/:id')
    updateWarehouse(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateWarehouseDto) {
        return rpc(this.storeClient, STORE.updateWarehouse, { id, data: dto });
    }

    @Get('inventory')
    @ApiOperation({ summary: 'Stock levels per variant and warehouse (on hand / reserved / available)' })
    inventory(@Query() query: InventoryQueryDto) {
        return rpc(this.storeClient, STORE.inventory, query);
    }

    @Post('inventory/operations')
    @ApiOperation({ summary: 'Restock, return, count adjustment or damage — logged in the movement journal' })
    stockOperation(@CurrentUser() user: AuthUser, @Body() dto: StockOperationDto) {
        return rpc(this.storeClient, STORE.stockOperation, { actorId: user.id, data: dto });
    }

    @Post('inventory/transfers')
    stockTransfer(@CurrentUser() user: AuthUser, @Body() dto: StockTransferDto) {
        return rpc(this.storeClient, STORE.stockTransfer, { actorId: user.id, data: dto });
    }

    @Patch('inventory/settings')
    @ApiOperation({ summary: 'Bin location and reorder level of a variant in a warehouse' })
    inventorySettings(@Body() dto: InventorySettingsDto) {
        return rpc(this.storeClient, STORE.inventorySettings, dto);
    }

    @Get('inventory/movements')
    movements(@Query() query: MovementQueryDto) {
        return rpc(this.storeClient, STORE.movements, query);
    }

    // ===================== Commandes & expédition =====================

    @Get('orders')
    orders(@Query() query: OrderQueryDto) {
        return rpc(this.storeClient, STORE.adminOrders, query);
    }

    @Get('orders/:reference')
    order(@Param('reference') reference: string) {
        return rpc(this.storeClient, STORE.adminOrder, reference);
    }

    @Post('orders/:reference/confirm')
    @HttpCode(200)
    @ApiOperation({ summary: 'Confirm: reserve stock and issue the invoice' })
    confirm(@CurrentUser() user: AuthUser, @Param('reference') reference: string) {
        return rpc(this.storeClient, STORE.confirmOrder, { actorId: user.id, reference });
    }

    @Post('orders/:reference/payments')
    @HttpCode(200)
    @ApiOperation({ summary: 'Record a payment (auto-confirms a pending order)' })
    recordPayment(@CurrentUser() user: AuthUser, @Param('reference') reference: string, @Body() dto: RecordPaymentDto) {
        return rpc(this.storeClient, STORE.recordPayment, { actorId: user.id, reference, data: dto });
    }

    @Post('orders/:reference/ship')
    @HttpCode(200)
    @ApiOperation({ summary: 'Ship with carrier and tracking number (reserved stock leaves the warehouse)' })
    ship(@CurrentUser() user: AuthUser, @Param('reference') reference: string, @Body() dto: ShipOrderDto) {
        return rpc(this.storeClient, STORE.shipOrder, { actorId: user.id, reference, data: dto });
    }

    @Post('orders/:reference/deliver')
    @HttpCode(200)
    deliver(@Param('reference') reference: string) {
        return rpc(this.storeClient, STORE.deliverOrder, { reference });
    }

    @Post('orders/:reference/cancel')
    @HttpCode(200)
    @ApiOperation({ summary: 'Cancel: release reserved stock and void the invoice' })
    cancel(@CurrentUser() user: AuthUser, @Param('reference') reference: string, @Body() dto: CancelOrderDto) {
        return rpc(this.storeClient, STORE.cancelOrder, { actorId: user.id, reference, data: dto });
    }

    // ===================== Factures =====================

    @Get('invoices')
    invoices(@Query('status', new ParseEnumPipe(InvoiceStatus, { optional: true })) status?: InvoiceStatus) {
        return rpc(this.storeClient, STORE.adminInvoices, { status });
    }

    @Get('invoices/:invoiceNumber')
    invoice(@Param('invoiceNumber') invoiceNumber: string) {
        return rpc(this.storeClient, STORE.invoice, { invoiceNumber });
    }
}
