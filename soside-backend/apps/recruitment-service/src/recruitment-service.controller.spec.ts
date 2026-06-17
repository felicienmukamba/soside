import { Test, TestingModule } from '@nestjs/testing';
import { RecruitmentServiceController } from './recruitment-service.controller';
import { RecruitmentServiceService } from './recruitment-service.service';

describe('RecruitmentServiceController', () => {
  let controller: RecruitmentServiceController;

  beforeEach(async () => {
    const mockService = {
      createJobPost: jest.fn(),
      findAllJobPosts: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecruitmentServiceController],
      providers: [
        {
          provide: RecruitmentServiceService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<RecruitmentServiceController>(RecruitmentServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
