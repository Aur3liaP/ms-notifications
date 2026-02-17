import { Module } from '@nestjs/common';
import { RecipientService } from './recipient.service';
import { RecipientController } from './recipient.controller';
import { RecipientSchema } from 'src/schemas/recipient.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[MongooseModule.forFeature([{ name: 'Recipient', schema: RecipientSchema }])],
  controllers: [RecipientController],
  providers: [RecipientService],
  exports: [RecipientService]
})
export class RecipientModule {}
