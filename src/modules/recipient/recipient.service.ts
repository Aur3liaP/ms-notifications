import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RpcNotFoundException } from 'src/common/exceptions/rpc-exceptions';
import {
  Recipient,
  RecipientDocument,
} from 'src/database/schemas/recipient.schema';
import { CreateRecipientDto } from './dto/create-recipient.dto';

@Injectable()
export class RecipientService {
  constructor(
    @InjectModel(Recipient.name)
    private recipientModel: Model<RecipientDocument>,
  ) {}

  async findRecipient(
    externalId: string,
    source: string,
  ): Promise<Recipient & { _id: Types.ObjectId }> {
    const recipient = await this.recipientModel.findOne({
      external_id: externalId.toString(),
      source,
    });
    if (!recipient)
      throw new RpcNotFoundException(
        `Recipient ${externalId} not found for source ${source}`,
      );
    return recipient;
  }

  async create(data: CreateRecipientDto): Promise<Recipient> {
    const exists = await this.recipientModel.findOne({
      external_id: data.external_id,
      source: data.source,
    });

    if (!exists) {
      return await this.recipientModel.create(data);
    }

    return exists;
  }

  async findAllBySource(source: string): Promise<Recipient[]> {
    return this.recipientModel.find({ source }).exec();
  }

  async findAll(): Promise<Recipient[]> {
    return this.recipientModel.find().exec();
  }

  async findById(id: string): Promise<Recipient | null> {
    return this.recipientModel.findById(id).exec();
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
