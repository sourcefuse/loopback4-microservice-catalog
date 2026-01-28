---
name: "sourceloop-audit-service"
displayName: "SourceLoop Audit Service"
description: "Track and record user actions with audit logging - inserts, updates, deletes with S3 archival and CSV export capabilities"
keywords: ["audit", "logging", "audit-trail", "compliance", "tracking", "sourceloop", "s3-archival"]
author: "SourceFuse"
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

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.component(AuditServiceComponent);
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
```

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
