---
name: 'sourceloop-oidc-service'
displayName: 'SourceLoop OIDC Service'
description: 'Deploy an OpenID Connect identity server with LoopBack 4 - OAuth 2.0 token endpoints, JWKS key management, and session handling'
keywords:
  [
    'oidc',
    'openid-connect',
    'identity-server',
    'oauth2',
    'jwks',
    'token',
    'sourceloop',
    'sso',
  ]
author: 'SourceFuse'
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
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RestApplication} from '@loopback/rest';

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Validate OIDC configuration
    this.validateOidcEnv();

    try {
      this.component(OidcServiceComponent);
      console.log('✅ OIDC service loaded successfully');
    } catch (error) {
      console.error('❌ Failed to initialize OIDC service:', error.message);
      throw error;
    }
  }

  private validateOidcEnv() {
    const required = ['DB_HOST', 'DB_PORT', 'OIDC_ISSUER'];
    const missing = required.filter(env => !process.env[env]);
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`,
      );
    }

    // Validate issuer URL format
    const issuer = process.env.OIDC_ISSUER;
    if (issuer && !issuer.startsWith('http')) {
      throw new Error('OIDC_ISSUER must be a valid URL (http:// or https://)');
    }
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

# After scaffolding, add these verification steps:
cd my-oidc

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

## Testing

### Unit Tests

```typescript
import {createStubInstance, expect} from '@loopback/testlab';
import {OIDCController} from '../controllers';
import {ClientRepository, JWKSProvider} from '../repositories';

describe('OIDCController', () => {
  let controller: OIDCController;
  let clientRepo: sinon.SinonStubbedInstance<ClientRepository>;
  let jwksProvider: sinon.SinonStubbedInstance<JWKSProvider>;

  beforeEach(() => {
    clientRepo = createStubInstance(ClientRepository);
    jwksProvider = {getPublicKeys: sinon.stub().resolves([{kid: 'key-1', ...}])};
    controller = new OIDCController(clientRepo, jwksProvider);
  });

  it('should validate redirect URI', async () => {
    const client = {id: 'client-1', redirectUris: ['https://app.example.com/callback']};
    clientRepo.findById.resolves(client);
    
    const validRequest = {clientId: 'client-1', redirectUri: 'https://app.example.com/callback'};
    await controller.authorize(validRequest);
    
    const invalidRequest = {clientId: 'client-1', redirectUri: 'https://evil.com/callback'};
    await expect(controller.authorize(invalidRequest)).to.be.rejectedWith('Invalid redirect URI');
  });

  it('should issue ID token with claims', async () => {
    const user = {id: 'user-1', email: 'user@example.com', name: 'Test User'};
    
    const token = await controller.issueIdToken(user, 'client-1', ['openid', 'profile', 'email']);
    
    expect(token).to.have.property('sub', 'user-1');
    expect(token).to.have.property('email', 'user@example.com');
  });
});
```

### Integration Tests

```typescript
import {Client, expect} from '@loopback/testlab';
import {OIDCApplication} from '../application';

describe('OIDC Provider', () => {
  let app: OIDCApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  it('GET /.well-known/openid-configuration returns discovery', async () => {
    const res = await client.get('/.well-known/openid-configuration').expect(200);
    
    expect(res.body).to.have.property('issuer');
    expect(res.body).to.have.property('authorization_endpoint');
    expect(res.body).to.have.property('token_endpoint');
    expect(res.body).to.have.property('jwks_uri');
  });

  it('GET /oidc/jwks returns public keys', async () => {
    const res = await client.get('/oidc/jwks').expect(200);
    
    expect(res.body).to.have.property('keys');
    expect(res.body.keys).to.be.Array();
    expect(res.body.keys[0]).to.have.property('kid');
  });

  it('POST /oidc/token exchanges code for tokens', async () => {
    const res = await client
      .post('/oidc/token')
      .send({
        grant_type: 'authorization_code',
        code: 'auth-code-123',
        redirect_uri: 'https://app.example.com/callback',
        client_id: 'client-1',
        client_secret: 'secret',
      })
      .expect(200);
    
    expect(res.body).to.have.property('access_token');
    expect(res.body).to.have.property('id_token');
    expect(res.body).to.have.property('token_type', 'Bearer');
  });
});
```

### Testing Best Practices

- Test all OAuth 2.0 grant types (authorization code, refresh token, client credentials)
- Verify PKCE implementation for public clients
- Test JWT signature validation
- Validate redirect URI against registered clients
- Test session management and SSO flows

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
