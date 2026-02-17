import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TemplateService } from './template.service';
import { Template } from 'src/schemas/template.schema';

@Controller()
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @MessagePattern('GET_TEMPLATES')
  async getAll(): Promise<Template[]> {
    return this.templateService.findAll();
  }

  @MessagePattern('GET_TEMPLATE')
  async getOne(@Payload() id: string): Promise<Template | null> {
    return this.templateService.findById(id);
  }

  @MessagePattern('CREATE_TEMPLATE')
  async create(@Payload() data: Partial<Template>): Promise<Template> {
    return this.templateService.create(data);
  }

  @MessagePattern('UPDATE_TEMPLATE')
  async update(
    @Payload() payload: { id: string; data: Partial<Template> },
  ): Promise<Template | null> {
    return this.templateService.update(payload.id, payload.data);
  }

  @MessagePattern('DELETE_TEMPLATE')
  async delete(@Payload() id: string): Promise<Template | null> {
    return this.templateService.delete(id);
  }
}