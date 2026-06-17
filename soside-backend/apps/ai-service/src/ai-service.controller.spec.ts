import { Test, TestingModule } from '@nestjs/testing';
import { AiServiceController } from './ai-service.controller';
import { AiServiceService } from './ai-service.service';

describe('AiServiceController', () => {
  let controller: AiServiceController;

  beforeEach(async () => {
    const mockService = {
      executeAgentTask: jest.fn(),
      logPrompt: jest.fn(),
      getPromptHistory: jest.fn(),
      createWorkflow: jest.fn(),
      findAllWorkflows: jest.fn(),
      triggerWorkflow: jest.fn(),
      toggleWorkflowStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiServiceController],
      providers: [
        {
          provide: AiServiceService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AiServiceController>(AiServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
