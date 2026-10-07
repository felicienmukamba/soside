import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';
import { AddressDto, UpdateAddressDto } from '@app/store-contracts';
import { Address } from '../entities';
import { fail, loadSettings } from '../common/helpers';

@Injectable()
export class AddressesService {
    private readonly settings = loadSettings();

    constructor(
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>,
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) { }

    findAll(userId: string): Promise<Address[]> {
        return this.addressRepository.find({ where: { userId }, order: { isDefault: 'DESC', createdAt: 'ASC' } });
    }

    async findOne(userId: string, id: string): Promise<Address> {
        const address = await this.addressRepository.findOne({ where: { id, userId } });
        if (!address) fail(HttpStatus.NOT_FOUND, 'Adresse introuvable');
        return address;
    }

    async create(userId: string, dto: AddressDto): Promise<Address> {
        this.assertCity(dto.city);
        return this.dataSource.transaction(async (manager) => {
            const isFirst = !(await manager.exists(Address, { where: { userId } }));
            const isDefault = dto.isDefault ?? isFirst;
            if (isDefault) await manager.update(Address, { userId }, { isDefault: false });
            return manager.save(Address, manager.create(Address, { ...dto, userId, isDefault }));
        });
    }

    async update(userId: string, id: string, dto: UpdateAddressDto): Promise<Address> {
        if (dto.city) this.assertCity(dto.city);
        const address = await this.findOne(userId, id);
        return this.dataSource.transaction(async (manager) => {
            if (dto.isDefault) await manager.update(Address, { userId, id: Not(id) }, { isDefault: false });
            return manager.save(Address, manager.merge(Address, address, dto));
        });
    }

    async remove(userId: string, id: string): Promise<{ id: string; deleted: true }> {
        const address = await this.findOne(userId, id);
        await this.addressRepository.delete({ id: address.id });
        return { id, deleted: true };
    }

    assertCity(city: string) {
        if (!this.settings.cities.includes(city)) {
            fail(HttpStatus.BAD_REQUEST, `Nous livrons à ${this.settings.cities.join(', ')} uniquement`);
        }
    }
}
