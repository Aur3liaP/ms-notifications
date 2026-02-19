import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { RecipientService } from 'src/recipient/recipient.service';
import {
  Notification,
  NotificationDocument,
} from 'src/schemas/notification.schema';
import { RecipientDocument } from 'src/schemas/recipient.schema';
import { NotificationFiltersDto } from './dto/notification-filters.dto';
import { NotificationMapper } from './mapper/notification.mapper';
import { NotificationResponseDto } from './dto/notification-response.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private readonly recipientService: RecipientService, 
  ) {}

  async findByRecipientId(payload: NotificationFiltersDto): Promise<NotificationResponseDto[]> {
    const { externalId, page = 1, limit = 10, status, channel } = payload;

    const recipient = await this.recipientService.findRecipientByExternalId(externalId)

    const filter: Record<string, any> = { recipient_id: recipient._id };
    if (status) filter.status = status;
    if (channel) filter.channel = channel;

    const notifications = await this.notificationModel
      .find(filter)
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
        { new: true }, // retourne le doc mis à jour
      )
      .exec();

      return NotificationMapper.toDto(notification);
  }

  async markAllAsRead(externalId: string): Promise<{ count: number }> {
    const recipient = await this.recipientService.findRecipientByExternalId(externalId)

    const result = await this.notificationModel
      .updateMany(
        { recipient_id: recipient._id.toString(), status: { $ne: 'read' } }, // $ne = "not equal" evite de remarquer comme lu ceux deja en lu
        { status: 'read' },
      )
      .exec();

    return { count: result.modifiedCount };
  }

  async getUnreadCount(externalId: string): Promise<{ count: number }> {
    const recipient = await this.recipientService.findRecipientByExternalId(externalId)
    const count = await this.notificationModel
      .countDocuments({ recipient_id: recipient._id.toString(), status: { $ne: 'read' } })
      .exec();

    return { count };
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
    const notification = await this.notificationModel.findById(id).exec();
    return NotificationMapper.toDto(notification);
  }

    // TODO : Faire create
  async create(data: Partial<Notification>): Promise<Notification> {
    return this.notificationModel.create(data);
  }

  async update(
    id: string,
    data: Partial<NotificationResponseDto>,
  ): Promise<Notification | null> {
    return this.notificationModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  async delete(id: string): Promise<NotificationResponseDto | null> {
    return this.notificationModel.findByIdAndDelete(id).exec();
  }

   async deleteAll(): Promise<void> {
    await this.notificationModel.deleteMany({}).exec();
  }
}
