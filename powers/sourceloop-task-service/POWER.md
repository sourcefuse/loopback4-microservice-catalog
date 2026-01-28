---
name: "sourceloop-task-service"
displayName: "SourceLoop Task Service"
description: "Manage workflow-based tasks with event-driven execution, Kafka/SQS/HTTP connectors, and webhook support for task lifecycle events"
keywords: ["task", "workflow", "event-driven", "kafka", "sqs", "webhook", "sourceloop", "task-management"]
author: "SourceFuse"
---

# SourceLoop Task Service

## Overview

A LoopBack 4 microservice for workflow-based task management with event-driven execution. Supports multiple message connectors (Kafka, SQS, HTTP) and webhook notifications for task lifecycle events.

**Key capabilities:**

- **Workflow-based Tasks**: Create and manage tasks tied to BPMN workflows
- **Event-driven Execution**: Tasks triggered and processed via events
- **Multi-connector Support**: Kafka, SQS, and HTTP connectors
- **Webhook Support**: Real-time notifications for task state changes
- **Client Authentication**: Secure webhook delivery with client auth
- **User Task Assignment**: Assign and track tasks per user

## Available MCP Servers

### sourceloop-cli

**Package:** `@sourceloop/cli`
**Connection:** Local stdio via npx

Use the `microservice` tool with `--baseOnService --baseService=task-service` to scaffold a new task service instance.

## Installation

The task service has multiple entry points based on your connector:

```typescript
// Kafka connector
import {TaskServiceComponent} from '@sourceloop/task-service/kafka';

// SQS connector
import {TaskServiceComponent} from '@sourceloop/task-service/sqs';

// HTTP connector
import {TaskServiceComponent} from '@sourceloop/task-service/http';
```

## Key Models

- **Task** - Core task entity with status, assignee, workflow reference
- **WorkflowTask** - Task linked to a BPMN workflow instance
- **UserTask** - User-to-task assignment mapping
- **TaskEvent** - Task lifecycle events

## Common Workflows

### Workflow 1: Setup Task Service with Kafka

```bash
npx @sourceloop/cli microservice my-tasks \
  --baseOnService \
  --baseService=task-service \
  --datasourceName=taskdb \
  --datasourceType=postgresql \
  --includeMigrations
```

```typescript
import {TaskServiceComponent} from '@sourceloop/task-service/kafka';

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.component(TaskServiceComponent);
  }
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `KAFKA_BROKERS` | Kafka broker addresses (for Kafka connector) |
| `AWS_REGION` | AWS region (for SQS connector) |
| `SQS_QUEUE_URL` | SQS queue URL (for SQS connector) |
| `CAMUNDA_URL` | Camunda engine URL |

## Best Practices

### Do:
- Choose one connector type (Kafka, SQS, or HTTP) per deployment
- Pair with the bpmn-service for full workflow orchestration
- Use webhooks for external system integration
- Implement idempotent task event handlers
- Track task state transitions for audit purposes

### Don't:
- Mix connector types in a single deployment
- Skip webhook signature verification
- Process tasks synchronously for long-running operations
- Ignore dead letter queues for failed task events

## Database

Requires PostgreSQL. Run migrations:

```bash
npx db-migrate up --config database.json --migrations-dir migrations
```

## Dependencies

- `@sourceloop/core`
- `@sourceloop/bpmn-service`
- `camunda-external-task-client-js`
- `kafkajs` (Kafka connector)
- `aws-sdk` (SQS connector)
