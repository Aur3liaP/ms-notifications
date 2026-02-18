import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationSchema } from 'src/schemas/notification.schema';
import { RecipientModule } from 'src/recipient/recipient.module';

@Module({
  imports:[MongooseModule.forFeature([{ name: 'Notification', schema: NotificationSchema }]), RecipientModule],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports : [NotificationService]
})
export class NotificationModule {}
