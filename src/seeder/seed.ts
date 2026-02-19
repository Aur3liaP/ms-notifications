import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { RecipientService } from '../recipient/recipient.service';
import { TemplateService } from '../template/template.service';
import { NotificationService } from '../notification/notification.service';
import { templateData } from './template.data';
import { recipientData } from './recipient.data';
import { notificationData } from './notification.data';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const recipientService = app.get(RecipientService);
  const templateService = app.get(TemplateService);
  const notificationService = app.get(NotificationService);

  console.log('🌱 Starting seed...');

  // 1. Clear existing data
  await recipientService.deleteAll();
  await templateService.deleteAll();
  await notificationService.deleteAll();
  console.log('✅ Cleared existing data');

  // 2. Seed Recipients
  const recipients = await Promise.all(
    recipientData.map((data) => recipientService.create(data)),
  );
  console.log(`✅ Created ${recipients.length} recipients`);

  // 3. Seed Templates
  const templates = await Promise.all(
    templateData.map((data) => templateService.create(data as any)),
  );
  console.log(`✅ Created ${templates.length} templates`);

  // 4. Create a map for quick lookup
  const recipientMap = new Map(
    recipients.map((r : any) => [r.external_id, r._id]),
  );
  const templateMap = new Map(templates.map((t : any) => [t.name, t._id]));

  // 5. Seed Notifications
  const notifications = await Promise.all(
    notificationData.map((data) => {
      const recipient_id = recipientMap.get(data.external_id);
      const template_id = templateMap.get(data.template_name);

      if (!recipient_id || !template_id) {
        console.warn(
          `⚠️ Skipping notification: recipient ${data.external_id} or template ${data.template_name} not found`,
        );
        return null;
      }

      const { external_id, template_name, ...notifData } = data;
      return notificationService.create({
        ...notifData,
        external_id,
        template_name: template_name,
      });
    }),
  );

  const createdNotifications = notifications.filter((n) => n !== null);
  console.log(`✅ Created ${createdNotifications.length} notifications`);

  console.log('🎉 Seed completed!');
  await app.close();
  process.exit(0);
}

bootstrap();