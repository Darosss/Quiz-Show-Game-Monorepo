import { Test, TestingModule } from '@nestjs/testing';
import { QuizAnswersService } from './games.service';

describe('QuizAnswersService', () => {
  let service: QuizAnswersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizAnswersService],
    }).compile();

    service = module.get<QuizAnswersService>(QuizAnswersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
