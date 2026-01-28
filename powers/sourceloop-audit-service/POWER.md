---
name: 'sourceloop-audit-service'
displayName: 'SourceLoop Audit Service'
description: 'Track and record user actions with audit logging - inserts, updates, deletes with S3 archival and CSV export capabilities'
keywords:
  [
    'audit',
    'logging',
    'audit-trail',
    'compliance',
    'tracking',
    'sourceloop',
    's3-archival',
  ]
author: 'SourceFuse'
---

# SourceLoop Audit Service

## Overview

A LoopBack 4 microservice for audit logging that tracks and records user actions including inserts, updates, and deletes. Supports S3 archival for long-term storage and CSV export capabilities.

**Key capabilities:**

- **Action Tracking**: Record inserts, updates, and deletes across services
- **S3 Archival**: Archive audit logs to AWS S3 for compliance
- **CSV Export**: Export audit data as CSV via ExcelJS
- **Repository Mixin**: Drop-in audit logging for any repository
- **Multi-source Retrieval**: Query from both database and archive

## Available MCP Servers

### sourceloop-cli

**Package:** `@sourceloop/cli`
**Connection:** Local stdio via npx

Use the `microservice` tool with `--baseOnService --baseService=audit-service` to scaffold a new audit service instance.

## Installation

```typescript
import {AuditServiceComponent} from '@sourceloop/audit-service';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RestApplication} from '@loopback/rest';

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Validate required environment variables
    this.validateAuditEnv();

    try {
      this.component(AuditServiceComponent);
      console.log('✅ Audit service loaded successfully');
    } catch (error) {
      console.error('❌ Failed to initialize audit service:', error.message);
      throw error;
    }
  }

  private validateAuditEnv() {
    const required = ['DB_HOST', 'DB_PORT', 'DB_DATABASE'];
    const missing = required.filter(env => !process.env[env]);
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`,
      );
    }

    // Validate S3 config if archival is enabled
    if (process.env.ENABLE_ARCHIVAL === 'true') {
      const s3Required = [
        'AWS_ACCESS_KEY_ID',
        'AWS_SECRET_ACCESS_KEY',
        'S3_BUCKET_NAME',
      ];
      const s3Missing = s3Required.filter(env => !process.env[env]);
      if (s3Missing.length > 0) {
        throw new Error(
          `S3 archival enabled but missing: ${s3Missing.join(', ')}`,
        );
      }
    }
  }
}
```

## Key Models

- **AuditLog** - Core audit log entry with action, actor, timestamp, before/after data
- **CustomFilter** - Custom query filters for audit retrieval
- **MappingLog** - Entity mapping audit records
- **Job** - Background archival job tracking

## Key Controllers

- **AuditController** - CRUD operations for audit logs, export, archival

## Common Workflows

### Workflow 1: Setup Audit Service

```bash
npx @sourceloop/cli microservice my-audit \
  --baseOnService \
  --baseService=audit-service \
  --datasourceName=auditdb \
  --datasourceType=postgresql \
  --includeMigrations

# After scaffolding, add these verification steps:
cd my-audit

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

### Workflow 2: Add Audit Logging to a Repository

Use the audit mixin from `@sourceloop/audit-log`:

```typescript
import {AuditRepositoryMixin} from '@sourceloop/audit-log';

export class MyEntityRepository extends AuditRepositoryMixin<
  MyEntity,
  typeof MyEntity.prototype.id,
  MyEntityRelations
>(DefaultCrudRepository) {
  constructor(@inject('datasources.db') dataSource: DataSource) {
    super(MyEntity, dataSource);
  }
}
```

## Best Practices

### Do:

- Archive old audit logs to S3 for cost-effective long-term storage
- Use the repository mixin for automatic audit logging
- Index audit logs by actor, action type, and timestamp
- Configure retention policies for compliance requirements

### Don't:

- Store sensitive data (passwords, tokens) in audit log details
- Skip audit logging for delete operations
- Query large audit datasets without filters - use pagination

## Testing

### Unit Tests

```typescript
import {createStubInstance, expect} from '@loopback/testlab';
import {AuditLogRepository} from '../repositories';
import {MyEntityRepository} from '../repositories';

describe('AuditRepositoryMixin', () => {
  let repository: MyEntityRepository;
  let auditRepo: sinon.SinonStubbedInstance<AuditLogRepository>;

  beforeEach(() => {
    auditRepo = createStubInstance(AuditLogRepository);
    repository = new MyEntityRepository(dataSource, auditRepo);
  });

  it('should create audit log on entity creation', async () => {
    const entity = {name: 'Test Entity'};
    await repository.create(entity);
    
    sinon.assert.calledOnce(auditRepo.create);
    sinon.assert.calledWith(auditRepo.create, sinon.match({
      action: 'CREATE',
      entityName: 'MyEntity',
    }));
  });
});
```

### Integration Tests

```typescript
import {Client, expect} from '@loopback/testlab';
import {AuditApplication} from '../application';

describe('Audit Logs API', () => {
  let app: AuditApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  it('GET /audit-logs returns paginated results', async () => {
    const res = await client.get('/audit-logs').expect(200);
    
    expect(res.body).to.be.Array();
    expect(res.headers).to.have.property('x-total-count');
  });
});
```

### Testing Best Practices

- Test audit log creation for all CRUD operations
- Verify audit logs capture user identity (actedBy field)
- Test audit log queries with pagination and filters
- Ensure sensitive data is not logged in before/after fields
- Test audit log retention and archival processes

## Database

Requires PostgreSQL. Run migrations:

```bash
npx db-migrate up --config database.json --migrations-dir migrations
```

## Dependencies

- `@sourceloop/core`
- `@sourceloop/audit-log`
- `exceljs` (CSV export)
- `csvtojson`
