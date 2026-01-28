---
name: "sourceloop-authentication-service"
displayName: "SourceLoop Authentication Service"
description: "Build multi-tenant authentication with OAuth, MFA, SAML, and JWT token management using SourceLoop's pre-built authentication microservice"
keywords: ["authentication", "oauth", "jwt", "mfa", "saml", "login", "sourceloop", "multi-tenant", "keycloak", "auth0"]
author: "SourceFuse"
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
import {AuthenticationServiceComponent} from '@sourceloop/authentication-service';

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.component(AuthenticationServiceComponent);
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
```

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

| Variable | Description |
|----------|-------------|
| `DB_HOST` | Database host |
| `DB_PORT` | Database port |
| `DB_USER` | Database username |
| `DB_PASSWORD` | Database password |
| `DB_DATABASE` | Database name |
| `JWT_SECRET` | Secret for symmetric JWT signing |
| `JWT_ISSUER` | JWT issuer claim |
| `GOOGLE_AUTH_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_AUTH_CLIENT_SECRET` | Google OAuth client secret |
| `GOOGLE_AUTH_URL` | Google OAuth callback URL |
| `REDIRECT_URL` | Post-auth redirect URL |

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
