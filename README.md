# 📬 Multi-Channel Notification Microservice

A generic, production-ready notification microservice built with NestJS, MongoDB, and NATS. Supports multiple delivery channels (in-app, email, SMS, push, webhook), flexible templating with dynamic variables, and user preference management.

## ✨ Features

- 🎯 **Multi-Channel Support**: Send notifications via in-app, email, SMS, push notifications, or webhooks
- 📝 **Dynamic Templates**: Create reusable templates with variable substitution using Handlebars
- 👤 **User Preferences**: Respect user-defined channel and notification type preferences
- 🔔 **Priority Management**: Assign priority levels (low, medium, high) to notifications
- 📊 **Status Tracking**: Track notification lifecycle (sent, delivered, read, unread, failed)
- 🌐 **Multi-Source Support**: Handle notifications from multiple applications using a single service
- 🔄 **Event-Driven Architecture**: Communicate via NATS for decoupled, scalable design
- 📦 **MongoDB Storage**: Flexible document storage with optimized indexing
- ✅ **Template Validation**: Automatic validation of required template variables

---

## 🏗️ Architecture
```
┌─────────────────┐
│  Application 1  │──┐
│   (Altivent)    │  │
└─────────────────┘  │
                     │  NATS Messages
┌─────────────────┐  │  (CREATE_NOTIFICATION,
│  Application 2  │──┤   GET_NOTIFICATIONS, etc.)
│   (Other App)   │  │
└─────────────────┘  │
                     ↓
              ┌──────────────────┐
              │   Notification   │
              │   Microservice   │
              └──────────────────┘
                     ↓
              ┌──────────────┐
              │   MongoDB    │
              │  (Recipients,│
              │   Templates, │
              │Notifications)│
              └──────────────┘
```

### Data Model

**Recipient**: Users who receive notifications
- `external_id`: User ID from the source application
- `source`: Application identifier (e.g., "Altivent")
- `lastname`? : User's lastname
- `firstname`? : User's firstname
- `preferences`: Enabled channels and notification types

**Template**: Reusable notification templates
- `name`: Unique template identifier
- `type`: Notification type (system, event, participation, alert, etc.)
- `channel`: Delivery channel
- `title`? : Template title
- `content`: Template content with `{{variables}}`
- `metadata.variables`: Variable definitions with type and required flag

**Notification**: Individual notification instances
- `recipient_id`: Reference to Recipient
- `template_id`: Reference to Template
- `source`: Application identifier (e.g., "Altivent")
- `type`: Notification type (e.g., "alert", "system", "reminder")
- `status`: Current status (unread, read, sent, delivered, failed)
- `channel`: Delivery channel
- `priority`: Priority level
- `metadata`: Source information and extra data for template rendering

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- Docker & Docker Compose
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ms-notifications
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env`:
```env
MONGO_USER=admin
MONGO_PASSWORD=your_secure_password
MONGO_DB_NAME=ms_notification
MONGO_PORT=27017
```

4. **Start infrastructure services**
```bash
docker-compose up -d
```

This starts:
- MongoDB on port `27017`
- Mongo Express (UI) on port `8081`
- NATS on ports `4222` (client) and `8222` (monitoring)

5. **Seed the database**
```bash
npm run seed
```

6. **Start the microservice**
```bash
npm run start:dev
```

7. **OR steps 2, 4, 6**
```bash
npm run setup
```

The service is now ready to accept NATS messages!

---

## 📡 API Reference

### NATS Message Patterns

#### Create Notification
```typescript
natsClient.send('CREATE_NOTIFICATION', {
  external_id: "123",
  source: "Altivent",
  template_name: "event-updated",
  priority: "high",
  metadata: {
    sourceType: "event",
    source_id: "42",
    urlAction: "/events/42",
    extra: {
      eventName: "Tennis Tournament",
      changes: "date, location"
    }
  }
})
```

#### Get Notifications by Recipient
```typescript
natsClient.send('GET_NOTIFICATIONS_BY_RECIPIENT', {
  externalId: "123",
  source: "Altivent",
  page: 1,
  limit: 10,
  status: "unread", // optional
  channel: "inApp"  // optional
})
```

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "title": "Event Updated",
    "description": "The event Tennis Tournament has been modified: date, location",
    "type": "event",
    "priority": "high",
    "status": "unread",
    "channel": "inApp",
    "url_action": "/events/42",
    "created_at": "2026-02-20T14:30:00.000Z",
    "updated_at": "2026-02-20T14:30:00.000Z"
  }
]
```

#### Get Unread Count
```typescript
natsClient.send('GET_UNREAD_COUNT', {
  externalId: "123",
  source: "Altivent"
})
```

**Response:**
```json
{ "count": 5 }
```

#### Mark as Read
```typescript
natsClient.send('MARK_AS_READ', "507f1f77bcf86cd799439011")
```

#### Mark All as Read
```typescript
natsClient.send('MARK_ALL_AS_READ', {
  externalId: "123",
  source: "Altivent"
})
```

**Response:**
```json
{ "count": 5 }
```

#### Create Recipient
```typescript
natsClient.send('CREATE_RECIPIENT', {
  external_id: "123",
  source: "Altivent",
  firstname: "John",
  name: "Doe",
  preferences: {
    enabledChannels: ["inApp", "email"],
    enabledTypes: ["event", "participation", "system"]
  }
})
```

---

## 🎨 Template System

### Creating a Template

Templates use Handlebars syntax for variable substitution:
```json
{
  "name": "event-cancelled",
  "type": "event",
  "channel": "email",
  "title": "Event Cancelled",
  "content": "<h2>Event Cancelled</h2><p>We regret to inform you that <strong>{{eventName}}</strong> scheduled for {{eventDate}} has been cancelled.</p><p>Reason: {{cancelReason}}</p>",
  "metadata": {
    "variables": {
      "eventName": { "type": "string", "required": true },
      "eventDate": { "type": "string", "required": true },
      "cancelReason": { "type": "string", "required": false }
    }
  }
}
```

### Variable Types

- `string`: Text values
- `number`: Numeric values
- `boolean`: True/false
- `date`: Date strings

### Variable Validation

The service automatically validates that:
1. All required variables are provided
2. Variable types match the expected type
3. The recipient has enabled the template's channel and type

---

## 🔧 Integration Example

### Backend Integration (NestJS)

**1. Configure NATS Module**
```typescript
// app.module.ts
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NATS',
        transport: Transport.NATS,
        options: {
          servers: ['nats://localhost:4222'],
        }
      }
    ]),
  ],
})
export class AppModule {}
```

**2. Create NATS Service**
```typescript
// nats.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NatsService {
  constructor(@Inject('NATS') private client: ClientProxy) {}
  
  async send(subject: string, data: any): Promise<unknown> {
    return await firstValueFrom(this.client.send(subject, data));
  }
}
```

**3. Send Notifications**
```typescript
// user.service.ts
@Injectable()
export class UserService {
  constructor(private natsService: NatsService) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.db.user.create(dto);

    // Create recipient
    await this.natsService.send('CREATE_RECIPIENT', {
      external_id: user.id.toString(),
      source: 'Altivent',
      firstname: user.firstname,
      name: user.name,
      preferences: {
        enabledChannels: ['inApp', 'email'],
        enabledTypes: ['system', 'event', 'participation']
      }
    });

    // Send welcome notification
    await this.natsService.send('CREATE_NOTIFICATION', {
      external_id: user.id.toString(),
      source: 'Altivent',
      template_name: 'welcome',
      priority: 'high',
      metadata: {
        sourceType: 'system',
        source_id: 'onboarding',
        urlAction: '/profile'
      }
    });

    return user;
  }

  async updateEvent(id: number, dto: UpdateEventDto) {
    const event = await this.db.event.update({ where: { id }, data: dto });
    const participants = await this.getParticipants(id);

    // Notify all participants
    await Promise.all(
      participants.map(p =>
        this.natsService.send('CREATE_NOTIFICATION', {
          external_id: p.userId.toString(),
          source: 'Altivent',
          template_name: 'event-updated',
          priority: 'high',
          metadata: {
            sourceType: 'event',
            source_id: id.toString(),
            urlAction: `/events/${id}`,
            extra: {
              eventName: event.name,
              changes: 'date, location'
            }
          }
        })
      )
    );

    return event;
  }
}
```

---

## 🧪 Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## 📊 Monitoring

### NATS Monitoring
Access the NATS monitoring dashboard at `http://localhost:8222`

### MongoDB Monitoring
Access Mongo Express at `http://localhost:8081` (credentials: `admin` / `pass`)

### Logs
```bash
# View microservice logs
docker logs ms-notifications -f

# View NATS logs
docker logs nats -f

# View MongoDB logs
docker logs mongo -f
```

---

## 🔐 Security Considerations

- **Authentication**: The microservice does not handle authentication. Ensure your NATS connection is secured in production.
- **Input Validation**: All incoming data is validated using class-validator DTOs.
- **MongoDB Security**: Change default credentials in production and enable authentication.
- **NATS Security**: Configure TLS and authentication for production deployments.

---

## 🚢 Deployment

### Docker Production Build
```bash
# Build image
docker build -t ms-notifications:latest .

# Run with docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables (Production)
```env
NODE_ENV=production
MONGO_USER=<secure-user>
MONGO_PASSWORD=<secure-password>
MONGO_DB_NAME=ms_notification
MONGO_PORT=27017
NATS_URL=nats://nats:4222
```

---

## 📈 Performance Optimization

### Indexes

The service creates the following MongoDB indexes for optimal performance:
```javascript
// Recipient: unique composite index
{ source: 1, external_id: 1 }

// Notification: compound index for queries
{ source: 1, recipient_id: 1 }
```

### Caching Strategy (Future Enhancement)

Consider adding Redis for:
- Caching unread counts
- Template caching
- Recipient preference caching

---

## 🛠️ Tech Stack

- **Framework**: NestJS 10
- **Database**: MongoDB 7
- **Messaging**: NATS 2.12
- **ODM**: Mongoose 8
- **Templating**: Handlebars 4
- **Validation**: class-validator
- **Language**: TypeScript 5

---

## 📝 License

[MIT License](LICENSE)

---

## 🤝 Contributing

Contributions are welcome!
---

## 📧 Support

For issues and questions:
- Open an issue on GitHub
- Contact: [pic.aurelia@gmail.com]

---

## 🗺️ Roadmap

- [ ] Email delivery implementation (Nodemailer)
- [ ] SMS delivery implementation (Twilio)
- [ ] Push notification implementation (Firebase)
- [ ] Webhook delivery implementation
- [ ] Retry mechanism for failed deliveries
- [ ] Redis caching layer
- [ ] Admin dashboard UI
- [ ] Notification scheduling (cron jobs)
- [ ] Bulk notification API