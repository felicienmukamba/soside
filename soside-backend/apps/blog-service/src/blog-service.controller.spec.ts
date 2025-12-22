import { Test, TestingModule } from '@nestjs/testing';
import { BlogServiceController } from './blog-service.controller';
import { BlogServiceService } from './blog-service.service';

describe('BlogServiceController', () => {
  let blogServiceController: BlogServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BlogServiceController],
      providers: [BlogServiceService],
    }).compile();

    blogServiceController = app.get<BlogServiceController>(BlogServiceController);
  });
});
