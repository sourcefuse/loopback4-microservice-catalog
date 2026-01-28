---
name: 'sourceloop-feature-toggle-service'
displayName: 'SourceLoop Feature Toggle Service'
description: 'Manage feature flags and toggles for gradual rollouts, A/B testing, and per-user feature control with LoopBack 4'
keywords:
  [
    'feature-toggle',
    'feature-flag',
    'toggle',
    'rollout',
    'ab-testing',
    'sourceloop',
    'feature-gate',
  ]
author: 'SourceFuse'
---

# SourceLoop Feature Toggle Service

## Overview

A LoopBack 4 microservice for feature flag management. Controls feature availability per user, tenant, or environment for gradual rollouts and A/B testing.

**Key capabilities:**

- **Feature Flag Management**: Create and manage feature toggles
- **Environment-specific Toggles**: Different feature states per environment
- **Per-user Control**: Enable/disable features for specific users
- **Dynamic Control**: Toggle features without code deployments
- **Decorator Support**: `@featureFlag()` decorator for method-level checks

## Available MCP Servers

### sourceloop-cli

**Package:** `@sourceloop/cli`
**Connection:** Local stdio via npx

Use the `microservice` tool with `--baseOnService --baseService=feature-toggle-service` to scaffold a new feature toggle service instance.

## Installation

```typescript
import {FeatureToggleServiceComponent} from '@sourceloop/feature-toggle-service';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RestApplication} from '@loopback/rest';

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Validate required environment variables
    this.validateFeatureToggleEnv();

    try {
      this.component(FeatureToggleServiceComponent);
      console.log('✅ Feature toggle service loaded successfully');
    } catch (error) {
      console.error(
        '❌ Failed to initialize feature toggle service:',
        error.message,
      );
      throw error;
    }
  }

  private validateFeatureToggleEnv() {
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

## Using the Feature Flag Decorator

```typescript
import {featureFlag} from '@sourceloop/feature-toggle';

export class MyController {
  @featureFlag({featureKey: 'new-dashboard'})
  @get('/dashboard')
  async getDashboard() {
    // Only accessible when 'new-dashboard' feature is enabled
  }

  // Multiple features with AND operator
  @featureFlag({
    featureKey: ['premium-feature', 'beta-access'],
    operator: 'AND',
  })
  @get('/premium')
  async getPremium() {}
}
```

## Common Workflows

### Workflow 1: Setup Feature Toggle Service

```bash
npx @sourceloop/cli microservice my-toggles \
  --baseOnService \
  --baseService=feature-toggle-service \
  --datasourceName=toggledb \
  --datasourceType=postgresql \
  --includeMigrations

# After scaffolding, add these verification steps:
cd my-toggles

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

- Use meaningful feature key names (e.g., 'new-checkout-flow')
- Clean up old feature flags after full rollout
- Use the `@featureFlag()` decorator for endpoint-level control
- Combine with multi-tenancy for tenant-specific features
- Test both enabled and disabled states

### Don't:

- Use feature flags for permanent configuration - they should be temporary
- Create deeply nested feature flag dependencies
- Skip cleanup of fully-rolled-out features
- Use feature flags to hide security vulnerabilities

## Testing

### Unit Tests

```typescript
import {createStubInstance, expect} from '@loopback/testlab';
import {FeatureFlagController} from '../controllers';
import {FeatureFlagRepository} from '../repositories';
import {FeatureFlagService} from '../services';

describe('FeatureFlagController', () => {
  let controller: FeatureFlagController;
  let flagRepo: sinon.SinonStubbedInstance<FeatureFlagRepository>;
  let flagService: sinon.SinonStubbedInstance<FeatureFlagService>;

  beforeEach(() => {
    flagRepo = createStubInstance(FeatureFlagRepository);
    flagService = {isEnabled: sinon.stub()};
    controller = new FeatureFlagController(flagRepo, flagService);
  });

  it('should check if feature is enabled', async () => {
    flagService.isEnabled.resolves(true);
    
    const result = await controller.checkFeature('new-checkout');
    expect(result.enabled).to.be.true();
  });

  it('should respect tenant-specific flags', async () => {
    const flag = {key: 'premium-feature', tenantId: 'tenant-1', enabled: true};
    flagRepo.findOne.resolves(flag);
    
    const result = await flagService.isEnabled('premium-feature', {tenantId: 'tenant-1'});
    expect(result).to.be.true();
  });
});
```

### Integration Tests

```typescript
import {Client, expect} from '@loopback/testlab';
import {FeatureToggleApplication} from '../application';

describe('Feature Toggle API', () => {
  let app: FeatureToggleApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  it('POST /feature-flags creates new flag', async () => {
    const res = await client.post('/feature-flags').send({
      key: 'new-dashboard',
      enabled: false,
      description: 'New dashboard UI',
    }).expect(200);
    
    expect(res.body).to.have.property('id');
    expect(res.body.enabled).to.be.false();
  });

  it('GET /feature-flags/:key checks flag status', async () => {
    const res = await client.get('/feature-flags/new-dashboard').expect(200);
    expect(res.body).to.have.property('enabled');
  });
});
```

### Testing with @featureFlag Decorator

```typescript
import {featureFlag} from '@sourceloop/feature-toggle-service';

@featureFlag('new-checkout')
class CheckoutController {
  async processOrder() {
    // New checkout logic
  }
}

describe('Feature Flag Decorator', () => {
  it('should block access when flag is disabled', async () => {
    flagService.isEnabled.resolves(false);
    
    await client.post('/checkout/process').expect(403);
  });

  it('should allow access when flag is enabled', async () => {
    flagService.isEnabled.resolves(true);
    
    await client.post('/checkout/process').expect(200);
  });
});
```

### Testing Best Practices

- Test both enabled and disabled states for each flag
- Verify tenant-specific flag overrides
- Test flag rollout percentages (canary releases)
- Validate flag cleanup after full rollout
- Test flag dependencies and conflicts

## Database

Requires PostgreSQL (also supports MySQL). Run migrations:

```bash
npx db-migrate up --config database.json --migrations-dir migrations
```

## Dependencies

- `@sourceloop/core`
- `@sourceloop/feature-toggle`
- `loopback4-authentication`
- `loopback4-authorization`
