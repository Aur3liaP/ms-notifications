import { Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipient, RecipientDocument } from 'src/schemas/recipient.schema';

@Injectable()
export class RecipientService {
  constructor(
    @InjectModel(Recipient.name)
    private recipientModel: Model<RecipientDocument>,
  ) {}

  async findRecipientByExternalId(externalId: string) {
    const recipient = await this.recipientModel.findOne({
      external_id: externalId.toString(),
    });
    if (!recipient)
      throw new RpcException(`Recipient ${externalId} not found`);
    return recipient;
  }

  async findAll(): Promise<Recipient[]> {
    return this.recipientModel.find().exec();
  }

  async findById(id: string): Promise<Recipient | null> {
    return this.recipientModel.findById(id).exec();
  }

  async create(data: Partial<Recipient>): Promise<Recipient> {
    return this.recipientModel.create(data);
  }

  async update(
    id: string,
    data: Partial<Recipient>,
  ): Promise<Recipient | null> {
    return this.recipientModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Recipient | null> {
    return this.recipientModel.findByIdAndDelete(id).exec();
  }

  async deleteAll(): Promise<void> {
    await this.recipientModel.deleteMany({}).exec();
  }
}
