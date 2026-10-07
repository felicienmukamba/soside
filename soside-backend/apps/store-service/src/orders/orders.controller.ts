import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  Actor, CancelOrderDto, CartOwner, CheckoutDto, InvoiceStatus, OrderLookupDto, OrderQueryDto, RecordPaymentDto, ShipOrderDto, STORE,
} from '@app/store-contracts';
import { OrdersService } from './orders.service';
import { InvoicesService } from './invoices.service';

@Controller()
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly invoicesService: InvoicesService,
  ) { }

  @MessagePattern(STORE.checkout)
  checkout(@Payload() data: { owner: CartOwner; data: CheckoutDto }) {
    return this.ordersService.checkout(data.owner, data.data);
  }

  @MessagePattern(STORE.myOrders)
  myOrders(@Payload() data: { userId: string }) {
    return this.ordersService.myOrders(data.userId);
  }

  @MessagePattern(STORE.myOrder)
  myOrder(@Payload() data: { userId: string; reference: string }) {
    return this.ordersService.myOrder(data.userId, data.reference);
  }

  @MessagePattern(STORE.lookupOrder)
  lookup(@Payload() dto: OrderLookupDto) {
    return this.ordersService.lookup(dto.reference, dto.phone);
  }

  // --- Back-office ---

  @MessagePattern(STORE.adminOrders)
  adminOrders(@Payload() query: OrderQueryDto) {
    return this.ordersService.adminOrders(query);
  }

  @MessagePattern(STORE.adminOrder)
  adminOrder(@Payload() reference: string) {
    return this.ordersService.adminOrder(reference);
  }

  @MessagePattern(STORE.confirmOrder)
  confirm(@Payload() data: Actor & { reference: string }) {
    return this.ordersService.confirm(data.reference, data.actorId);
  }

  @MessagePattern(STORE.recordPayment)
  recordPayment(@Payload() data: Actor & { reference: string; data: RecordPaymentDto }) {
    return this.ordersService.recordPayment(data.reference, data.data, data.actorId);
  }

  @MessagePattern(STORE.shipOrder)
  ship(@Payload() data: Actor & { reference: string; data: ShipOrderDto }) {
    return this.ordersService.ship(data.reference, data.data, data.actorId);
  }

  @MessagePattern(STORE.deliverOrder)
  deliver(@Payload() data: { reference: string }) {
    return this.ordersService.deliver(data.reference);
  }

  @MessagePattern(STORE.cancelOrder)
  cancel(@Payload() data: Actor & { reference: string; data: CancelOrderDto }) {
    return this.ordersService.cancel(data.reference, data.data, data.actorId);
  }

  // --- Factures ---

  @MessagePattern(STORE.adminInvoices)
  adminInvoices(@Payload() data: { status?: InvoiceStatus }) {
    return this.invoicesService.findAll(data?.status);
  }

  // customerId absent = accès back-office.
  @MessagePattern(STORE.invoice)
  invoice(@Payload() data: { invoiceNumber: string; customerId?: string }) {
    return this.invoicesService.findOne(data.invoiceNumber, data.customerId);
  }
}
