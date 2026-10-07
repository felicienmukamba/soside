import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseOptions } from '@app/platform';
import { AiCoreModule, AI_ENTITIES } from './ai-core.module';

// Microservice autonome (Redis), avec sa propre connexion.
@Module({
  imports: [TypeOrmModule.forRoot(databaseOptions(AI_ENTITIES)), AiCoreModule],
})
export class AiServiceModule { }
