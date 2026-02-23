import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationModule } from './modules/notification/notification.module';
import { ConfigModule } from '@nestjs/config';
import { TemplateModule } from './modules/template/template.module';
import { RecipientModule } from './modules/recipient/recipient.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@localhost:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}?authSource=admin`,
    ),
    NotificationModule,
    TemplateModule,
    RecipientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
