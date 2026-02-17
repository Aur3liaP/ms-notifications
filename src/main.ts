import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log(process.env.MONGO_USER);
  console.log(process.env.MONGO_PASSWORD);
  console.log(process.env.MONGO_DB_NAME);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: ['nats://localhost:4222'],
      },
    },
  );
  await app.listen();

}
bootstrap();
