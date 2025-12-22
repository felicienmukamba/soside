import { Module } from '@nestjs/common';
import { AiServiceController } from './ai-service.controller';
import { AiServiceService } from './ai-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIPromptLog } from './ai-prompt-log.entity';
import { AutomationWorkflow } from './automation-workflow.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'soside_user',
      password: process.env.DB_PASSWORD || 'soside_password',
      database: process.env.DB_NAME || 'soside_db',
      entities: [AIPromptLog, AutomationWorkflow],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([AIPromptLog, AutomationWorkflow]),
  ],
  controllers: [AiServiceController],
  providers: [AiServiceService],
})
export class AiServiceModule { }
