---
name: 'sourceloop-in-mail-service'
displayName: 'SourceLoop In-Mail Service'
description: 'Manage incoming email with parsing, storage, attachments, and mailbox organization using LoopBack 4'
keywords:
  [
    'email',
    'mail',
    'inbox',
    'in-mail',
    'mailbox',
    'attachment',
    'sourceloop',
    'messaging',
  ]
author: 'SourceFuse'
---

# SourceLoop In-Mail Service

## Overview

A LoopBack 4 microservice for incoming mail management. Handles email ingestion, parsing, storage, and attachment management with mailbox organization.

**Key capabilities:**

- **Email Ingestion**: Receive and store incoming emails
- **Attachment Handling**: Store and retrieve email attachments
- **Mailbox Organization**: Organize emails into mailboxes (inbox, sent, drafts, etc.)
- **Mail Parsing**: Parse email content and metadata
- **Compose & Reply**: Draft, send, reply, and forward emails

## Available MCP Servers

### sourceloop-cli

**Package:** `@sourceloop/cli`
**Connection:** Local stdio via npx

Use the `microservice` tool with `--baseOnService --baseService=in-mail-service` to scaffold a new in-mail service instance.

## Installation

```typescript
import {InMailServiceComponent} from '@sourceloop/in-mail-service';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RestApplication} from '@loopback/rest';

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Validate required environment variables
    this.validateInMailEnv();

    try {
      this.component(InMailServiceComponent);
      console.log('✅ In-Mail service loaded successfully');
    } catch (error) {
      console.error('❌ Failed to initialize in-mail service:', error.message);
      throw error;
    }
  }

  private validateInMailEnv() {
    const required = ['DB_HOST', 'DB_PORT', 'DB_DATABASE'];
    const missing = required.filter(env => !process.env[env]);
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`,
      );
    }
  }
}
```

## Key Models

- **Mail** - Email entity with subject, body, sender, recipients
- **Attachment** - Email attachment metadata and storage reference
- **MailBox** - Mailbox containers (inbox, sent, drafts, trash)

## Common Workflows

### Workflow 1: Setup In-Mail Service

```bash
npx @sourceloop/cli microservice my-mail \
  --baseOnService \
  --baseService=in-mail-service \
  --datasourceName=maildb \
  --datasourceType=postgresql \
  --includeMigrations

# After scaffolding, add these verification steps:
cd my-mail

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

## Best Practices

### Do:

- Use the attachment model for file references rather than embedding content
- Implement mailbox folders for user organization
- Use pagination for mail listing endpoints
- Pair with the notification service for new mail alerts

### Don't:

- Store large attachments directly in the database
- Skip email validation on incoming mail
- Load all mail without pagination filters

## Testing

### Unit Tests

```typescript
import {createStubInstance, expect} from '@loopback/testlab';
import {MailController} from '../controllers';
import {MessageRepository, AttachmentRepository} from '../repositories';

describe('MailController', () => {
  let controller: MailController;
  let messageRepo: sinon.SinonStubbedInstance<MessageRepository>;
  let attachmentRepo: sinon.SinonStubbedInstance<AttachmentRepository>;

  beforeEach(() => {
    messageRepo = createStubInstance(MessageRepository);
    attachmentRepo = createStubInstance(AttachmentRepository);
    controller = new MailController(messageRepo, attachmentRepo);
  });

  it('should send email message', async () => {
    const message = {
      to: 'recipient@example.com',
      subject: 'Test Email',
      body: 'This is a test',
    };
    
    await controller.send(message);
    sinon.assert.calledOnce(messageRepo.create);
  });

  it('should validate email addresses', async () => {
    const invalidMessage = {to: 'not-an-email', subject: 'Test', body: 'Test'};
    
    await expect(controller.send(invalidMessage)).to.be.rejectedWith('Invalid email');
  });

  it('should handle attachments', async () => {
    const message = {
      to: 'user@example.com',
      subject: 'With Attachment',
      attachments: [{filename: 'doc.pdf', path: '/uploads/doc.pdf'}],
    };
    
    await controller.send(message);
    sinon.assert.calledOnce(attachmentRepo.create);
  });
});
```

### Integration Tests

```typescript
import {Client, expect} from '@loopback/testlab';
import {InMailApplication} from '../application';

describe('In-Mail API', () => {
  let app: InMailApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  it('POST /messages sends internal message', async () => {
    const res = await client.post('/messages').send({
      to: ['user2@example.com'],
      subject: 'Project Update',
      body: 'The project is on track',
    }).expect(200);
    
    expect(res.body).to.have.property('id');
    expect(res.body.status).to.equal('sent');
  });

  it('GET /messages/inbox returns user inbox', async () => {
    const res = await client
      .get('/messages/inbox')
      .query({limit: 20, offset: 0})
      .expect(200);
    
    expect(res.body).to.be.Array();
    expect(res.body.length).to.be.lessThanOrEqual(20);
  });

  it('GET /messages/:id/attachments lists attachments', async () => {
    const res = await client.get('/messages/msg-123/attachments').expect(200);
    
    expect(res.body).to.be.Array();
    res.body.forEach((att: any) => {
      expect(att).to.have.properties(['id', 'filename', 'size']);
    });
  });

  it('PATCH /messages/:id marks as read', async () => {
    await client.patch('/messages/msg-123').send({isRead: true}).expect(204);
  });

  it('DELETE /messages/:id moves to trash', async () => {
    await client.delete('/messages/msg-123').expect(204);
    
    // Verify soft delete
    const message = await messageRepo.findById('msg-123', {deleted: true});
    expect(message.deleted).to.be.true();
  });
});
```

### Testing Best Practices

- Test mailbox folder organization (inbox, sent, trash, drafts)
- Verify attachment size limits
- Test pagination for large inboxes
- Validate email address format (RFC 5322)
- Test soft delete and restore functionality

## Database

Requires PostgreSQL. Run migrations:

```bash
npx db-migrate up --config database.json --migrations-dir migrations
```

## Dependencies

- `@sourceloop/core`
- `loopback4-soft-delete`
- `loopback4-authentication`
- `loopback4-authorization`
