import { Test, TestingModule } from '@nestjs/testing';
import { RecruitmentServiceController } from './recruitment-service.controller';
import { RecruitmentServiceService } from './recruitment-service.service';

describe('RecruitmentServiceController', () => {
  let recruitmentServiceController: RecruitmentServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RecruitmentServiceController],
      providers: [RecruitmentServiceService],
    }).compile();

    recruitmentServiceController = app.get<RecruitmentServiceController>(RecruitmentServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(recruitmentServiceController.getHello()).toBe('Hello World!');
    });
  });
});
