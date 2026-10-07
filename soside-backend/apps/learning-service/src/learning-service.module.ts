import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseOptions } from '@app/platform';
import { LearningCoreModule, LEARNING_ENTITIES } from './learning-core.module';

// Microservice autonome (Redis), avec sa propre connexion.
@Module({
  imports: [TypeOrmModule.forRoot(databaseOptions(LEARNING_ENTITIES)), LearningCoreModule],
})
export class LearningServiceModule { }
