---
name: "sourceloop-reporting-service"
displayName: "SourceLoop Reporting Service"
description: "Generate and manage reports with data aggregation, export to multiple formats, and AWS S3 storage integration"
keywords: ["reporting", "report", "analytics", "data-aggregation", "export", "dashboard", "sourceloop", "business-intelligence"]
author: "SourceFuse"
---

# SourceLoop Reporting Service

## Overview

A LoopBack 4 microservice for report generation and management. Supports data aggregation, multi-format export, validation via Joi, and AWS S3 storage for generated reports.

**Key capabilities:**

- **Report Generation**: Create and manage report definitions
- **Data Aggregation**: Aggregate data across sources via Sequelize
- **Export Capabilities**: Generate reports in multiple formats
- **S3 Storage**: Store generated reports in AWS S3
- **Input Validation**: Joi-based report parameter validation
- **Encryption**: crypto-js for sensitive report data

## Available MCP Servers

### sourceloop-cli

**Package:** `@sourceloop/cli`
**Connection:** Local stdio via npx

Use the `microservice` tool with `--baseOnService --baseService=reporting-service` to scaffold a new reporting service instance.

## Installation

```typescript
import {ReportingServiceComponent} from '@sourceloop/reporting-service';

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.component(ReportingServiceComponent);
  }
}
```

## Common Workflows

### Workflow 1: Setup Reporting Service

```bash
npx @sourceloop/cli microservice my-reports \
  --baseOnService \
  --baseService=reporting-service \
  --datasourceName=reportdb \
  --datasourceType=postgresql \
  --includeMigrations \
  --sequelize
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS access key for S3 |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key for S3 |
| `AWS_REGION` | AWS region for S3 bucket |
| `S3_BUCKET_NAME` | S3 bucket for report storage |

## Best Practices

### Do:
- Use Sequelize for complex aggregation queries
- Validate report parameters with Joi schemas
- Store generated reports in S3 for durability
- Implement pagination for large report datasets
- Encrypt sensitive report data at rest

### Don't:
- Generate large reports synchronously - use background processing
- Skip input validation on report parameters
- Store large reports in the database - use S3
- Expose raw SQL in report definitions

## Database

Requires PostgreSQL with Sequelize ORM. Run migrations:

```bash
npx db-migrate up --config database.json --migrations-dir migrations
```

## Dependencies

- `@sourceloop/core`
- `sequelize`
- `joi`
- `crypto-js`
- `aws-sdk`
- `validator`
