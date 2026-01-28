---
name: "sourceloop-user-tenant-service"
displayName: "SourceLoop User Tenant Service"
description: "Manage users, tenants, roles, and multi-tenant provisioning with role-based access control and Prometheus monitoring"
keywords: ["user", "tenant", "multi-tenant", "rbac", "role", "provisioning", "sourceloop", "user-management"]
author: "SourceFuse"
---

# SourceLoop User Tenant Service

## Overview

A LoopBack 4 microservice for user and tenant management in multi-tenant applications. Handles user CRUD, tenant provisioning, role assignment, and role-based access control with Prometheus metrics.

**Key capabilities:**

- **User Management**: Full user lifecycle (create, update, deactivate)
- **Tenant Management**: Tenant provisioning and configuration
- **Multi-tenancy**: User-to-tenant mapping with roles
- **Role-based Access Control**: Role assignment and permission management
- **Prometheus Monitoring**: Built-in metrics via prom-client

## Available MCP Servers

### sourceloop-cli

**Package:** `@sourceloop/cli`
**Connection:** Local stdio via npx

Use the `microservice` tool with `--baseOnService --baseService=user-tenant-service` to scaffold a new user-tenant service instance.

## Installation

```typescript
import {UserTenantServiceComponent} from '@sourceloop/user-tenant-service';

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.component(UserTenantServiceComponent);
  }
}
```

## Key Models

- **User** - User entity with profile, credentials, status
- **Tenant** - Tenant configuration and metadata
- **UserTenant** - User-to-tenant mapping with role
- **Role** - Role definitions with permission sets
- **UserRole** - User-to-role assignments

## Common Workflows

### Workflow 1: Setup User Tenant Service

```bash
npx @sourceloop/cli microservice my-user-tenant \
  --baseOnService \
  --baseService=user-tenant-service \
  --datasourceName=userdb \
  --datasourceType=postgresql \
  --includeMigrations
```

### Workflow 2: Provision a New Tenant

```typescript
const tenant = await tenantRepo.create({
  name: 'Acme Corp',
  key: 'acme',
  status: TenantStatus.ACTIVE,
});

// Assign admin user to tenant
await userTenantRepo.create({
  userId: adminUser.id,
  tenantId: tenant.id,
  roleId: adminRole.id,
  status: UserStatus.ACTIVE,
});
```

## Best Practices

### Do:
- Use this service alongside the authentication-service for complete identity management
- Implement proper tenant provisioning workflows
- Use role-based access control for all protected resources
- Monitor user/tenant metrics via Prometheus endpoints
- Use bcrypt for password hashing (built-in)

### Don't:
- Allow cross-tenant user access without explicit sharing
- Create roles without well-defined permission sets
- Skip tenant status validation on user operations
- Hardcode tenant IDs - always resolve from context

## Database

Requires PostgreSQL. Run migrations:

```bash
npx db-migrate up --config database.json --migrations-dir migrations
```

## Dependencies

- `@sourceloop/core`
- `bcrypt`
- `nanoid`
- `prom-client`
- `uuid`
- `loopback4-authentication`
- `loopback4-authorization`
