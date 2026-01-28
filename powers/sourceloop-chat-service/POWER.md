---
name: "sourceloop-chat-service"
displayName: "SourceLoop Chat Service"
description: "Build real-time chat messaging with group support, message management, and participant tracking using LoopBack 4"
keywords: ["chat", "messaging", "real-time", "group-chat", "instant-messaging", "sourceloop", "communication"]
author: "SourceFuse"
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

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.component(ChatServiceComponent);
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
```

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
