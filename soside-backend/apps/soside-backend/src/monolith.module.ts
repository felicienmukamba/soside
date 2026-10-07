import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseOptions, inProcessClient, MessageHandlerRegistry } from '@app/platform';
import { AI_ENTITIES, AiCoreModule } from '../../ai-service/src/ai-core.module';
import { AUTH_ENTITIES, AuthCoreModule } from '../../auth-service/src/auth-core.module';
import { BLOG_ENTITIES, BlogCoreModule } from '../../blog-service/src/blog-core.module';
import { COMMUNITY_ENTITIES, CommunityCoreModule } from '../../community-service/src/community-core.module';
import { LEARNING_ENTITIES, LearningCoreModule } from '../../learning-service/src/learning-core.module';
import { PROJECT_ENTITIES, ProjectCoreModule } from '../../project-service/src/project-core.module';
import { RECRUITMENT_ENTITIES, RecruitmentCoreModule } from '../../recruitment-service/src/recruitment-core.module';
import { STORE_ENTITIES } from '../../store-service/src/entities';
import { StoreCoreModule } from '../../store-service/src/store-core.module';
import { SERVICE_CLIENTS } from './service-clients';

const ENTITIES = [
  ...AUTH_ENTITIES, ...BLOG_ENTITIES, ...PROJECT_ENTITIES, ...LEARNING_ENTITIES,
  ...COMMUNITY_ENTITIES, ...RECRUITMENT_ENTITIES, ...AI_ENTITIES, ...STORE_ENTITIES,
];

// Mode monolithe (GATEWAY_MODE=monolith) : tous les microservices tournent dans le processus de la gateway,
// sur une seule connexion Postgres. Les contrôleurs HTTP gardent leurs ClientProxy, servis en mémoire au lieu de Redis.
// C'est le mode utilisé sur Vercel, où aucun processus ne peut écouter Redis en permanence.
@Module({
  imports: [
    DiscoveryModule,
    TypeOrmModule.forRoot(databaseOptions(ENTITIES)),
    AuthCoreModule,
    BlogCoreModule,
    ProjectCoreModule,
    LearningCoreModule,
    CommunityCoreModule,
    RecruitmentCoreModule,
    AiCoreModule,
    StoreCoreModule,
  ],
  providers: [MessageHandlerRegistry, ...SERVICE_CLIENTS.map(inProcessClient)],
  exports: [...SERVICE_CLIENTS],
})
export class MonolithModule { }
