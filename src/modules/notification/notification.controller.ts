import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import { Notification } from 'src/database/schemas/notification.schema';
import { NotificationResponseDto } from './dto/notification-response.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationFiltersDto } from './dto/notification-filters.dto';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern('GET_NOTIFICATIONS_BY_RECIPIENT')
  async getByRecipient(
    @Payload()
    payload: NotificationFiltersDto,
  ): Promise<NotificationResponseDto[]> {
    return this.notificationService.findByRecipientId(payload);
  }

  @MessagePattern('MARK_AS_READ')
  async markAsRead(
    @Payload() id: string,
  ): Promise<NotificationResponseDto | null> {
    return this.notificationService.markAsRead(id);
  }

  @MessagePattern('MARK_ALL_AS_READ')
  async markAllAsRead(
    @Payload() payload: { externalId: string; source: string },
  ): Promise<{ count: number }> {
    return this.notificationService.markAllAsRead(payload);
  }

  @MessagePattern('GET_UNREAD_COUNT')
  async getUnreadCount(
    @Payload() payload: { externalId: string; source: string },
  ) {
    return this.notificationService.getUnreadCount(payload);
  }

  @MessagePattern('CREATE_NOTIFICATION')
  async create(@Payload() data: CreateNotificationDto): Promise<Notification> {
    return this.notificationService.create(data);
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

  @MessagePattern('UPDATE_NOTIFICATION')
  async update(
    @Payload() payload: { id: string; data: UpdateNotificationDto },
  ): Promise<Notification | null> {
    return this.notificationService.update(payload.id, payload.data);
  }

  @MessagePattern('DELETE_NOTIFICATION')
  async delete(@Payload() id: string): Promise<Notification | null> {
    return this.notificationService.delete(id);
  }
}
