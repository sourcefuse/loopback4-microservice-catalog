---
name: 'sourceloop-bpmn-service'
displayName: 'SourceLoop BPMN Service'
description: 'Manage business process workflows with BPMN notation and Camunda integration - execute workflows, handle external tasks, and automate processes'
keywords:
  [
    'bpmn',
    'workflow',
    'camunda',
    'process',
    'automation',
    'business-process',
    'sourceloop',
    'orchestration',
  ]
author: 'SourceFuse'
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
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RestApplication} from '@loopback/rest';

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Validate Camunda configuration
    this.validateBpmnEnv();

    try {
      this.component(BpmnServiceComponent);
      console.log('✅ BPMN service loaded successfully');
    } catch (error) {
      console.error('❌ Failed to initialize BPMN service:', error.message);
      throw error;
    }
  }

  private validateBpmnEnv() {
    const required = ['DB_HOST', 'DB_PORT', 'CAMUNDA_URL'];
    const missing = required.filter(env => !process.env[env]);
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`,
      );
    }

    // Validate Camunda URL format
    const camundaUrl = process.env.CAMUNDA_URL;
    if (camundaUrl && !camundaUrl.startsWith('http')) {
      throw new Error('CAMUNDA_URL must start with http:// or https://');
    }
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

# After scaffolding, add these verification steps:
cd my-workflows

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

## Environment Variables

| Variable      | Description                 |
| ------------- | --------------------------- |
| `CAMUNDA_URL` | Camunda engine REST API URL |
| `DB_HOST`     | Database host               |
| `DB_PORT`     | Database port               |
| `DB_USER`     | Database username           |
| `DB_PASSWORD` | Database password           |
| `DB_DATABASE` | Database name               |

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

## Testing

### Unit Tests

```typescript
import {createStubInstance, expect} from '@loopback/testlab';
import {WorkflowController} from '../controllers';
import {WorkflowRepository} from '../repositories';
import {CamundaProvider} from '../providers';

describe('WorkflowController', () => {
  let controller: WorkflowController;
  let workflowRepo: sinon.SinonStubbedInstance<WorkflowRepository>;
  let camundaProvider: sinon.SinonStubbedInstance<CamundaProvider>;

  beforeEach(() => {
    workflowRepo = createStubInstance(WorkflowRepository);
    camundaProvider = {
      deployProcess: sinon.stub().resolves({id: 'process-123'}),
      startInstance: sinon.stub().resolves({id: 'instance-456'}),
    };
    controller = new WorkflowController(workflowRepo, camundaProvider);
  });

  it('should deploy BPMN process', async () => {
    const bpmnXml = '<bpmn:definitions>...</bpmn:definitions>';
    
    const result = await controller.deploy({name: 'Approval Flow', bpmnXml});
    
    sinon.assert.calledOnce(camundaProvider.deployProcess);
    expect(result).to.have.property('id');
  });

  it('should start process instance', async () => {
    const processKey = 'approval-process';
    const variables = {requestId: 'req-123', amount: 5000};
    
    const instance = await controller.startInstance(processKey, variables);
    
    sinon.assert.calledWith(camundaProvider.startInstance, processKey, variables);
    expect(instance).to.have.property('id');
  });
});
```

### Integration Tests with Mock Camunda

```typescript
import {Client, expect} from '@loopback/testlab';
import {BpmnApplication} from '../application';

class MockCamundaProvider {
  processes = new Map();
  instances = new Map();
  
  async deployProcess(deployment: any) {
    const id = `process-${Date.now()}`;
    this.processes.set(id, deployment);
    return {id, name: deployment.name};
  }
  
  async startInstance(processKey: string, variables: any) {
    const instanceId = `instance-${Date.now()}`;
    this.instances.set(instanceId, {processKey, variables, status: 'running'});
    return {id: instanceId};
  }
  
  async completeTask(taskId: string, variables: any) {
    return {success: true};
  }
}

describe('BPMN API', () => {
  let app: BpmnApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    app.bind('services.CamundaProvider').toClass(MockCamundaProvider);
  });

  it('POST /workflows/deploy deploys BPMN', async () => {
    const bpmnXml = `<?xml version="1.0" encoding="UTF-8"?>
      <bpmn:definitions>...</bpmn:definitions>`;
    
    const res = await client.post('/workflows/deploy').send({
      name: 'Invoice Approval',
      bpmnXml,
    }).expect(200);
    
    expect(res.body).to.have.property('id');
    expect(res.body.name).to.equal('Invoice Approval');
  });

  it('POST /workflows/:key/start starts process', async () => {
    const res = await client
      .post('/workflows/invoice-approval/start')
      .send({
        variables: {invoiceId: 'inv-789', amount: 15000},
      })
      .expect(200);
    
    expect(res.body).to.have.property('instanceId');
  });

  it('GET /workflows/:instanceId returns process state', async () => {
    const res = await client.get('/workflows/instance-123').expect(200);
    
    expect(res.body).to.have.property('status'); // running, completed, failed
    expect(res.body).to.have.property('currentActivity');
  });

  it('POST /tasks/:id/complete completes user task', async () => {
    await client
      .post('/tasks/task-456/complete')
      .send({variables: {approved: true, comments: 'Looks good'}})
      .expect(204);
  });
});
```

### BPMN Process Testing

```typescript
describe('BPMN Process Logic', () => {
  it('should follow approval path when amount < threshold', async () => {
    const instance = await controller.startInstance('approval-process', {
      amount: 1000, // Below threshold
    });
    
    const tasks = await camundaProvider.getActiveTasks(instance.id);
    expect(tasks[0].taskDefinitionKey).to.equal('manager-approval');
  });

  it('should follow escalation path when amount > threshold', async () => {
    const instance = await controller.startInstance('approval-process', {
      amount: 10000, // Above threshold
    });
    
    const tasks = await camundaProvider.getActiveTasks(instance.id);
    expect(tasks[0].taskDefinitionKey).to.equal('director-approval');
  });

  it('should handle error boundary events', async () => {
    // Simulate error in process
    const instance = await controller.startInstance('error-test-process', {
      simulateError: true,
    });
    
    const incidents = await camundaProvider.getIncidents(instance.id);
    expect(incidents).to.have.length(1);
    expect(incidents[0].activityId).to.equal('error-boundary-event');
  });
});
```

### Testing Best Practices

- Mock Camunda REST API for integration tests
- Test BPMN process paths with different variable values
- Verify error boundary events and compensation
- Test external task workers
- Validate process instance state transitions

## Database

Requires PostgreSQL. Run migrations:

```bash
npx db-migrate up --config database.json --migrations-dir migrations
```

## Dependencies

- `@sourceloop/core`
- `camunda-external-task-client-js`
- `ajv`
