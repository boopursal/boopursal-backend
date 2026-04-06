import { Test, TestingModule } from '@nestjs/testing';
import { SecteursService } from './secteurs.service';

describe('SecteursService', () => {
  let service: SecteursService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecteursService],
    }).compile();

    service = module.get<SecteursService>(SecteursService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
