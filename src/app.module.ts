import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationModule } from './notification/notification.module';
import { TemplateModule } from './template/template.module';
import { RecipientModule } from './recipient/recipient.module';

@Module({
  imports: [NotificationModule, TemplateModule, RecipientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
