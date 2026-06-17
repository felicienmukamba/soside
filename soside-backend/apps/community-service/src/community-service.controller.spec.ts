import { Test, TestingModule } from '@nestjs/testing';
import { CommunityServiceController } from './community-service.controller';
import { CommunityServiceService } from './community-service.service';

describe('CommunityServiceController', () => {
  let controller: CommunityServiceController;

  beforeEach(async () => {
    const mockService = {
      createChapter: jest.fn(),
      findAllChapters: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommunityServiceController],
      providers: [
        {
          provide: CommunityServiceService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<CommunityServiceController>(CommunityServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
