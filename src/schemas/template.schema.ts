import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TemplateDocument = HydratedDocument<Template>;

@Schema({ collection: 'templates', timestamps: true })
export class Template {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  type!: string; // system | event | alert | reminder

  @Prop({ required: true, enum: ['push', 'email', 'sms', 'inApp', 'webhook'] })
  channel!: string;

  @Prop()
  title?: string;

  @Prop({ required: true })
  content!: { // texte ou html(mail)
    variables: Record<string, any>; //par ex eventName, date...
  };

}

export const TemplateSchema = SchemaFactory.createForClass(Template);