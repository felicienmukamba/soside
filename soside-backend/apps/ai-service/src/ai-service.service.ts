import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AIPromptLog } from './ai-prompt-log.entity';
import { AutomationWorkflow } from './automation-workflow.entity';
import { AgentSkill } from './agent-skill.entity';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class AiServiceService {
  private readonly logger = new Logger(AiServiceService.name);
  private ai: GoogleGenAI;

  constructor(
    @InjectRepository(AIPromptLog)
    private readonly promptLogRepository: Repository<AIPromptLog>,
    @InjectRepository(AutomationWorkflow)
    private readonly workflowRepository: Repository<AutomationWorkflow>,
    @InjectRepository(AgentSkill)
    private readonly skillRepository: Repository<AgentSkill>,
  ) { 
    try {
        this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key' });
    } catch(e) {
        this.logger.error('Failed to initialize Google GenAI', e);
    }
  }

  async executeAgentTask(userId: string, prompt: string): Promise<string> {
    const skills = await this.skillRepository.find({ where: { isActive: true } });
    
    const tools = skills.map(skill => ({
       functionDeclarations: [
         {
           name: skill.name.replace(/[^a-zA-Z0-9_]/g, '_'),
           description: skill.description,
         }
       ]
    }));

    tools.push({
      functionDeclarations: [
        {
          name: 'trigger_automation',
          description: 'Triggers a specific automation workflow by ID',
          parameters: {
            type: 'OBJECT',
            properties: {
              workflowId: { type: 'STRING', description: 'The ID of the workflow to trigger' }
            },
            required: ['workflowId']
          }
        }
      ]
    } as any);

    try {
        if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'dummy_key') {
            const response = await this.ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { tools }
            });

            // Handle potential tool calls
            if (response.functionCalls && response.functionCalls.length > 0) {
               const call = response.functionCalls[0];
               if (call.name === 'trigger_automation') {
                  const args = call.args as any;
                  if (args.workflowId) {
                     await this.triggerWorkflow(args.workflowId);
                     return `Agent Tool Call: Triggered automation workflow ${args.workflowId}`;
                  }
               }
               return `Agent tried to call skill: ${call.name}`;
            }

            const textResponse = response.text || "Action executed.";
            await this.logPrompt(userId, prompt, textResponse, 'gemini-2.5-flash', 0);
            return textResponse;
        } else {
            this.logger.warn('No GEMINI_API_KEY found, simulating agent response.');
            
            if (prompt.toLowerCase().includes('workflow')) {
                const workflows = await this.findAllWorkflows();
                if (workflows.length > 0) {
                    await this.triggerWorkflow(workflows[0].id);
                    return `Simulated Tool Call: Triggered workflow ${workflows[0].name}`;
                }
            }

            return `Simulation: I am an AI agent. I received your prompt: "${prompt}". Configure GEMINI_API_KEY to enable real intelligence.`;
        }
    } catch (error) {
        this.logger.error('Error executing agent task', error);
        return "Failed to execute agent task.";
    }
  }

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
