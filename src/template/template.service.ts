import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Template, TemplateDocument } from 'src/schemas/template.schema';

@Injectable()
export class TemplateService {
  constructor(
    @InjectModel(Template.name) private templateModel: Model<TemplateDocument>,
  ) {}

  async findAll(): Promise<Template[]> {
    return this.templateModel.find().exec();
  }

  async findById(id: string): Promise<Template | null> {
    return this.templateModel.findById(id).exec();
  }

  async create(data: Partial<Template>): Promise<Template> {
    return this.templateModel.create(data);
  }

  async update(id: string, data: Partial<Template>): Promise<Template | null> {
    return this.templateModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<Template | null> {
    return this.templateModel.findByIdAndDelete(id).exec();
  }
}
