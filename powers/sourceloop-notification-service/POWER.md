---
name: "sourceloop-notification-service"
displayName: "SourceLoop Notification Service"
description: "Send multi-channel notifications via email, SMS, push, and WebSocket using pre-built integrations with Twilio, Firebase, PubNub, and nodemailer"
keywords: ["notification", "email", "sms", "push", "twilio", "firebase", "pubnub", "websocket", "sourceloop"]
author: "SourceFuse"
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

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.component(NotificationServiceComponent);
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
```

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

| Variable | Description |
|----------|-------------|
| `SMTP_HOST` | SMTP server host |
| `SMTP_PORT` | SMTP server port |
| `SMTP_USER` | SMTP username |
| `SMTP_PASSWORD` | SMTP password |
| `TWILIO_ACCOUNT_SID` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_SMS_FROM` | Twilio sender number |
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `PUBNUB_PUBLISH_KEY` | PubNub publish key |
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
