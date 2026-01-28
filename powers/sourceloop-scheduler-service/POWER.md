---
name: "sourceloop-scheduler-service"
displayName: "SourceLoop Scheduler Service"
description: "Schedule and manage jobs, cron tasks, and calendar events with audit logging using LoopBack 4"
keywords: ["scheduler", "cron", "job", "calendar", "event", "scheduling", "sourceloop", "task-scheduler"]
author: "SourceFuse"
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

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.component(SchedulerServiceComponent);
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
```

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

## Database

Requires PostgreSQL. Run migrations:

```bash
npx db-migrate up --config database.json --migrations-dir migrations
```

## Dependencies

- `@sourceloop/core`
- `@sourceloop/audit-log`
- `loopback4-soft-delete`
