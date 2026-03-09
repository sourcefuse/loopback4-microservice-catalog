---
name: 'sourceloop-authentication-service'
displayName: 'SourceLoop Authentication Service'
description: "Build multi-tenant authentication with OAuth, MFA, SAML, and JWT token management using SourceLoop's pre-built authentication microservice"
keywords:
  [
    'authentication',
    'oauth',
    'jwt',
    'mfa',
    'saml',
    'login',
    'sourceloop',
    'multi-tenant',
    'keycloak',
    'auth0',
  ]
author: 'SourceFuse'
---

# SourceLoop Authentication Service

## Overview

A pre-built LoopBack 4 microservice providing enterprise-grade authentication with multi-tenant support. Integrates with external identity providers (Google, Facebook, Apple, Azure AD, Keycloak, Auth0, Instagram), supports OAuth 2.0, SAML, JWT tokens (symmetric and asymmetric), OTP/MFA, and user activity tracking.

**Key capabilities:**

- **Multi-tenant Authentication**: Tenant-aware login with isolated user pools
- **External IdP Integration**: Google, Facebook, Instagram, Apple, Azure AD, Keycloak, Auth0
- **JWT Token Management**: Symmetric and asymmetric encryption, refresh tokens, token revocation
- **Multi-Factor Authentication**: OTP via authenticator apps, QR code generation
- **SAML Support**: SP-initiated SAML authentication flows
- **Password Management**: Reset, change, forgot password workflows
- **User Activity Tracking**: Login/logout activity logging

## Available MCP Servers

### sourceloop-cli

**Package:** `@sourceloop/cli`
**Connection:** Local stdio via npx

Use the `microservice` tool with `--baseOnService --baseService=authentication-service` to scaffold a new authentication service instance.

## Installation

```typescript
import {
  AuthenticationServiceComponent,
  AuthServiceBindings,
} from '@sourceloop/authentication-service';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RestApplication} from '@loopback/rest';

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Validate required environment variables first
    this.validateAuthEnv();

    try {
      // Configure authentication service
      this.configure(AuthServiceBindings.Config).to({
        useCustomSequence: true,
        useSymmetricEncryption: process.env.NODE_ENV !== 'production',
        jwtSecret: process.env.JWT_SECRET,
        jwtIssuer: process.env.JWT_ISSUER || 'your-app',
      });

      this.component(AuthenticationServiceComponent);
      console.log('✅ Authentication service loaded successfully');
    } catch (error) {
      console.error(
        '❌ Failed to initialize authentication service:',
        error.message,
      );
      throw error;
    }
  }

  private validateAuthEnv() {
    const required = ['JWT_SECRET', 'DB_HOST', 'DB_PORT'];
    const missing = required.filter(env => !process.env[env]);
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`,
      );
    }
  }
}
```

## Key Models

- **User** - Core user entity with email, phone, default tenant
- **UserCredentials** - Password hashes and credential storage
- **UserTenant** - User-to-tenant mapping with roles and status
- **Tenant** - Tenant configuration and metadata
- **OtpCache** - Temporary OTP storage for MFA
- **RefreshToken** - JWT refresh token management
- **LoginActivity** - User login/logout tracking
- **RevokedToken** - Blacklisted JWT tokens
- **JwtKeys** - Asymmetric key pairs for JWT signing

## Key Controllers

- **AuthController** - Login, token generation, token refresh
- **UserController** - User CRUD, password management
- **LoginActivityController** - Activity logging and retrieval
- **OtpController** - OTP generation and verification
- **ConnectController** - OAuth provider connections

## Common Workflows

### Workflow 1: Setup Authentication Service

```bash
# Scaffold a new auth service
npx @sourceloop/cli microservice my-auth \
  --baseOnService \
  --baseService=authentication-service \
  --datasourceName=authdb \
  --datasourceType=postgresql \
  --includeMigrations

# After scaffolding, add these verification steps:
cd my-auth

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

### Workflow 2: Configure JWT with Asymmetric Keys

```typescript
this.bind(AuthServiceBindings.Config).to({
  useCustomSequence: true,
  useSymmetricEncryption: false, // Use asymmetric (RS256)
});
```

### Workflow 3: Add Google OAuth

```typescript
import {GoogleOauth2VerifyProvider} from '@sourceloop/authentication-service';

this.bind(Strategies.Passport.GOOGLE_OAUTH2_VERIFIER).toProvider(
  GoogleOauth2VerifyProvider,
);
```

## Environment Variables

| Variable                    | Description                      |
| --------------------------- | -------------------------------- |
| `DB_HOST`                   | Database host                    |
| `DB_PORT`                   | Database port                    |
| `DB_USER`                   | Database username                |
| `DB_PASSWORD`               | Database password                |
| `DB_DATABASE`               | Database name                    |
| `JWT_SECRET`                | Secret for symmetric JWT signing |
| `JWT_ISSUER`                | JWT issuer claim                 |
| `GOOGLE_AUTH_CLIENT_ID`     | Google OAuth client ID           |
| `GOOGLE_AUTH_CLIENT_SECRET` | Google OAuth client secret       |
| `GOOGLE_AUTH_URL`           | Google OAuth callback URL        |
| `REDIRECT_URL`              | Post-auth redirect URL           |

## Best Practices

### Do:

- Use asymmetric JWT (RS256) for production deployments
- Enable MFA for admin and sensitive roles
- Configure token expiry and refresh token rotation
- Use the provided login activity tracking for audit compliance
- Extend the service via providers rather than modifying source

### Don't:

- Store plain-text passwords - the service uses bcrypt hashing
- Use symmetric JWT in multi-service architectures
- Skip token revocation handling for logout flows
- Hardcode OAuth secrets - use environment variables
- Disable CORS without understanding the security implications

## Testing

### Unit Tests

```typescript
import {createStubInstance, expect} from '@loopback/testlab';
import {LoginController} from '../controllers';
import {UserRepository} from '../repositories';

describe('LoginController', () => {
  let controller: LoginController;
  let userRepo: sinon.SinonStubbedInstance<UserRepository>;

  beforeEach(() => {
    userRepo = createStubInstance(UserRepository);
    controller = new LoginController(userRepo /* other deps */);
  });

  it('should authenticate valid user with correct credentials', async () => {
    const mockUser = {id: '1', username: 'test@example.com'};
    userRepo.findOne.resolves(mockUser);

    const result = await controller.login({
      username: 'test@example.com',
      password: 'password',
    });
    expect(result).to.have.property('accessToken');
  });

  it('should reject invalid credentials', async () => {
    userRepo.findOne.resolves(null);
    await expect(
      controller.login({username: 'invalid', password: 'wrong'}),
    ).to.be.rejectedWith('Invalid credentials');
  });
});
```

### Integration Tests

```typescript
import {Client, expect} from '@loopback/testlab';
import {AuthApplication} from '../application';
import {setupApplication} from './test-helper';

describe('Authentication API', () => {
  let app: AuthApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('POST /auth/login returns JWT token', async () => {
    const res = await client
      .post('/auth/login')
      .send({username: 'test@example.com', password: 'password'})
      .expect(200);

    expect(res.body).to.have.property('accessToken');
    expect(res.body).to.have.property('refreshToken');
  });
});
```

## Database

Requires PostgreSQL. Run migrations:

```bash
npx db-migrate up --config database.json --migrations-dir migrations
```

## Dependencies

- `@sourceloop/core`
- `loopback4-authentication`
- `loopback4-authorization`
- `passport` (google, facebook, instagram, apple, azure-ad, saml)
- `otplib`, `qrcode`, `bcrypt`
