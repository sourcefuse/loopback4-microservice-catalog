---
name: "sourceloop"
displayName: "ARC by SourceLoop"
description: "Build enterprise microservices with ARC - a LoopBack 4 framework providing pre-built services for authentication, payments, notifications, chat, and more"
keywords: ["sourceloop", "arc", "loopback4", "loopback", "microservice", "enterprise", "multi-tenant", "sourceloop-core"]
author: "SourceFuse"
---

# ARC by SourceLoop

## Overview

ARC (Accelerated Rapid Development) is an open-source enterprise framework built on LoopBack 4. It provides 16+ pre-built microservices for common business requirements including authentication, payments, notifications, chat, video conferencing, workflows, and more. Each service is a LoopBack 4 component that can be mounted into any LB4 application or used standalone.

**Key capabilities:**

- **CLI Scaffolding**: Scaffold monorepos, microservices, extensions, and frontend projects
- **Pre-built Microservices**: 16 production-ready services covering auth, payments, notifications, chat, BPMN, and more
- **Multi-tenancy**: Built-in tenant isolation across all services
- **Core Utilities**: Caching, feature toggles, file uploads, audit logging
- **Database Support**: PostgreSQL, MySQL with optional Sequelize ORM
- **Security**: JWT authentication, role-based authorization, soft-delete

## Available Steering Files

- `loopback4-patterns.md` - LoopBack 4 conventions, decorators, component architecture
- `cli-usage.md` - ARC CLI commands for scaffolding and project management

## Available MCP Servers

### sourceloop-cli

**Package:** `@sourceloop/cli`
**Connection:** Local stdio via npx

**Tools:**

1. **scaffold** - Create a new ARC monorepo with npm workspaces
   - `name`: Project name
   - `issuePrefix`, `integrateWithBackstage`, `owner`, `description`

2. **microservice** - Add a microservice to an existing monorepo
   - `name`: Microservice name
   - `workingDir`: Path to monorepo root
   - `baseOnService`: Whether to base on an existing SourceLoop service
   - `baseService`: Which base service to use
   - `datasourceName`, `datasourceType`, `sequelize`, `includeMigrations`

3. **extension** - Generate a local package in the packages folder
   - `name`: Package name
   - `workingDir`: Path to monorepo root

4. **cdk** - Add AWS CDK support to a microservice for Lambda deployment
   - `workingDir`: Path to the microservice
   - `iac`: Infrastructure as Code tool (cdk or cdktf)
   - `packageJsonName`, `applicationClassName`

5. **update** - Update project dependencies to latest versions
   - `workingDir`: Path to monorepo root

6. **angular** - Scaffold a new Angular project from ARC boilerplate
   - `name`: Project name
   - `workingDir`: Target directory

7. **react** - Scaffold a new React project (Vite + TypeScript) from ARC boilerplate
   - `name`: Project name
   - `workingDir`: Target directory

## Common Workflows

### Workflow 1: Create a New ARC Project

```bash
# Step 1: Scaffold the monorepo
npx @sourceloop/cli scaffold my-project

# Step 2: Add a microservice based on authentication-service
cd my-project
npx @sourceloop/cli microservice auth-service --baseOnService --baseService=authentication-service

# Step 3: Add a notification microservice
npx @sourceloop/cli microservice notif-service --baseOnService --baseService=notification-service
```

### Workflow 2: Add a Custom Microservice

```bash
# Create a new microservice with PostgreSQL and migrations
npx @sourceloop/cli microservice my-service \
  --datasourceName=mydb \
  --datasourceType=postgresql \
  --includeMigrations \
  --sequelize
```

### Workflow 3: Deploy to AWS Lambda

```bash
# Add CDK support to an existing microservice
npx @sourceloop/cli cdk --iac=cdk --dir=services/my-service
```

## Architecture Patterns

### Service as Component

Every SourceLoop service is a LoopBack 4 Component:

```typescript
import {AuthenticationServiceComponent} from '@sourceloop/authentication-service';

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.component(AuthenticationServiceComponent);
  }
}
```

### Multi-Tenancy

All services support multi-tenancy through:

- Tenant-aware datasources via `@sourceloop/core` Dynamic Datasource component
- Tenant context injected from JWT tokens
- Data isolation at the repository level

### Soft Delete

Most entities extend `SoftDeleteEntity` from `loopback4-soft-delete`:

```typescript
@model()
export class MyEntity extends UserModifiableEntity {
  // Properties...
}
```

### Authentication & Authorization

All services use:

```typescript
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';

@authenticate(STRATEGY.BEARER)
@authorize({permissions: ['ViewUser']})
async find(): Promise<User[]> { }
```

## Configuration

**MCP Server Configuration:**

```json
{
  "mcpServers": {
    "sourceloop-cli": {
      "command": "npx",
      "args": ["-y", "@sourceloop/cli", "mcp"],
      "env": {}
    }
  }
}
```

**Prerequisites:**
- Node.js >= 20
- npm
- PostgreSQL (for most services)

## Best Practices

### Do:

- Use the CLI to scaffold projects for consistent structure
- Mount services as LoopBack components rather than copying code
- Use `@sourceloop/core` mixins for common entity patterns
- Configure services through binding keys, not code modification
- Use database migrations for schema management
- Follow conventional commits for contributions

### Don't:

- Modify service source code directly - extend via providers and bindings
- Skip the authentication/authorization decorators on controllers
- Use hard-coded database connections - use datasource injection
- Ignore soft-delete patterns when extending entities
- Mix Sequelize and default LB4 repositories in the same service

## Resources

- [GitHub Repository](https://github.com/sourcefuse/loopback4-microservice-catalog)
- [ARC Documentation](https://sourcefuse.github.io/arc-docs/)
- [LoopBack 4 Documentation](https://loopback.io/doc/en/lb4/)
