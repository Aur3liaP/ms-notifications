import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Template, TemplateDocument } from 'src/schemas/template.schema';

@Injectable()
export class TemplateService {
  constructor(
    @InjectModel(Template.name) private templateModel: Model<TemplateDocument>,
  ) {}

  async validateTemplateData(template: Template, data: any): Promise<void> {
    // Check si on a des variables
    if (!template.metadata?.variables) return;

    for (const [varName, varConfig] of Object.entries(
      template.metadata.variables,
    )) {
      const value = data[varName];

      // Check des required
      if (varConfig.required && (value === undefined || value === null)) {
        throw new RpcException(
          `Variable "${varName}" is required for template "${template.name}"`,
        );
      }

      // Check des types
      if (value !== undefined && typeof value !== varConfig.type) {
        throw new RpcException(
          `Variable "${varName}" must be of type "${varConfig.type}"`,
        );
      }
    }
  }

  async findByName(name: string): Promise<Template & { _id: Types.ObjectId }> {
    const template = await this.templateModel.findOne({ name }).exec();
    if (!template) throw new RpcException(`Template ${name} not found`);
    return template;
  }

  // ------------ Basic CRUD -------------------------------------
  async findAll(): Promise<Template[]> {
    return this.templateModel.find().exec();
  }

  async findById(id: string): Promise<Template & { _id: Types.ObjectId }> {
    const template = await this.templateModel.findById(id).exec();
    if (!template) throw new RpcException(`Template ${id} not found`);
    return template;
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

  async deleteAll(): Promise<void> {
    await this.templateModel.deleteMany({}).exec();
  }
}
