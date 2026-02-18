import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { mockNotificationService } from 'src/utils/__test__/mock';

describe('NotificationController', () => {
  let controller: NotificationController;
  let service: NotificationService;

  beforeEach(async () => {
    jest.clearAllMocks(); 
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    
    controller = module.get<NotificationController>(NotificationController);
    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
