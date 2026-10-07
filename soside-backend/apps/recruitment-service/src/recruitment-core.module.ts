import { Module } from '@nestjs/common';
import { RecruitmentServiceController } from './recruitment-service.controller';
import { RecruitmentServiceService } from './recruitment-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPost } from './job-post.entity';
import { Application } from './application.entity';
import { DeveloperSkill } from './developer-skill.entity';

export const RECRUITMENT_ENTITIES = [JobPost, Application, DeveloperSkill];

// Contrôleurs et services sans connexion : réutilisés par la gateway en mode monolithe (Vercel).
@Module({
  imports: [TypeOrmModule.forFeature(RECRUITMENT_ENTITIES)],
  controllers: [RecruitmentServiceController],
  providers: [RecruitmentServiceService],
})
export class RecruitmentCoreModule { }
