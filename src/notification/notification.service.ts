import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { RecipientService } from 'src/recipient/recipient.service';
import {
  Notification,
  NotificationDocument,
} from 'src/schemas/notification.schema';
import { RecipientDocument } from 'src/schemas/recipient.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private readonly recipientService: RecipientService, 
  ) {}

  async findByRecipientId(payload: {
    externalId: string;
    page: number;
    limit: number;
    status?: string;
    type?: string;
  }): Promise<Notification[]> {
    const { externalId, page = 1, limit = 10, status, type } = payload;

    const recipient = await this.recipientService.findRecipientByExternalId(externalId)

    const filter: Record<string, any> = { recipient_id: recipient._id };
    if (status) filter.status = status;
    if (type) filter.type = type;

    return this.notificationModel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async markAsRead(id: string): Promise<Notification | null> {
    return this.notificationModel
      .findByIdAndUpdate(
        id,
        { status: 'read' },
        { new: true }, // retourne le doc mis à jour
      )
      .exec();
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

  async findAll(): Promise<Notification[]> {
    return this.notificationModel.find().exec();
  }

  async findById(id: string): Promise<Notification | null> {
    return this.notificationModel.findById(id).exec();
  }

  async create(data: Partial<Notification>): Promise<Notification> {
    return this.notificationModel.create(data);
  }

  async update(
    id: string,
    data: Partial<Notification>,
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
