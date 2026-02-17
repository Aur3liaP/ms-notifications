import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import { Notification } from 'src/schemas/notification.schema';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern('GET_NOTIFICATIONS')
  async getAll(): Promise<Notification[]> {
    return this.notificationService.findAll();
  }

  @MessagePattern('GET_NOTIFICATION')
  async getOne(@Payload() id: string): Promise<Notification | null> {
    return this.notificationService.findById(id);
  }

  @MessagePattern('CREATE_NOTIFICATION')
  async create(@Payload() data: Partial<Notification>): Promise<Notification> {
    return this.notificationService.create(data);
  }

  @MessagePattern('UPDATE_NOTIFICATION')
  async update(
    @Payload() payload: { id: string; data: Partial<Notification> },
  ): Promise<Notification | null> {
    return this.notificationService.update(payload.id, payload.data);
  }

  @MessagePattern('DELETE_NOTIFICATION')
  async delete(@Payload() id: string): Promise<Notification | null> {
    return this.notificationService.delete(id);
  }
}