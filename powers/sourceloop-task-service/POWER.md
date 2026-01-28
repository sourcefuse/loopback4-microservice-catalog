---
name: 'sourceloop-task-service'
displayName: 'SourceLoop Task Service'
description: 'Manage workflow-based tasks with event-driven execution, Kafka/SQS/HTTP connectors, and webhook support for task lifecycle events'
keywords:
  [
    'task',
    'workflow',
    'event-driven',
    'kafka',
    'sqs',
    'webhook',
    'sourceloop',
    'task-management',
  ]
author: 'SourceFuse'
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
import {TaskServiceComponent} from '@sourceloop/task-service/kafka'; // or /sqs or /http
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RestApplication} from '@loopback/rest';

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Validate task service configuration
    this.validateTaskEnv();

    try {
      this.component(TaskServiceComponent);
      console.log('✅ Task service loaded successfully');
    } catch (error) {
      console.error('❌ Failed to initialize task service:', error.message);
      throw error;
    }
  }

  private validateTaskEnv() {
    const required = ['DB_HOST', 'DB_PORT'];
    const missing = required.filter(env => !process.env[env]);
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`,
      );
    }

    // Validate connector-specific configuration
    const connectorType = process.env.TASK_CONNECTOR || 'http';
    if (connectorType === 'kafka' && !process.env.KAFKA_BROKERS) {
      throw new Error('KAFKA_BROKERS required for Kafka connector');
    }
    if (connectorType === 'sqs' && !process.env.SQS_QUEUE_URL) {
      throw new Error('SQS_QUEUE_URL required for SQS connector');
    }
  }
}
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

# After scaffolding, add these verification steps:
cd my-tasks

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

| Variable        | Description                                  |
| --------------- | -------------------------------------------- |
| `KAFKA_BROKERS` | Kafka broker addresses (for Kafka connector) |
| `AWS_REGION`    | AWS region (for SQS connector)               |
| `SQS_QUEUE_URL` | SQS queue URL (for SQS connector)            |
| `CAMUNDA_URL`   | Camunda engine URL                           |

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

## Testing

### Unit Tests

```typescript
import {createStubInstance, expect} from '@loopback/testlab';
import {TaskController} from '../controllers';
import {TaskRepository} from '../repositories';
import {KafkaProducer} from '../services';

describe('TaskController', () => {
  let controller: TaskController;
  let taskRepo: sinon.SinonStubbedInstance<TaskRepository>;
  let kafkaProducer: sinon.SinonStubbedInstance<KafkaProducer>;

  beforeEach(() => {
    taskRepo = createStubInstance(TaskRepository);
    kafkaProducer = {send: sinon.stub().resolves({offset: '123'})};
    controller = new TaskController(taskRepo, kafkaProducer);
  });

  it('should create task and publish to Kafka', async () => {
    const task = {name: 'Process Invoice', priority: 'high', payload: {invoiceId: 'inv-123'}};
    
    await controller.create(task);
    
    sinon.assert.calledOnce(taskRepo.create);
    sinon.assert.calledOnce(kafkaProducer.send);
  });

  it('should update task status', async () => {
    const taskId = 'task-123';
    await controller.updateStatus(taskId, {status: 'completed'});
    
    sinon.assert.calledWith(taskRepo.updateById, taskId, sinon.match({status: 'completed'}));
  });
});
```

### Integration Tests with Kafka

```typescript
import {Client, expect} from '@loopback/testlab';
import {TaskApplication} from '../application';
import {Kafka, Consumer} from 'kafkajs';

class MockKafkaProducer {
  messages: any[] = [];
  
  async send(record: any) {
    this.messages.push(record);
    return {offset: String(this.messages.length)};
  }
}

describe('Task API', () => {
  let app: TaskApplication;
  let client: Client;
  let mockProducer: MockKafkaProducer;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    mockProducer = new MockKafkaProducer();
    app.bind('services.KafkaProducer').to(mockProducer);
  });

  it('POST /tasks publishes to Kafka topic', async () => {
    const res = await client.post('/tasks').send({
      name: 'Generate Report',
      priority: 'medium',
      payload: {reportId: 'rep-456'},
    }).expect(200);
    
    expect(mockProducer.messages).to.have.length(1);
    expect(mockProducer.messages[0]).to.have.property('value');
  });

  it('GET /tasks/:id returns task status', async () => {
    const res = await client.get('/tasks/task-123').expect(200);
    
    expect(res.body).to.have.property('status');
    expect(res.body).to.have.property('createdAt');
  });
});
```

### Testing Best Practices

- Mock Kafka/AWS EventBridge/Camunda connectors
- Test task priority queue ordering
- Verify dead letter queue handling
- Test task retry mechanisms
- Validate webhook payload signatures

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
