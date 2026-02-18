import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipient',
  })
  recipient_id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  type: string; // ex: system | event | alert | reminder...

  @Prop({ required: true, enum: ['low', 'medium', 'high'] })
  priority: string;

  @Prop({ required: true, enum: ['sent', 'delivered', 'read', 'failed'] })
  status: string;

  @Prop({ required: true, enum: ['push', 'email', 'sms', 'inApp', 'webhook'] })
  channel: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
  })
  template_id: mongoose.Schema.Types.ObjectId;

  @Prop()
  urlAction?: string;

  @Prop({ type: Object })
  metadata: {
    sourceType: string; // event, pipeline, quota...
    source_id: string;
    extra?: object; // données libres si besoin ex:eventName,dates...
  };

  @Prop()
  scheduled_at?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
