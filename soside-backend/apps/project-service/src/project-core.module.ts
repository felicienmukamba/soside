import { Module } from '@nestjs/common';
import { ProjectServiceController } from './project-service.controller';
import { ProjectServiceService } from './project-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ProjectCategory } from './project-category.entity';
import { ProjectTag } from './project-tag.entity';
import { Location } from './location.entity';
import { ProjectMedia } from './project-media.entity';

export const PROJECT_ENTITIES = [Project, ProjectCategory, ProjectTag, Location, ProjectMedia];

// Contrôleurs et services sans connexion : réutilisés par la gateway en mode monolithe (Vercel).
@Module({
  imports: [TypeOrmModule.forFeature(PROJECT_ENTITIES)],
  controllers: [ProjectServiceController],
  providers: [ProjectServiceService],
})
export class ProjectCoreModule { }
