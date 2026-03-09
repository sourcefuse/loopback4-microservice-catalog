---
name: 'sourceloop-scheduler-service'
displayName: 'SourceLoop Scheduler Service'
description: 'Schedule and manage jobs, cron tasks, and calendar events with audit logging using LoopBack 4'
keywords:
  [
    'scheduler',
    'cron',
    'job',
    'calendar',
    'event',
    'scheduling',
    'sourceloop',
    'task-scheduler',
  ]
author: 'SourceFuse'
---

# SourceLoop Scheduler Service

## Overview

A LoopBack 4 microservice for job scheduling, cron task management, and calendar event handling. Supports audit logging for all scheduled operations.

**Key capabilities:**

- **Job Scheduling**: Schedule one-time and recurring jobs
- **Cron Tasks**: Cron expression-based task execution
- **Calendar Events**: Event management with scheduling
- **Audit Logging**: Track all scheduling operations
- **Job Status**: Monitor job execution status and history

## Available MCP Servers

### sourceloop-cli

**Package:** `@sourceloop/cli`
**Connection:** Local stdio via npx

Use the `microservice` tool with `--baseOnService --baseService=scheduler-service` to scaffold a new scheduler service instance.

## Installation

```typescript
import {SchedulerServiceComponent} from '@sourceloop/scheduler-service';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RestApplication} from '@loopback/rest';

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Validate required environment variables
    this.validateSchedulerEnv();

    try {
      this.component(SchedulerServiceComponent);
      console.log('✅ Scheduler service loaded successfully');
    } catch (error) {
      console.error(
        '❌ Failed to initialize scheduler service:',
        error.message,
      );
      throw error;
    }
  }

  private validateSchedulerEnv() {
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

- **ScheduledJob** - Job definition with schedule, payload, and status
- **JobAudit** - Audit trail for job executions

## Common Workflows

### Workflow 1: Setup Scheduler Service

```bash
npx @sourceloop/cli microservice my-scheduler \
  --baseOnService \
  --baseService=scheduler-service \
  --datasourceName=schedulerdb \
  --datasourceType=postgresql \
  --includeMigrations

# After scaffolding, add these verification steps:
cd my-scheduler

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

- Use cron expressions for recurring schedules
- Monitor job audit logs for failed executions
- Implement retry logic for failed jobs
- Use the audit-service integration for compliance tracking

### Don't:

- Schedule jobs with intervals shorter than the execution time
- Skip error handling in job execution logic
- Ignore job audit logs for debugging
- Run long-running tasks synchronously in the scheduler

## Testing

### Unit Tests

```typescript
import {createStubInstance, expect} from '@loopback/testlab';
import {SchedulerController} from '../controllers';
import {EventRepository, CalendarRepository} from '../repositories';
import {JobProcessor} from '../services';

describe('SchedulerController', () => {
  let controller: SchedulerController;
  let eventRepo: sinon.SinonStubbedInstance<EventRepository>;
  let jobProcessor: sinon.SinonStubbedInstance<JobProcessor>;

  beforeEach(() => {
    eventRepo = createStubInstance(EventRepository);
    jobProcessor = {execute: sinon.stub().resolves()};
    controller = new SchedulerController(eventRepo, jobProcessor);
  });

  it('should schedule cron job', async () => {
    const event = {
      name: 'Daily Backup',
      schedule: '0 2 * * *', // 2 AM daily
      type: 'cron',
    };
    
    await controller.create(event);
    sinon.assert.calledOnce(eventRepo.create);
  });

  it('should validate cron expression', async () => {
    const event = {name: 'Invalid Job', schedule: 'invalid-cron', type: 'cron'};
    await expect(controller.create(event)).to.be.rejectedWith('Invalid cron expression');
  });
});
```

### Integration Tests

```typescript
import {Client, expect} from '@loopback/testlab';
import {SchedulerApplication} from '../application';

describe('Scheduler API', () => {
  let app: SchedulerApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  it('POST /events schedules new job', async () => {
    const res = await client.post('/events').send({
      name: 'Email Campaign',
      schedule: '0 9 * * MON', // Every Monday at 9 AM
      payload: {campaignId: 'camp-123'},
    }).expect(200);
    
    expect(res.body).to.have.property('id');
    expect(res.body.status).to.equal('scheduled');
  });

  it('GET /events returns scheduled jobs', async () => {
    const res = await client.get('/events').expect(200);
    expect(res.body).to.be.Array();
  });

  it('DELETE /events/:id cancels job', async () => {
    await client.delete('/events/event-123').expect(204);
  });
});
```

### Testing Best Practices

- Mock time-dependent functions with sinon.useFakeTimers()
- Test job execution with various cron patterns
- Verify audit logs for job failures
- Test concurrent job execution limits
- Validate job idempotency

## Database

Requires PostgreSQL. Run migrations:

```bash
npx db-migrate up --config database.json --migrations-dir migrations
```

## Dependencies

- `@sourceloop/core`
- `@sourceloop/audit-log`
- `loopback4-soft-delete`
