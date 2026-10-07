import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { STORE_ENTITIES } from './entities';
import { CatalogController } from './catalog/catalog.controller';
import { CatalogService } from './catalog/catalog.service';
import { InventoryController } from './inventory/inventory.controller';
import { InventoryService } from './inventory/inventory.service';
import { CartController } from './cart/cart.controller';
import { CartService } from './cart/cart.service';
import { AddressesController } from './addresses/addresses.controller';
import { AddressesService } from './addresses/addresses.service';
import { OrdersController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';
import { InvoicesService } from './orders/invoices.service';
import { SeedService } from './seed/seed.service';

// Contrôleurs et services sans connexion : réutilisés par la gateway en mode monolithe (Vercel).
@Module({
  imports: [TypeOrmModule.forFeature(STORE_ENTITIES)],
  controllers: [CatalogController, InventoryController, CartController, AddressesController, OrdersController],
  providers: [CatalogService, InventoryService, CartService, AddressesService, OrdersService, InvoicesService, SeedService],
})
export class StoreCoreModule { }
