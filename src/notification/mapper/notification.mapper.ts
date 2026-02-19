
import { Notification } from 'src/schemas/notification.schema';
import { NotificationResponseDto } from '../dto/notification-response.dto';

export class NotificationMapper {
  static toDto(notification: any): NotificationResponseDto {
    return {
      id: notification._id,
      type: notification.type,
      priority: notification.priority,
      status: notification.status,
      channel: notification.channel,
      metadata: notification.metadata,
    };
  }

  static toDtoArray(notifications: any[]): NotificationResponseDto[] {
    return notifications.map(this.toDto);
  }
}