---
name: 'sourceloop-chat-service'
displayName: 'SourceLoop Chat Service'
description: 'Build real-time chat messaging with group support, message management, and participant tracking using LoopBack 4'
keywords:
  [
    'chat',
    'messaging',
    'real-time',
    'group-chat',
    'instant-messaging',
    'sourceloop',
    'communication',
  ]
author: 'SourceFuse'
---

# SourceLoop Chat Service

## Overview

A LoopBack 4 microservice for chat messaging with support for direct messages, group chats, and participant management. Integrates with the notification service for real-time message delivery.

**Key capabilities:**

- **Direct Messaging**: One-to-one user messaging
- **Group Chat**: Multi-participant chat rooms
- **Participant Management**: Add, remove, track participants
- **Message History**: Full message history with pagination
- **Soft Delete**: Messages and chats support soft deletion

## Available MCP Servers

### sourceloop-cli

**Package:** `@sourceloop/cli`
**Connection:** Local stdio via npx

Use the `microservice` tool with `--baseOnService --baseService=chat-service` to scaffold a new chat service instance.

## Installation

```typescript
import {ChatServiceComponent} from '@sourceloop/chat-service';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RestApplication} from '@loopback/rest';

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Validate required environment variables
    this.validateChatEnv();

    try {
      this.component(ChatServiceComponent);
      console.log('✅ Chat service loaded successfully');
    } catch (error) {
      console.error('❌ Failed to initialize chat service:', error.message);
      throw error;
    }
  }

  private validateChatEnv() {
    const required = ['DB_HOST', 'DB_PORT'];
    const missing = required.filter(env => !process.env[env]);
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`,
      );
    }

    // Validate real-time messaging provider
    const hasPubnub =
      process.env.PUBNUB_PUBLISH_KEY && process.env.PUBNUB_SUBSCRIBE_KEY;
    const hasSocketIO = process.env.SOCKETIO_SERVER;

    if (!hasPubnub && !hasSocketIO) {
      throw new Error(
        'Real-time messaging provider required (Pubnub or Socket.io)',
      );
    }
  }
}
```

## Key Models

- **Chat** - Chat room/conversation entity
- **Message** - Individual message with body, sender, timestamp
- **ChatParticipants** - User participation in chat rooms

## Common Workflows

### Workflow 1: Setup Chat Service

```bash
npx @sourceloop/cli microservice my-chat \
  --baseOnService \
  --baseService=chat-service \
  --datasourceName=chatdb \
  --datasourceType=postgresql \
  --includeMigrations

# After scaffolding, add these verification steps:
cd my-chat

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

- Pair with the notification service for real-time delivery via PubNub or Socket.IO
- Use pagination for message history retrieval
- Implement read receipts via message status tracking
- Use soft delete to preserve chat history for compliance

### Don't:

- Load full message history without pagination
- Skip participant validation before sending messages
- Store file attachments directly in messages - use a file service

## Testing

### Unit Tests

```typescript
import {createStubInstance, expect} from '@loopback/testlab';
import {MessageController} from '../controllers';
import {MessageRepository, ThreadRepository} from '../repositories';

describe('MessageController', () => {
  let controller: MessageController;
  let messageRepo: sinon.SinonStubbedInstance<MessageRepository>;
  let threadRepo: sinon.SinonStubbedInstance<ThreadRepository>;

  beforeEach(() => {
    messageRepo = createStubInstance(MessageRepository);
    threadRepo = createStubInstance(ThreadRepository);
    controller = new MessageController(messageRepo, threadRepo);
  });

  it('should create message in valid thread', async () => {
    const thread = {id: 'thread-1', participants: ['user-1', 'user-2']};
    threadRepo.findById.resolves(thread);
    
    const message = {body: 'Hello', threadId: 'thread-1', senderId: 'user-1'};
    await controller.create(message);
    
    sinon.assert.calledOnce(messageRepo.create);
  });
});
```

### Integration Tests

```typescript
import {Client, expect} from '@loopback/testlab';
import {ChatApplication} from '../application';

describe('Chat API', () => {
  let app: ChatApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  it('POST /messages sends message', async () => {
    const res = await client.post('/messages').send({
      body: 'Test message',
      threadId: 'thread-123',
    }).expect(200);
    
    expect(res.body).to.have.property('id');
    expect(res.body).to.have.property('createdAt');
  });
});
```

### Testing Best Practices

- Test real-time message delivery with mock Socket.IO/PubNub
- Verify read receipts and typing indicators
- Test message ordering and pagination
- Validate participant permissions
- Test soft delete for message history retention

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
