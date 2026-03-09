---
name: 'sourceloop-user-tenant-service'
displayName: 'SourceLoop User Tenant Service'
description: 'Manage users, tenants, roles, and multi-tenant provisioning with role-based access control and Prometheus monitoring'
keywords:
  [
    'user',
    'tenant',
    'multi-tenant',
    'rbac',
    'role',
    'provisioning',
    'sourceloop',
    'user-management',
  ]
author: 'SourceFuse'
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
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RestApplication} from '@loopback/rest';

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Validate required environment variables
    this.validateUserTenantEnv();

    try {
      this.component(UserTenantServiceComponent);
      console.log('✅ User-Tenant service loaded successfully');
    } catch (error) {
      console.error(
        '❌ Failed to initialize user-tenant service:',
        error.message,
      );
      throw error;
    }
  }

  private validateUserTenantEnv() {
    const required = [
      'DB_HOST',
      'DB_PORT',
      'DB_DATABASE',
      'USER_TEMP_PASSWORD',
    ];
    const missing = required.filter(env => !process.env[env]);
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`,
      );
    }

    // Validate password complexity requirements
    const tempPassword = process.env.USER_TEMP_PASSWORD;
    if (tempPassword && tempPassword.length < 8) {
      console.warn('⚠️  USER_TEMP_PASSWORD should be at least 8 characters');
    }
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

# After scaffolding, add these verification steps:
cd my-user-tenant

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

## Testing

### Unit Tests

```typescript
import {createStubInstance, expect} from '@loopback/testlab';
import {UserController} from '../controllers';
import {UserRepository, TenantRepository, RoleRepository} from '../repositories';

describe('UserController', () => {
  let controller: UserController;
  let userRepo: sinon.SinonStubbedInstance<UserRepository>;
  let tenantRepo: sinon.SinonStubbedInstance<TenantRepository>;

  beforeEach(() => {
    userRepo = createStubInstance(UserRepository);
    tenantRepo = createStubInstance(TenantRepository);
    controller = new UserController(userRepo, tenantRepo);
  });

  it('should create user in tenant', async () => {
    const tenant = {id: 'tenant-1', status: 'active'};
    tenantRepo.findById.resolves(tenant);
    
    const user = {email: 'user@example.com', tenantId: 'tenant-1'};
    await controller.create(user);
    
    sinon.assert.calledOnce(userRepo.create);
  });

  it('should assign role to user', async () => {
    await controller.assignRole('user-1', 'tenant-1', 'admin');
    
    sinon.assert.calledWith(userRepo.updateById, 'user-1', sinon.match({
      roles: sinon.match.array.contains(['admin']),
    }));
  });
});
```

### Integration Tests

```typescript
import {Client, expect} from '@loopback/testlab';
import {UserTenantApplication} from '../application';

describe('User Tenant API', () => {
  let app: UserTenantApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  it('POST /tenants creates new tenant', async () => {
    const res = await client.post('/tenants').send({
      name: 'Acme Corp',
      key: 'acme',
      status: 'active',
    }).expect(200);
    
    expect(res.body).to.have.property('id');
    expect(res.body.key).to.equal('acme');
  });

  it('POST /users creates user in tenant', async () => {
    const res = await client.post('/users').send({
      email: 'admin@acme.com',
      firstName: 'Admin',
      lastName: 'User',
      tenantId: 'tenant-123',
    }).expect(200);
    
    expect(res.body).to.have.property('id');
    expect(res.body.tenantId).to.equal('tenant-123');
  });
});
```

### Testing Best Practices

- Test tenant isolation at database and API layers
- Verify role-based access control (RBAC)
- Test user invitation and onboarding flows
- Validate tenant status transitions
- Test cross-tenant user scenarios (if supported)

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
