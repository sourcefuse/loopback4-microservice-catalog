---
name: 'sourceloop-notification-service'
displayName: 'SourceLoop Notification Service'
description: 'Send multi-channel notifications via email, SMS, push, and WebSocket using pre-built integrations with Twilio, Firebase, PubNub, and nodemailer'
keywords:
  [
    'notification',
    'email',
    'sms',
    'push',
    'twilio',
    'firebase',
    'pubnub',
    'websocket',
    'sourceloop',
  ]
author: 'SourceFuse'
---

# SourceLoop Notification Service

## Overview

A LoopBack 4 microservice for multi-channel notification delivery. Integrates with email (nodemailer/SES), SMS (Twilio), push notifications (Firebase), real-time messaging (PubNub), and WebSocket (Socket.IO).

**Key capabilities:**

- **Email**: Send via nodemailer, AWS SES, or custom SMTP
- **SMS**: Send via Twilio
- **Push Notifications**: Send via Firebase Cloud Messaging
- **Real-time**: PubNub and Socket.IO integration
- **Templates**: Notification templates with variable substitution
- **Subscriptions**: Channel-based user subscriptions
- **Scheduling**: Deferred notification delivery

## Available MCP Servers

### sourceloop-cli

**Package:** `@sourceloop/cli`
**Connection:** Local stdio via npx

Use the `microservice` tool with `--baseOnService --baseService=notification-service` to scaffold a new notification service instance.

## Installation

```typescript
import {NotificationServiceComponent} from '@sourceloop/notification-service';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RestApplication} from '@loopback/rest';

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Validate notification provider configuration
    this.validateNotificationEnv();

    try {
      this.component(NotificationServiceComponent);
      console.log('✅ Notification service loaded successfully');
    } catch (error) {
      console.error(
        '❌ Failed to initialize notification service:',
        error.message,
      );
      throw error;
    }
  }

  private validateNotificationEnv() {
    const required = ['DB_HOST', 'DB_PORT'];
    const missing = required.filter(env => !process.env[env]);
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`,
      );
    }

    // Validate at least one notification provider is configured
    const hasEmail = process.env.SMTP_HOST || process.env.SES_REGION;
    const hasSMS = process.env.TWILIO_ACCOUNT_SID;
    const hasPush = process.env.FIREBASE_PROJECT_ID;

    if (!hasEmail && !hasSMS && !hasPush) {
      console.warn('⚠️  No notification providers configured (Email/SMS/Push)');
    }
  }
}
```

## Key Models

- **Notification** - Core notification entity with subject, body, type, receivers
- **NotificationChannel** - Channel configuration (email, SMS, push, etc.)
- **Template** - Notification templates with variable placeholders
- **Subscription** - User notification channel subscriptions

## Key Controllers

- **NotificationController** - Send notifications, bulk send
- **NotificationChannelController** - Manage channels
- **TemplateController** - CRUD for notification templates

## Common Workflows

### Workflow 1: Setup Notification Service

```bash
npx @sourceloop/cli microservice my-notifications \
  --baseOnService \
  --baseService=notification-service \
  --datasourceName=notifdb \
  --datasourceType=postgresql \
  --includeMigrations

# After scaffolding, add these verification steps:
cd my-notifications

# Test database connection
npm run db:ping

# Run migrations and verify
npm run db:migrate
npm run db:migrate:status

# Verify service starts
npm run build
npm start &
curl http://localhost:3000/ping
```

**Critical validation checklist:**

- ✅ Database connectivity verified
- ✅ All migrations applied successfully
- ✅ Service starts without errors
- ✅ Health endpoint responds

### Workflow 2: Send an Email Notification

```typescript
const notification = await notificationRepo.create({
  subject: 'Welcome',
  body: 'Welcome to our platform!',
  type: NotificationType.Email,
  receiver: {to: [{id: 'user@example.com'}]},
});
```

### Workflow 3: Use Templates

```typescript
const notification = {
  subject: 'Order Confirmation',
  body: 'Your order {{orderId}} has been confirmed.',
  type: NotificationType.Email,
  receiver: {to: [{id: 'user@example.com'}]},
  options: {
    templateId: 'order-confirmation',
    data: {orderId: '12345'},
  },
};
```

## Environment Variables

| Variable               | Description          |
| ---------------------- | -------------------- |
| `SMTP_HOST`            | SMTP server host     |
| `SMTP_PORT`            | SMTP server port     |
| `SMTP_USER`            | SMTP username        |
| `SMTP_PASSWORD`        | SMTP password        |
| `TWILIO_ACCOUNT_SID`   | Twilio account SID   |
| `TWILIO_AUTH_TOKEN`    | Twilio auth token    |
| `TWILIO_SMS_FROM`      | Twilio sender number |
| `FIREBASE_PROJECT_ID`  | Firebase project ID  |
| `PUBNUB_PUBLISH_KEY`   | PubNub publish key   |
| `PUBNUB_SUBSCRIBE_KEY` | PubNub subscribe key |

## Best Practices

### Do:

- Use notification templates for consistent messaging
- Configure channel subscriptions for user preferences
- Use bulk send for mass notifications
- Handle delivery failures with retry logic
- Use PubNub or Socket.IO for real-time notifications

### Don't:

- Hardcode notification content - use templates
- Send synchronously for bulk operations - use background processing
- Skip error handling for third-party provider failures
- Store sensitive data in notification bodies

## Testing

### Unit Tests

```typescript
import {createStubInstance, expect} from '@loopback/testlab';
import {NotificationController} from '../controllers';
import {NotificationRepository} from '../repositories';
import {EmailProvider} from '../providers';

describe('NotificationController', () => {
  let controller: NotificationController;
  let notifRepo: sinon.SinonStubbedInstance<NotificationRepository>;
  let emailProvider: sinon.SinonStubbedInstance<EmailProvider>;

  beforeEach(() => {
    notifRepo = createStubInstance(NotificationRepository);
    emailProvider = {send: sinon.stub().resolves({messageId: 'msg-123'})};
    controller = new NotificationController(notifRepo, emailProvider);
  });

  it('should send email notification', async () => {
    const notification = {
      subject: 'Test',
      body: 'Test message',
      type: NotificationType.Email,
      receiver: {to: [{id: 'user@example.com'}]},
    };
    
    await controller.create(notification);
    
    sinon.assert.calledOnce(emailProvider.send);
    sinon.assert.calledWith(notifRepo.create, sinon.match({
      status: NotificationStatus.Sent,
    }));
  });
});
```

### Integration Tests with Mock Providers

```typescript
import {Client, expect} from '@loopback/testlab';
import {NotificationApplication} from '../application';

class MockEmailProvider {
  async send(notification: Notification): Promise<any> {
    // Mock email sending
    return {messageId: `mock-${Date.now()}`};
  }
}

describe('Notification API', () => {
  let app: NotificationApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    // Bind mock provider
    app.bind('services.EmailProvider').toClass(MockEmailProvider);
  });

  it('POST /notifications sends email', async () => {
    const notification = {
      subject: 'Welcome',
      body: 'Welcome to our platform!',
      type: 'Email',
      receiver: {to: [{id: 'user@example.com'}]},
    };
    
    const res = await client.post('/notifications').send(notification).expect(200);
    
    expect(res.body).to.have.property('id');
    expect(res.body.status).to.equal('sent');
  });

  it('POST /notifications with template', async () => {
    const notification = {
      subject: 'Order Confirmation',
      body: 'Your order {{orderId}} has been confirmed',
      type: 'Email',
      receiver: {to: [{id: 'user@example.com'}]},
      options: {orderId: '12345'},
    };
    
    await client.post('/notifications').send(notification).expect(200);
  });
});
```

### Testing Best Practices

- Mock email/SMS providers to avoid sending real notifications in tests
- Test template rendering with various data inputs
- Verify notification status transitions (pending → sent → failed)
- Test batch notification sending
- Test notification scheduling and delays

## Database

Requires PostgreSQL. Run migrations:

```bash
npx db-migrate up --config database.json --migrations-dir migrations
```

## Dependencies

- `@sourceloop/core`
- `loopback4-notifications`
- `nodemailer`
- `twilio`
- `firebase-admin`
- `pubnub`
- `socket.io-client`
