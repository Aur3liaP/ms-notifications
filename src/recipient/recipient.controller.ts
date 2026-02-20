import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RecipientService } from './recipient.service';
import { Recipient } from 'src/schemas/recipient.schema';
import { CreateRecipientDto } from './dto/create-recipient.dto';

@Controller()
export class RecipientController {
  constructor(private readonly recipientService: RecipientService) {}

  @MessagePattern('GET_RECIPIENTS')
  async getAll(): Promise<Recipient[]> {
    return this.recipientService.findAll();
  }

  @MessagePattern('GET_RECIPIENTS_BY_SOURCE')
  async getAllBySource(source : string): Promise<Recipient[]> {
    return this.recipientService.findAllBySource(source);
  }

  @MessagePattern('GET_RECIPIENT')
  async getOne(@Payload() id: string): Promise<Recipient | null> {
    return this.recipientService.findById(id);
  }

  @MessagePattern('CREATE_RECIPIENT')
  async create(@Payload() data: CreateRecipientDto): Promise<Recipient> {
    return this.recipientService.create(data);
  }

  @MessagePattern('UPDATE_RECIPIENT')
  async update(
    @Payload() payload: { id: string; data: Partial<Recipient> },
  ): Promise<Recipient | null> {
    return this.recipientService.update(payload.id, payload.data);
  }

  @MessagePattern('DELETE_RECIPIENT')
  async delete(@Payload() id: string): Promise<Recipient | null> {
    return this.recipientService.delete(id);
  }
}
