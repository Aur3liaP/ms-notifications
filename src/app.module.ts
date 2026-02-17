import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationModule } from './notification/notification.module';
import { TemplateModule } from './template/template.module';
import { RecipientModule } from './recipient/recipient.module';
import { ConfigModule } from '@nestjs/config';

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
