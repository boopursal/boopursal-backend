import { Test, TestingModule } from '@nestjs/testing';
import { BlackListesController } from './black-listes.controller';

describe('BlackListesController', () => {
  let controller: BlackListesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlackListesController],
    }).compile();

    controller = module.get<BlackListesController>(BlackListesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
