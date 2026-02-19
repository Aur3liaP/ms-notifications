import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TemplateDocument = HydratedDocument<Template>;

@Schema({ timestamps: true })
export class Template {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string; // system | event | alert | reminder

  @Prop({ required: true, enum: ['push', 'email', 'sms', 'inApp', 'webhook'] })
  channel: string;

  @Prop()
  title?: string;

  @Prop({ required: true })
  content: string ; // texte ou html(mail)

  @Prop({ type: Object })
  metadata?: {
    variables: {
      [key: string]: {
        type: 'string' | 'number' | 'date' | 'boolean';
        required: boolean;
      };
    };
  }; //par ex eventName, date...
}

export const TemplateSchema = SchemaFactory.createForClass(Template);
