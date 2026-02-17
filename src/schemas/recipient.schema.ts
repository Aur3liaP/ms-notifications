import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RecipientDocument = HydratedDocument<Recipient>;

@Schema({ timestamps: true })
export class Recipient {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  external_id: string;

  @Prop({
    type: {
      enabledChannels: [
        { type: String, enum: ['push', 'email', 'sms', 'inApp', 'webhook'] },
      ],
      enabledTypes: [{ type: String }],
    },
    default: { enabledChannels: [], enabledTypes: [] },
  })
  preferences: {
    enabledChannel: string[];
    enabledTypes: string[];
  };
}

export const RecipientSchema = SchemaFactory.createForClass(Recipient);
