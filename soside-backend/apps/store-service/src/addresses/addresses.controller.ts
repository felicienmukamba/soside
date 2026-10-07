import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AddressDto, STORE, UpdateAddressDto } from '@app/store-contracts';
import { AddressesService } from './addresses.service';

@Controller()
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) { }

  @MessagePattern(STORE.addresses)
  findAll(@Payload() data: { userId: string }) {
    return this.addressesService.findAll(data.userId);
  }

  @MessagePattern(STORE.createAddress)
  create(@Payload() data: { userId: string; data: AddressDto }) {
    return this.addressesService.create(data.userId, data.data);
  }

  @MessagePattern(STORE.updateAddress)
  update(@Payload() data: { userId: string; id: string; data: UpdateAddressDto }) {
    return this.addressesService.update(data.userId, data.id, data.data);
  }

  @MessagePattern(STORE.deleteAddress)
  remove(@Payload() data: { userId: string; id: string }) {
    return this.addressesService.remove(data.userId, data.id);
  }
}
