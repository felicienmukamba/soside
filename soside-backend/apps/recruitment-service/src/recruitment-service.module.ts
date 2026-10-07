import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseOptions } from '@app/platform';
import { RecruitmentCoreModule, RECRUITMENT_ENTITIES } from './recruitment-core.module';

// Microservice autonome (Redis), avec sa propre connexion.
@Module({
  imports: [TypeOrmModule.forRoot(databaseOptions(RECRUITMENT_ENTITIES)), RecruitmentCoreModule],
})
export class RecruitmentServiceModule { }
