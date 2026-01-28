---
name: "sourceloop-feature-toggle-service"
displayName: "SourceLoop Feature Toggle Service"
description: "Manage feature flags and toggles for gradual rollouts, A/B testing, and per-user feature control with LoopBack 4"
keywords: ["feature-toggle", "feature-flag", "toggle", "rollout", "ab-testing", "sourceloop", "feature-gate"]
author: "SourceFuse"
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

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.component(FeatureToggleServiceComponent);
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
  async getPremium() { }
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
```

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
