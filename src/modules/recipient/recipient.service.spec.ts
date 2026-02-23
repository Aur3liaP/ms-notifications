import { Test, TestingModule } from '@nestjs/testing';
import { RecipientService } from './recipient.service';
import { mockRecipientService } from 'src/common/utils/__test__/mock';

describe('RecipientService', () => {
  let service: RecipientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: RecipientService,
          useValue: mockRecipientService,
        },
      ],
    }).compile();

    service = module.get<RecipientService>(RecipientService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
