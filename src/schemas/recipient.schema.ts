import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RecipientDocument = HydratedDocument<Recipient>;

@Schema({ timestamps: true })
export class Recipient {
  @Prop({ required: true })
  external_id: string;

  @Prop({ required: true })
  source: string;

  @Prop()
  firstname: string;

  @Prop()
  name: string;

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
    enabledChannels: string[];
    enabledTypes: string[];
  };
}

export const RecipientSchema = SchemaFactory.createForClass(Recipient);

RecipientSchema.index(
  { source: 1, external_id: 1 },
  { unique: true }
);