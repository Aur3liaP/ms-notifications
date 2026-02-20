import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RecipientService } from 'src/recipient/recipient.service';
import {
  Notification,
  NotificationDocument,
} from 'src/schemas/notification.schema';
import { NotificationFiltersDto } from './dto/notification-filters.dto';
import { NotificationMapper } from './mapper/notification.mapper';
import { NotificationResponseDto } from './dto/notification-response.dto';
import { TemplateService } from 'src/template/template.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { RpcBadRequestException, RpcNotFoundException } from 'src/common/rpc-exceptions';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private readonly recipientService: RecipientService,
    private readonly templateService: TemplateService,
  ) {}

  async findByRecipientId(
    payload: NotificationFiltersDto,
  ): Promise<NotificationResponseDto[]> {
    const { externalId, page = 1, limit = 10, status, type, channel, source } = payload;

    const recipient =
      await this.recipientService.findRecipient(externalId, source);

    const filter: Record<string, any> = { recipient_id: recipient._id };
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (channel) filter.channel = channel;

    const notifications = await this.notificationModel
      .find(filter)
      .populate('template_id')
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return NotificationMapper.toDtoArray(notifications);
  }

  async markAsRead(id: string): Promise<NotificationResponseDto | null> {
    const notification = await this.notificationModel
      .findByIdAndUpdate(
        id,
        { status: 'read' },
        { returnDocument: 'after' }, // retourne le doc mis à jour
      )
      .populate('template_id')
      .exec();

    return NotificationMapper.toDto(notification);
  }

  async markAllAsRead(payload: { externalId: string; source: string }): Promise<{ count: number }> {
    const recipient =
      await this.recipientService.findRecipient(payload.externalId, payload.source);

    const result = await this.notificationModel
      .updateMany(
        { recipient_id: recipient._id.toString(), status: { $ne: 'read' } }, // $ne = "not equal" evite de remarquer comme lu ceux deja en lu
        { status: 'read' },
      )
      .exec();

    return { count: result.modifiedCount };
  }

  async getUnreadCount(payload: { externalId: string; source: string }): Promise<{ count: number }> {
    const recipient =
      await this.recipientService.findRecipient(payload.externalId, payload.source);
    const count = await this.notificationModel
      .countDocuments({
        recipient_id: recipient._id.toString(),
        status: { $ne: 'read' },
      })
      .exec();

    return { count };
  }

  async create(data: CreateNotificationDto): Promise<Notification> {
    // Check existance recipient
    const recipient = await this.recipientService.findRecipient(
      data.external_id, data.source
    );

    // Check existance template
    const template = await this.templateService.findByName(data.template_name)
    if (!template) {
      throw new RpcNotFoundException(`Template ${data.template_name} not found`);
    }

    if (template.metadata?.variables) {
      await this.templateService.validateTemplateData(
        template,
        data.metadata?.extra || {},
      );
    }

    // Check channel autorisé
    if (!recipient.preferences.enabledChannels.includes(template.channel)) {
      throw new RpcBadRequestException(
        `Channel "${template.channel}" is not enabled for recipient ${data.external_id}. ` +
          `Allowed channels: ${recipient.preferences.enabledChannels.join(', ')}`,
      );
    }

    // Check  type notif autorisées
    if (!recipient.preferences.enabledTypes.includes(template.type)) {
      throw new RpcBadRequestException(
        `Type "${template.type}" is not enabled for recipient ${data.external_id}`,
      );
    }

    const notification = await this.notificationModel.create({
      recipient_id: recipient._id.toString(),
      template_id: template._id.toString(),
      source : data.source,
      type: template.type,
      priority: data.priority || 'medium',
      status: data.status || 'unread',
      channel: template.channel,
      metadata: data.metadata,
      scheduled_at: data.scheduled_at,
    });

    return notification;
  }

  // ------------ Basic CRUD -------------------------------------

  async findAll(payload: {
    page: number;
    limit: number;
    status?: string;
    type?: string;
  }): Promise<NotificationResponseDto[]> {
    const { page = 1, limit = 10, status, type } = payload;

    const notifications = await this.notificationModel
      .find({ status, type })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return NotificationMapper.toDtoArray(notifications);
  }

  async findById(id: string): Promise<NotificationResponseDto | null> {
    const notification = await this.notificationModel
      .findById(id)
      .populate('template_id')
      .exec();
    if (!notification) throw new RpcNotFoundException(`Notification ${id} not found`);
    return NotificationMapper.toDto(notification);
  }

  async update(
    id: string,
    data: UpdateNotificationDto,
  ): Promise<Notification | null> {
    return this.notificationModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Notification | null> {
    return this.notificationModel.findByIdAndDelete(id).exec();
  }

  async deleteAll(): Promise<void> {
    await this.notificationModel.deleteMany({}).exec();
  }
}
