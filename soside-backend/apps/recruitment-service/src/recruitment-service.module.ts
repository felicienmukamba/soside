import { Module } from '@nestjs/common';
import { RecruitmentServiceController } from './recruitment-service.controller';
import { RecruitmentServiceService } from './recruitment-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPost } from './job-post.entity';
import { Application } from './application.entity';
import { DeveloperSkill } from './developer-skill.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'soside_user',
      password: process.env.DB_PASSWORD || 'soside_password',
      database: process.env.DB_NAME || 'soside_db',
      entities: [JobPost, Application, DeveloperSkill],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([JobPost, Application, DeveloperSkill]),
  ],
  controllers: [RecruitmentServiceController],
  providers: [RecruitmentServiceService],
})
export class RecruitmentServiceModule { }
