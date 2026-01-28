---
name: "sourceloop-in-mail-service"
displayName: "SourceLoop In-Mail Service"
description: "Manage incoming email with parsing, storage, attachments, and mailbox organization using LoopBack 4"
keywords: ["email", "mail", "inbox", "in-mail", "mailbox", "attachment", "sourceloop", "messaging"]
author: "SourceFuse"
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

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.component(InMailServiceComponent);
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
```

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
