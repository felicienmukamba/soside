import { Controller } from '@nestjs/common';
import { AiServiceService } from './ai-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AiServiceController {
  constructor(private readonly aiService: AiServiceService) { }

  @MessagePattern('log_prompt')
  logPrompt(@Payload() data: { userId: string; prompt: string; response: string; modelUsed: string; tokensUsed: number }) {
    return this.aiService.logPrompt(data.userId, data.prompt, data.response, data.modelUsed, data.tokensUsed);
  }

  @MessagePattern('get_prompt_history')
  getPromptHistory(@Payload() data: { userId: string; limit?: number }) {
    return this.aiService.getPromptHistory(data.userId, data.limit);
  }

  @MessagePattern('create_workflow')
  createWorkflow(@Payload() data: { name: string; webhookUrl: string }) {
    return this.aiService.createWorkflow(data.name, data.webhookUrl);
  }

  @MessagePattern('find_all_workflows')
  findAllWorkflows() {
    return this.aiService.findAllWorkflows();
  }

  @MessagePattern('trigger_workflow')
  triggerWorkflow(@Payload() id: string) {
    return this.aiService.triggerWorkflow(id);
  }

  @MessagePattern('toggle_workflow_status')
  toggleWorkflowStatus(@Payload() data: { id: string; isActive: boolean }) {
    return this.aiService.toggleWorkflowStatus(data.id, data.isActive);
  }
}
