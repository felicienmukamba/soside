import { Controller, Post, Body, Inject, Get, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('ai')
@Controller('ai')
export class AIController {
    constructor(@Inject('AI_SERVICE') private readonly aiClient: ClientProxy) { }

    @Post('prompt')
    @ApiOperation({ summary: 'Send a prompt to the AI service' })
    sendPrompt(@Body() data: { prompt: string; context?: any }) {
        return this.aiClient.send('generate_response', data);
    }

    @Get('logs')
    @ApiOperation({ summary: 'Get all AI prompt logs' })
    getLogs() {
        return this.aiClient.send('get_prompt_logs', {});
    }

    @Post('workflow/automate')
    @ApiOperation({ summary: 'Trigger an automated workflow' })
    triggerWorkflow(@Body() data: { workflowId: string; input: any }) {
        return this.aiClient.send('trigger_automation', data);
    }
}
