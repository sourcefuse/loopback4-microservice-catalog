---
name: "sourceloop-bpmn-service"
displayName: "SourceLoop BPMN Service"
description: "Manage business process workflows with BPMN notation and Camunda integration - execute workflows, handle external tasks, and automate processes"
keywords: ["bpmn", "workflow", "camunda", "process", "automation", "business-process", "sourceloop", "orchestration"]
author: "SourceFuse"
---

# SourceLoop BPMN Service

## Overview

A LoopBack 4 microservice for Business Process Management using BPMN (Business Process Model and Notation). Integrates with Camunda for workflow execution, external task handling, and process automation.

**Key capabilities:**

- **BPMN Workflow Execution**: Deploy and run BPMN process definitions
- **Camunda Integration**: External task client for Camunda BPM
- **Process Management**: Start, monitor, and manage process instances
- **External Task Handling**: Subscribe to and complete external tasks
- **Schema Validation**: Input/output validation via AJV

## Available MCP Servers

### sourceloop-cli

**Package:** `@sourceloop/cli`
**Connection:** Local stdio via npx

Use the `microservice` tool with `--baseOnService --baseService=bpmn-service` to scaffold a new BPMN service instance.

## Installation

```typescript
import {BpmnServiceComponent} from '@sourceloop/bpmn-service';

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.component(BpmnServiceComponent);
  }
}
```

## Common Workflows

### Workflow 1: Setup BPMN Service

```bash
npx @sourceloop/cli microservice my-workflows \
  --baseOnService \
  --baseService=bpmn-service \
  --datasourceName=bpmndb \
  --datasourceType=postgresql \
  --includeMigrations
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `CAMUNDA_URL` | Camunda engine REST API URL |
| `DB_HOST` | Database host |
| `DB_PORT` | Database port |
| `DB_USER` | Database username |
| `DB_PASSWORD` | Database password |
| `DB_DATABASE` | Database name |

## Best Practices

### Do:
- Design BPMN processes in Camunda Modeler before implementing
- Use external tasks for long-running operations
- Validate process inputs with AJV schemas
- Monitor process instances for stuck or failed states
- Use the task-service alongside for human task management

### Don't:
- Embed business logic directly in BPMN XML - use external tasks
- Skip error boundary events in process definitions
- Deploy untested BPMN processes to production
- Ignore Camunda engine health checks

## Database

Requires PostgreSQL. Run migrations:

```bash
npx db-migrate up --config database.json --migrations-dir migrations
```

## Dependencies

- `@sourceloop/core`
- `camunda-external-task-client-js`
- `ajv`
