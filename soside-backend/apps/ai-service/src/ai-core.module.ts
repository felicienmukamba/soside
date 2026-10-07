import { Module } from '@nestjs/common';
import { AiServiceController } from './ai-service.controller';
import { AiServiceService } from './ai-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIPromptLog } from './ai-prompt-log.entity';
import { AutomationWorkflow } from './automation-workflow.entity';
import { AgentSkill } from './agent-skill.entity';

export const AI_ENTITIES = [AIPromptLog, AutomationWorkflow, AgentSkill];

// Contrôleurs et services sans connexion : réutilisés par la gateway en mode monolithe (Vercel).
@Module({
  imports: [TypeOrmModule.forFeature(AI_ENTITIES)],
  controllers: [AiServiceController],
  providers: [AiServiceService],
})
export class AiCoreModule { }
