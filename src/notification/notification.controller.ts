import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import { Notification } from 'src/schemas/notification.schema';
import { NotificationResponseDto } from './dto/notification-response.dto';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern('GET_NOTIFICATIONS_BY_RECIPIENT')
  async getByRecipient(
    @Payload()
    payload: {
      externalId: string;
      page: number;
      limit: number;
      status?: string;
      type?: string;
    },
  ): Promise<NotificationResponseDto[]> {
    return this.notificationService.findByRecipientId(payload);
  }

  @MessagePattern('MARK_AS_READ')
  async markAsRead(@Payload() id: string): Promise<NotificationResponseDto | null> {
    return this.notificationService.markAsRead(id);
  }

  @MessagePattern('MARK_ALL_AS_READ')
  async markAllAsRead(
    @Payload() externalId: string,
  ): Promise<{ count: number }> {
    return this.notificationService.markAllAsRead(externalId);
  }

  @MessagePattern('GET_UNREAD_COUNT')
  async getUnreadCount(@Payload() externalId: string) {
    return this.notificationService.getUnreadCount(externalId);
  }

  // ------------ Basic CRUD -------------------------------------

  @MessagePattern('GET_NOTIFICATIONS')
  async getAll(
    @Payload()
    payload: {
      page: number;
      limit: number;
      status?: string;
      channel?: string;
    },
  ): Promise<NotificationResponseDto[]> {
    return this.notificationService.findAll(payload);
  }

  @MessagePattern('GET_NOTIFICATION')
  async getOne(@Payload() id: string): Promise<NotificationResponseDto | null> {
    return this.notificationService.findById(id);
  }

  // TODO : Faire create
  @MessagePattern('CREATE_NOTIFICATION')
  async create(@Payload() data: Partial<Notification>): Promise<Notification> {
    return this.notificationService.create(data);
  }

  @MessagePattern('UPDATE_NOTIFICATION')
  async update(
    @Payload() payload: { id: string; data: Partial<NotificationResponseDto> },
  ): Promise<Notification | null> {
    return this.notificationService.update(payload.id, payload.data);
  }

  @MessagePattern('DELETE_NOTIFICATION')
  async delete(@Payload() id: string): Promise<NotificationResponseDto | null> {
    return this.notificationService.delete(id);
  }
}
