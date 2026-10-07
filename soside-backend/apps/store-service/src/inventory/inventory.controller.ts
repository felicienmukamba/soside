import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  Actor, CreateWarehouseDto, InventoryQueryDto, InventorySettingsDto, MovementQueryDto, StockOperationDto, StockTransferDto, STORE, UpdateWarehouseDto,
} from '@app/store-contracts';
import { InventoryService } from './inventory.service';

@Controller()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) { }

  @MessagePattern(STORE.warehouses)
  warehouses() {
    return this.inventoryService.findWarehouses();
  }

  @MessagePattern(STORE.createWarehouse)
  createWarehouse(@Payload() dto: CreateWarehouseDto) {
    return this.inventoryService.createWarehouse(dto);
  }

  @MessagePattern(STORE.updateWarehouse)
  updateWarehouse(@Payload() data: { id: string; data: UpdateWarehouseDto }) {
    return this.inventoryService.updateWarehouse(data.id, data.data);
  }

  @MessagePattern(STORE.inventory)
  inventory(@Payload() query: InventoryQueryDto) {
    return this.inventoryService.findInventory(query);
  }

  @MessagePattern(STORE.stockOperation)
  stockOperation(@Payload() data: Actor & { data: StockOperationDto }) {
    return this.inventoryService.applyOperation(data.data, data.actorId);
  }

  @MessagePattern(STORE.stockTransfer)
  stockTransfer(@Payload() data: Actor & { data: StockTransferDto }) {
    return this.inventoryService.transfer(data.data, data.actorId);
  }

  @MessagePattern(STORE.inventorySettings)
  inventorySettings(@Payload() dto: InventorySettingsDto) {
    return this.inventoryService.updateSettings(dto);
  }

  @MessagePattern(STORE.movements)
  movements(@Payload() query: MovementQueryDto) {
    return this.inventoryService.findMovements(query);
  }
}
