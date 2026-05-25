import { Test, TestingModule } from '@nestjs/testing';
import { BlackListesService } from './black-listes.service';

describe('BlackListesService', () => {
  let service: BlackListesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlackListesService],
    }).compile();

    service = module.get<BlackListesService>(BlackListesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
