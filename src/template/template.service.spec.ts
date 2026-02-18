import { Test, TestingModule } from '@nestjs/testing';
import { TemplateService } from './template.service';
import { mockTemplateService } from 'src/utils/__test__/mock';

describe('TemplateService', () => {
  let service: TemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TemplateService,
          useValue: mockTemplateService,
        },
      ],
    }).compile();

    service = module.get<TemplateService>(TemplateService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
