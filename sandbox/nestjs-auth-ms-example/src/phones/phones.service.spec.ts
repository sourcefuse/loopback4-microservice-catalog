import { Test, TestingModule } from '@nestjs/testing';
import { PhonesService } from './phones.service';

describe('PhonesService', () => {
  let service: PhonesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhonesService],
    }).compile();

    service = module.get<PhonesService>(PhonesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
