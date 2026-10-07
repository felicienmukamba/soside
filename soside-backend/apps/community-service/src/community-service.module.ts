import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseOptions } from '@app/platform';
import { CommunityCoreModule, COMMUNITY_ENTITIES } from './community-core.module';
import { CommunityGateway } from './community.gateway';

// Microservice autonome (Redis), avec sa propre connexion.
@Module({
  imports: [TypeOrmModule.forRoot(databaseOptions(COMMUNITY_ENTITIES)), CommunityCoreModule],
  // WebSocket : uniquement en mode microservice (non supporté par les fonctions serverless).
  providers: [CommunityGateway],
})
export class CommunityServiceModule { }
