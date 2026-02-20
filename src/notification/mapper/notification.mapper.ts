import { NotificationResponseDto } from '../dto/notification-response.dto';
import Handlebars from 'handlebars';

export class NotificationMapper {
  static toDto(notification: any): NotificationResponseDto {
    const template = Handlebars.compile(notification.template_id.content);
    const renderedContent = template(notification.metadata.extra || {});

    return {
      id: notification._id,
      title: notification.template_id.title,
      content: renderedContent,
      type: notification.type,
      priority: notification.priority,
      status: notification.status,
      channel: notification.channel,
      metadata: notification.metadata,
      created_at: notification.createdAt,
      updated_at: notification.updatedAt,
    };
  }

  static toDtoArray(notifications: any[]): NotificationResponseDto[] {
    return notifications.map(this.toDto);
  }
}
