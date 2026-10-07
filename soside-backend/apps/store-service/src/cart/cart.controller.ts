import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AddCartItemDto, CartOwner, STORE } from '@app/store-contracts';
import { CartService } from './cart.service';

@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @MessagePattern(STORE.getCart)
  getCart(@Payload() data: { owner: CartOwner }) {
    return this.cartService.getCart(data.owner);
  }

  @MessagePattern(STORE.addCartItem)
  addItem(@Payload() data: { owner: CartOwner; data: AddCartItemDto }) {
    return this.cartService.addItem(data.owner, data.data);
  }

  @MessagePattern(STORE.updateCartItem)
  updateItem(@Payload() data: { owner: CartOwner; variantId: string; quantity: number }) {
    return this.cartService.updateItem(data.owner, data.variantId, data.quantity);
  }

  @MessagePattern(STORE.mergeCart)
  merge(@Payload() data: { userId: string; sessionId: string }) {
    return this.cartService.merge(data.userId, data.sessionId);
  }
}
