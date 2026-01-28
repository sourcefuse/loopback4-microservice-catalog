---
name: "sourceloop-oidc-service"
displayName: "SourceLoop OIDC Service"
description: "Deploy an OpenID Connect identity server with LoopBack 4 - OAuth 2.0 token endpoints, JWKS key management, and session handling"
keywords: ["oidc", "openid-connect", "identity-server", "oauth2", "jwks", "token", "sourceloop", "sso"]
author: "SourceFuse"
---

# SourceLoop OIDC Service

## Overview

A LoopBack 4 microservice that implements an OpenID Connect (OIDC) provider. Acts as a full identity server supporting OAuth 2.0 token endpoints, user info endpoints, JWKS (JSON Web Key Set) management, key rotation, and session management. Built on top of the `oidc-provider` library with Prometheus metrics via `prom-client`.

**Key capabilities:**

- **OIDC Provider**: Full OpenID Connect server implementation
- **OAuth 2.0 Endpoints**: Authorization, token, userinfo, introspection
- **JWKS Management**: JSON Web Key Set endpoint with key rotation
- **Session Management**: Server-side session handling
- **Prometheus Metrics**: Built-in monitoring via prom-client

## Available MCP Servers

### sourceloop-cli

**Package:** `@sourceloop/cli`
**Connection:** Local stdio via npx

Use the `microservice` tool with `--baseOnService --baseService=oidc-service` to scaffold a new OIDC service instance.

## Installation

```typescript
import {OidcServiceComponent} from '@sourceloop/oidc-service';

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.component(OidcServiceComponent);
  }
}
```

## Common Workflows

### Workflow 1: Setup OIDC Service

```bash
npx @sourceloop/cli microservice my-oidc \
  --baseOnService \
  --baseService=oidc-service \
  --datasourceName=oidcdb \
  --datasourceType=postgresql \
  --includeMigrations
```

## Best Practices

### Do:
- Use HTTPS in production for all OIDC endpoints
- Implement key rotation for JWKS
- Configure proper redirect URI validation
- Enable Prometheus metrics for monitoring
- Use the service with the authentication-service for a complete auth stack

### Don't:
- Expose the OIDC provider without TLS
- Skip redirect URI validation - prevents open redirect attacks
- Use static keys without rotation in production
- Ignore session management for SSO flows

## Database

Requires PostgreSQL. Run migrations:

```bash
npx db-migrate up --config database.json --migrations-dir migrations
```

## Dependencies

- `@sourceloop/core`
- `oidc-provider`
- `prom-client`
- `loopback4-authentication`
- `loopback4-authorization`
