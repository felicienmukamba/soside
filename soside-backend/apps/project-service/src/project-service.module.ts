import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseOptions } from '@app/platform';
import { ProjectCoreModule, PROJECT_ENTITIES } from './project-core.module';

// Microservice autonome (Redis), avec sa propre connexion.
@Module({
  imports: [TypeOrmModule.forRoot(databaseOptions(PROJECT_ENTITIES)), ProjectCoreModule],
})
export class ProjectServiceModule { }
