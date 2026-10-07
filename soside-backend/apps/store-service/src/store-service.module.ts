import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseOptions } from '@app/platform';
import { StoreCoreModule } from './store-core.module';
import { STORE_ENTITIES } from './entities';

// Microservice autonome (Redis), avec sa propre connexion.
@Module({
  imports: [TypeOrmModule.forRoot(databaseOptions(STORE_ENTITIES)), StoreCoreModule],
})
export class StoreServiceModule { }
