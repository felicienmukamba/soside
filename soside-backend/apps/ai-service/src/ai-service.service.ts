import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AIPromptLog } from './ai-prompt-log.entity';
import { AutomationWorkflow } from './automation-workflow.entity';

@Injectable()
export class AiServiceService {
  constructor(
    @InjectRepository(AIPromptLog)
    private readonly promptLogRepository: Repository<AIPromptLog>,
    @InjectRepository(AutomationWorkflow)
    private readonly workflowRepository: Repository<AutomationWorkflow>,
  ) { }

  // AI Prompt Logging
  async logPrompt(userId: string, prompt: string, response: string, modelUsed: string, tokensUsed: number): Promise<AIPromptLog> {
    const log = this.promptLogRepository.create({ userId, prompt, response, modelUsed, tokensUsed });
    return this.promptLogRepository.save(log);
  }

  async getPromptHistory(userId: string, limit: number = 20): Promise<AIPromptLog[]> {
    return this.promptLogRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  // Automation Workflows
  async createWorkflow(name: string, webhookUrl: string): Promise<AutomationWorkflow> {
    const workflow = this.workflowRepository.create({ name, webhookUrl });
    return this.workflowRepository.save(workflow);
  }

  async findAllWorkflows(): Promise<AutomationWorkflow[]> {
    return this.workflowRepository.find();
  }

  async triggerWorkflow(id: string): Promise<void> {
    await this.workflowRepository.update(id, { lastTriggered: new Date() });
  }

  async toggleWorkflowStatus(id: string, isActive: boolean): Promise<void> {
    await this.workflowRepository.update(id, { isActive });
  }
}
