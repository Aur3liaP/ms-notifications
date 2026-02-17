import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from 'src/schemas/notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  async findAll(): Promise<Notification[]> {
    return this.notificationModel.find().exec();
  }

  async findById(id: string): Promise<Notification | null> {
    return this.notificationModel.findById(id).exec();
  }

  async create(data: Partial<Notification>): Promise<Notification> {
    return this.notificationModel.create(data);
  }

  async update(id: string, data: Partial<Notification>): Promise<Notification | null> {
    return this.notificationModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<Notification | null> {
    return this.notificationModel.findByIdAndDelete(id).exec();
  }
}
