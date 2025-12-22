import { Module } from '@nestjs/common';
import { ProjectServiceController } from './project-service.controller';
import { ProjectServiceService } from './project-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ProjectCategory } from './project-category.entity';
import { ProjectTag } from './project-tag.entity';
import { Location } from './location.entity';
import { ProjectMedia } from './project-media.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'soside_user',
      password: process.env.DB_PASSWORD || 'soside_password',
      database: process.env.DB_NAME || 'soside_db',
      entities: [Project, ProjectCategory, ProjectTag, Location, ProjectMedia],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Project, ProjectCategory, ProjectTag, Location, ProjectMedia]),
  ],
  controllers: [ProjectServiceController],
  providers: [ProjectServiceService],
})
export class ProjectServiceModule { }
