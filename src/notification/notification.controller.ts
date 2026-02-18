import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import { Notification } from 'src/schemas/notification.schema';

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
  ): Promise<Notification[]> {
    return this.notificationService.findByRecipientId(payload);
  }

  @MessagePattern('MARK_AS_READ')
  async markAsRead(@Payload() id: string) : Promise<Notification | null> {
    return this.notificationService.markAsRead(id);
  }

  @MessagePattern('MARK_ALL_AS_READ')
  async markAllAsRead(@Payload() externalId: string) : Promise<{ count: number }> { // vu le nmb potentiel, je pense qu''on veut juste savoir cmb sont mis à jour ?
    return this.notificationService.markAllAsRead(externalId);
  }

  @MessagePattern('GET_UNREAD_COUNT')
  async getUnreadCount(@Payload() externalId: string) {
    return this.notificationService.getUnreadCount(externalId);
  }

  // ------------ Basic CRUD -------------------------------------

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
