import { Test, TestingModule } from '@nestjs/testing';
import { RecipientController } from './recipient.controller';
import { RecipientService } from './recipient.service';
import { mockRecipientService } from '../utils/__test__/mock';

describe('RecipientController', () => {
  let controller: RecipientController;
  let service: RecipientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipientController],
      providers: [
        {
          provide: RecipientService,
          useValue: mockRecipientService,
        },
      ],
    }).compile();

    controller = module.get<RecipientController>(RecipientController);
    service = module.get<RecipientService>(RecipientService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
