import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseOptions } from '@app/platform';
import { AuthCoreModule, AUTH_ENTITIES } from './auth-core.module';

// Microservice autonome (Redis), avec sa propre connexion.
@Module({
  imports: [TypeOrmModule.forRoot(databaseOptions(AUTH_ENTITIES)), AuthCoreModule],
})
export class AuthServiceModule { }
