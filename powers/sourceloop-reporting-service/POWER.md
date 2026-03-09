---
name: 'sourceloop-reporting-service'
displayName: 'SourceLoop Reporting Service'
description: 'Generate and manage reports with data aggregation, export to multiple formats, and AWS S3 storage integration'
keywords:
  [
    'reporting',
    'report',
    'analytics',
    'data-aggregation',
    'export',
    'dashboard',
    'sourceloop',
    'business-intelligence',
  ]
author: 'SourceFuse'
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
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RestApplication} from '@loopback/rest';

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Validate reporting configuration
    this.validateReportingEnv();

    try {
      this.component(ReportingServiceComponent);
      console.log('✅ Reporting service loaded successfully');
    } catch (error) {
      console.error(
        '❌ Failed to initialize reporting service:',
        error.message,
      );
      throw error;
    }
  }

  private validateReportingEnv() {
    const required = ['DB_HOST', 'DB_PORT', 'DB_DATABASE'];
    const missing = required.filter(env => !process.env[env]);
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`,
      );
    }

    // Validate S3 configuration for report storage
    const s3Required = [
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY',
      'S3_BUCKET_NAME',
    ];
    const s3Missing = s3Required.filter(env => !process.env[env]);
    if (s3Missing.length > 0) {
      throw new Error(
        `S3 configuration required for report storage: ${s3Missing.join(', ')}`,
      );
    }
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

# After scaffolding, add these verification steps:
cd my-reports

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

| Variable                | Description                  |
| ----------------------- | ---------------------------- |
| `AWS_ACCESS_KEY_ID`     | AWS access key for S3        |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key for S3        |
| `AWS_REGION`            | AWS region for S3 bucket     |
| `S3_BUCKET_NAME`        | S3 bucket for report storage |

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

## Testing

### Unit Tests

```typescript
import {createStubInstance, expect} from '@loopback/testlab';
import {ReportController} from '../controllers';
import {ReportRepository} from '../repositories';
import {S3Provider} from '../providers';

describe('ReportController', () => {
  let controller: ReportController;
  let reportRepo: sinon.SinonStubbedInstance<ReportRepository>;
  let s3Provider: sinon.SinonStubbedInstance<S3Provider>;

  beforeEach(() => {
    reportRepo = createStubInstance(ReportRepository);
    s3Provider = {upload: sinon.stub().resolves({url: 's3://bucket/report.pdf'})};
    controller = new ReportController(reportRepo, s3Provider);
  });

  it('should generate report and upload to S3', async () => {
    const params = {startDate: '2024-01-01', endDate: '2024-12-31', format: 'pdf'};
    
    const result = await controller.generateReport('sales-report', params);
    
    sinon.assert.calledOnce(s3Provider.upload);
    expect(result).to.have.property('url');
  });

  it('should validate report parameters', async () => {
    const invalidParams = {startDate: 'invalid-date'};
    
    await expect(controller.generateReport('sales-report', invalidParams))
      .to.be.rejectedWith('Invalid date format');
  });
});
```

### Integration Tests

```typescript
import {Client, expect} from '@loopback/testlab';
import {ReportingApplication} from '../application';

class MockS3Provider {
  async upload(buffer: Buffer, key: string) {
    return {url: `s3://mock-bucket/${key}`, key};
  }
}

describe('Reporting API', () => {
  let app: ReportingApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    app.bind('services.S3Provider').toClass(MockS3Provider);
  });

  it('POST /reports generates report asynchronously', async () => {
    const res = await client.post('/reports').send({
      name: 'Monthly Sales',
      templateId: 'sales-template',
      parameters: {month: '2024-01', region: 'US'},
    }).expect(202); // Accepted
    
    expect(res.body).to.have.property('jobId');
    expect(res.body.status).to.equal('pending');
  });

  it('GET /reports/:id returns report status', async () => {
    const res = await client.get('/reports/report-123').expect(200);
    
    expect(res.body).to.have.property('status'); // pending, completed, failed
    if (res.body.status === 'completed') {
      expect(res.body).to.have.property('downloadUrl');
    }
  });
});
```

### Testing Best Practices

- Mock S3 uploads to avoid cloud costs in tests
- Test report generation with various parameter combinations
- Verify background job processing for large reports
- Test report caching and expiration
- Validate SQL injection prevention in dynamic queries

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
