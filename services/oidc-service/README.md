# @sourceloop/oidc-service

DEPRECATED

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

![npm](https://img.shields.io/npm/dm/@sourceloop/oidc-service)
![node-current (scoped)](https://img.shields.io/node/v/@sourceloop/oidc-service)
![npm (prod) dependency version (scoped)](https://img.shields.io/npm/dependency-version/@sourceloop/oidc-service/@loopback/core)
![check-code-coverage](https://img.shields.io/badge/code--coverage-75.01%25-yellow)

## Overview

The OIDC Service is a component built using LoopBack 4 that provides OpenID Connect (OIDC) support for authentication. It allows integration with external identity providers and enables the issuance and verification of JSON Web Tokens (JWTs) using the OIDC protocol. This service provides the following features:

- ### OpenID Connect Support:

  The OIDC service fully supports the OpenID Connect standard, which is an identity layer built on top of the OAuth 2.0 protocol. It allows your application to authenticate and obtain user identity information from external identity providers.

- ### Authentication:

  The OIDC service handles the authentication process, allowing users to log in to your application using their credentials from supported identity providers. It supports various authentication flows, including authorization code flow, implicit flow, and hybrid flow.

- ### Authorization:

  The OIDC service provides authorization capabilities, allowing you to control access to your application's resources based on user roles and permissions. It integrates with LoopBack 4's built-in authorization features, such as decorators and guards, to enforce fine-grained access control.

- ### Token Management:

  The OIDC service handles the generation, validation, and revocation of access tokens, refresh tokens, and ID tokens. It follows the OAuth 2.0 and OpenID Connect specifications for token-based authentication and authorization.

- ### Extensibility:

  The OIDC service is designed to be extensible and customizable. You can extend its functionality by adding custom authentication and authorization providers, implementing custom token handlers, or integrating additional identity management services.

- ### Developer-Friendly APIs:
  The OIDC service provides a developer-friendly API for integrating authentication and authorization into your application. It offers easy-to-use methods and interfaces for handling user authentication, profile management, token management, and other related tasks.

To get started with a basic implementation of this service, see [/sandbox/oidc-basic-example](https://github.com/sourcefuse/loopback4-microservice-catalog/tree/master/sandbox/oidc-basic-example).

### Working and Flow

1. Application Registration: Before using OIDC, you need to register your application with the identity provider (IdP) or the OIDC service. During the registration process, you typically provide information about your application, such as the redirect URLs, client ID, and client secret.

2. User Initiation: When a user wants to log in to your application, they are directed to the login page of the IdP. This can be initiated by clicking a "Sign In" button or by accessing a protected resource that requires authentication.

3. Authentication Request: Your application initiates the authentication process by redirecting the user to the IdP's authorization endpoint. The request includes parameters such as the client ID, redirect URL, requested scopes, and response type (e.g., code, token, or both).

4. User Authentication: The user enters their credentials (username and password) on the IdP's login page. The IdP verifies the user's identity and may prompt for additional factors, such as multi-factor authentication (MFA).

5. Authorization Grant: Once the user is authenticated, the IdP generates an authorization grant. The type of grant depends on the requested response type. For example, in the authorization code flow, the grant is a short-lived authorization code returned to the client as a query parameter in the redirect URL.

6. Token Request: The client application (your application) exchanges the authorization grant for an access token and optionally a refresh token. The client makes a POST request to the IdP's token endpoint, providing the authorization grant, client ID, client secret, and other required parameters.

7. Token Validation: The IdP validates the authorization grant and, if valid, issues an access token and refresh token. The access token contains information about the user and their authorized scopes. The client can use the access token to access protected resources on behalf of the user.

8. User Info Request: To obtain additional information about the user, the client can make a request to the IdP's user info endpoint, providing the access token as an authorization header or query parameter. The user info response contains user attributes and claims, such as name, email, and profile picture.

9. Token Usage: The client application can use the access token to make authorized requests to the protected resources of your application's API. The access token is typically included as an authorization header or a query parameter in API requests.

Note: The OIDC flow may vary depending on the specific flow you choose (e.g., authorization code flow, implicit flow, hybrid flow) and the configurations of the IdP and client application. However, the general principles and steps outlined above provide an overview of the OIDC working and flow.

## Installation

```bash

npm i @sourceloop/oidc-service

```

### Usage

To use the OIDC Service in your LoopBack 4 application, follow these steps:

- Create a new LoopBack 4 application if you don't have one already: `lb4 testapp`
- Install the OIDC service: `npm i @sourceloop/oidc-service`
- Set the required [environment variables](#environment-variables).
- The .env variables `OIDC_CLAIMS_PROFILE`, `OIDC_ISSUER_URL` to set the common claims and issuer url for all the clients.
- Run the [migrations](#migrations).
- Make sure you have entries for `client_id`, `client_secret`, `grant-types`, `redirect-urls`, `response_types` in your `auth_clients` table.
- Set up a [Loopback4 Datasource](https://loopback.io/doc/en/lb4/DataSource.html) with `dataSourceName` property set to
  `AuthDbSourceName`. You can see an example datasource [here](#setting-up-a-datasource).
- Set up a Loopback4 Datasource for caching tokens with `dataSourceName` property set to `AuthCacheSourceName`.
- Add the OIDCServiceComponent to your LoopBack 4 application in the application.ts file:

```typescript
import {ApplicationConfig} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import {OidcServiceComponent, TemplateBindings} from '@sourceloop/oidc-service';
import path from 'path';

export {ApplicationConfig};

export class OidcApplication extends RestApplication {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // ...

    // Add the OidcServiceComponent to the application
    this.component(OidcServiceComponent);

    // Modify the template file path for login and interaction screens
    this.bind(TemplateBindings.LoginTemplate).to(
      path.join(__dirname, '../public/views/login.ejs'),
    );
    this.bind(TemplateBindings.InteractionTemplate).to(
      path.join(__dirname, '../public/views/interaction.ejs'),
    );

    // ...
  }
}
```

### Asymmetric Token Signing and Verification

If you are using asymmetric token signing and verification, you should have auth datasource present in the service and auth redis datasource on the facade level. Example datasource file for auth database is:-

Auth DB datasource :-

```ts
import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {AuthDbSourceName} from '@sourceloop/core';
const DEFAULT_MAX_CONNECTIONS = 25;
const DEFAULT_DB_IDLE_TIMEOUT_MILLIS = 60000;
const DEFAULT_DB_CONNECTION_TIMEOUT_MILLIS = 2000;

const config = {
  name: 'auth',
  connector: 'postgresql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  schema: process.env.DB_SCHEMA,
  password: process.env.DB_PASSWORD,
  database: process.env.AUTH_DB,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class AuthDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = AuthDbSourceName;

  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.auth', {optional: true})
    dsConfig: object = config,
  ) {
    if (!!+(process.env.ENABLE_DB_CONNECTION_POOLING ?? 0)) {
      const dbPool = {
        max: +(process.env.DB_MAX_CONNECTIONS ?? DEFAULT_MAX_CONNECTIONS),
        idleTimeoutMillis: +(
          process.env.DB_IDLE_TIMEOUT_MILLIS ?? DEFAULT_DB_IDLE_TIMEOUT_MILLIS
        ),
        connectionTimeoutMillis: +(
          process.env.DB_CONNECTION_TIMEOUT_MILLIS ??
          DEFAULT_DB_CONNECTION_TIMEOUT_MILLIS
        ),
      };

      dsConfig = {...dsConfig, ...dbPool};
    }

    super(dsConfig);
  }
}
```

Auth Cache Redis Datasource:-

```ts
import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {AnyObject, juggler} from '@loopback/repository';
import {readFileSync} from 'fs';
import {AuthCacheSourceName} from '@sourceloop/core';

const config = {
  name: process.env.REDIS_NAME,
  connector: 'kv-redis',
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  db: process.env.REDIS_DATABASE,
  url: process.env.REDIS_URL,
  tls:
    +process.env.REDIS_TLS_ENABLED! && process.env.REDIS_TLS_CERT
      ? {
          ca: readFileSync(process.env.REDIS_TLS_CERT),
        }
      : undefined,
  sentinels:
    +process.env.REDIS_HAS_SENTINELS! && process.env.REDIS_SENTINELS
      ? JSON.parse(process.env.REDIS_SENTINELS)
      : undefined,
  sentinelPassword:
    +process.env.REDIS_HAS_SENTINELS! && process.env.REDIS_SENTINEL_PASSWORD
      ? process.env.REDIS_SENTINEL_PASSWORD
      : undefined,
  role:
    +process.env.REDIS_HAS_SENTINELS! && process.env.REDIS_SENTINEL_ROLE
      ? process.env.REDIS_SENTINEL_ROLE
      : undefined,
};

@lifeCycleObserver('datasource')
export class RedisDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static readonly dataSourceName = AuthCacheSourceName;
  static readonly defaultConfig = config;

  constructor(
    @inject(`datasources.config.${process.env.REDIS_NAME}`, {optional: true})
    dsConfig: AnyObject = config,
  ) {
    if (
      +process.env.REDIS_HAS_SENTINELS! &&
      !!process.env.REDIS_SENTINEL_HOST &&
      !!process.env.REDIS_SENTINEL_PORT
    ) {
      dsConfig.sentinels = [
        {
          host: process.env.REDIS_SENTINEL_HOST,
          port: +process.env.REDIS_SENTINEL_PORT,
        },
      ];
    }
    super(dsConfig);
  }
}
```

### Environment Variables

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Required</th>
      <th>Default Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>NODE_ENV</td>
      <td>Yes</td>
      <td></td>
      <td>Node environment value, i.e. 'dev', 'test', 'prod'</td>
    </tr>
    <tr>
      <td>LOG_LEVEL</td>
      <td>Yes</td>
      <td></td>
      <td>Log level value, i.e. 'error', 'warn', 'info', 'verbose', 'debug'</td>
    </tr>
    <tr>
      <td>DB_HOST</td>
      <td>Yes</td>
      <td></td>
      <td>Hostname for the database server.</td>
    </tr>
    <tr>
      <td>DB_PORT</td>
      <td>Yes</td>
      <td></td>
      <td>Port for the database server.</td>
    </tr>
    <tr>
      <td>DB_USER</td>
      <td>Yes</td>
      <td></td>
      <td>User for the database.</td>
    </tr>
    <tr>
      <td>DB_PASSWORD</td>
      <td>Yes</td>
      <td></td>
      <td>Password for the database user.</td>
    </tr>
    <tr>
      <td>DB_DATABASE</td>
      <td>Yes</td>
      <td></td>
      <td>Database to connect to on the database server.</td>
    </tr>
    <tr>
      <td>DB_SCHEMA</td>
      <td>Yes</td>
      <td>public</td>
      <td>Database schema used for the data source. In PostgreSQL, this will be 'public' unless a schema is made explicitly for the service.</td>
    </tr>
    <tr>
      <td>REDIS_HOST</td>
      <td>Yes</td>
      <td></td>
      <td>Hostname of the Redis server.</td>
    </tr>
    <tr>
      <td>REDIS_PORT</td>
      <td>Yes</td>
      <td></td>
      <td>Port to connect to the Redis server over.</td>
    </tr>
    <tr>
      <td>REDIS_URL</td>
      <td>Yes</td>
      <td></td>
      <td>Fully composed URL for Redis connection. Used instead of other settings if set.</td>
    </tr>
    <tr>
      <td>REDIS_PASSWORD</td>
      <td>Yes</td>
      <td></td>
      <td>Password for Redis if authentication is enabled.</td>
    </tr>
    <tr>
      <td>REDIS_DATABASE</td>
      <td>Yes</td>
      <td></td>
      <td>Database within Redis to connect to.</td>
    </tr>
    <tr>
      <td>JWT_SECRET</td>
      <td>Yes</td>
      <td></td>
      <td>Symmetric signing key of the JWT token.</td>
    </tr>
    <tr>
      <td>JWT_ISSUER</td>
      <td>Yes</td>
      <td></td>
      <td>Issuer of the JWT token.</td>
    </tr>
    <tr>
      <td>OIDC_CLAIMS_PROFILE</td>
      <td>Yes</td>
      <td></td>
      <td>Common claims for all the clients.</td>
    </tr>
    <tr>
      <td>OIDC_ISSUER_URL</td>
      <td>Yes</td>
      <td></td>
      <td>Issuer URL.</td>
    </tr>
    <tr>
      <td>OIDC_JWKS_KTY</td>
      <td>Yes</td>
      <td></td>
      <td>Key Type. It specifies the type of the key, e.g. 'RSA'.</td>
    </tr>
    <tr>
      <td>OIDC_JWKS_ALG</td>
      <td>Yes</td>
      <td></td>
      <td>Algorithm, e.g. RS256.</td>
    </tr>
    <tr>
      <td>OIDC_JWKS_USE</td>
      <td>Yes</td>
      <td></td>
      <td>Key Use. It indicates the purpose of the key, e.g. signature.</td>
    </tr>
    <tr>
      <td>OIDC_JWKS_D</td>
      <td>Yes</td>
      <td></td>
      <td>Private Exponent. It represents the private exponent of the RSA key.</td>
    </tr>
    <tr>
      <td>OIDC_JWKS_DP</td>
      <td>Yes</td>
      <td></td>
      <td>First Factor CRT Exponent. It is the exponent used for the Chinese Remainder Theorem (CRT) calculation.</td>
    </tr>
    <tr>
      <td>OIDC_JWKS_DQ</td>
      <td>Yes</td>
      <td></td>
      <td>Second Factor CRT Exponent. It is another exponent used for the CRT calculation.</td>
    </tr>
    <tr>
      <td>OIDC_JWKS_E</td>
      <td>Yes</td>
      <td></td>
      <td>Public Exponent. It represents the public exponent of the RSA key.</td>
    </tr>
    <tr>
      <td>OIDC_JWKS_N</td>
      <td>Yes</td>
      <td></td>
      <td>Modulus. It is the modulus component of the RSA key.</td>
    </tr>
    <tr>
      <td>OIDC_JWKS_P</td>
      <td>Yes</td>
      <td></td>
      <td>First Prime Factor. It represents the first prime factor of the modulus.</td>
    </tr>
    <tr>
      <td>OIDC_JWKS_Q</td>
      <td>Yes</td>
      <td></td>
      <td>Second Prime Factor. It is the second prime factor of the modulus.</td>
    </tr>
    <tr>
      <td>OIDC_JWKS_QI</td>
      <td>Yes</td>
      <td></td>
      <td>First CRT Coefficient. It is the coefficient used for the CRT calculation.</td>
    </tr>
    <tr>
      <td>OIDC_JWKS_KID</td>
      <td>Yes</td>
      <td></td>
      <td>Key ID. It is an identifier for the key.</td>
    </tr>
    <tr>
      <td>OIDC_COOKIES</td>
      <td>Yes</td>
      <td></td>
      <td>For setting cookie key.</td>
    </tr>
  </tbody>
</table>

Detailed description for above keys here: https://openid.net/specs/openid-connect-core-1_0.html

### Migrations

The migrations required for this service are processed during the installation automatically if you set the `OIDC_MIGRATION` or `SOURCELOOP_MIGRATION` env variable. The migrations use [`db-migrate`](https://www.npmjs.com/package/db-migrate) with [`db-migrate-pg`](https://www.npmjs.com/package/db-migrate-pg) driver for migrations, so you will have to install these packages to use auto-migration. Please note that if you are using some pre-existing migrations or databasea, they may be affected. In such a scenario, it is advised that you copy the migration files in your project root, using the `OIDC_MIGRATION_COPY` or `SOURCELOOP_MIGRATION_COPY` env variables. You can customize or cherry-pick the migrations in the copied files according to your specific requirements and then apply them to the DB.

This migration script supports both MySQL and PostgreSQL databases, controlled by environment variables. By setting MYSQL_MIGRATION to 'true', the script runs migrations using MySQL configuration files; otherwise, it defaults to PostgreSQL. .

Additionally, there is now an option to choose between SQL migration or PostgreSQL migration.
NOTE : For @sourceloop/cli users, this choice can be specified during the scaffolding process by selecting the "type of datasource" option.

### API Documentation

#### Common Headers

Authorization: Bearer <token> where <token> is a JWT token signed using JWT issuer and secret.
`Content-Type: application/json` in the response and in request if the API method is NOT GET

#### Common Request path Parameters

{version}: Defines the API Version

### Common Responses

200: Successful Response. Response body varies w.r.t API
401: Unauthorized: The JWT token is missing or invalid
403: Forbidden : Not allowed to execute the concerned API
404: Entity Not Found
400: Bad Request (Error message varies w.r.t API)
201: No content: Empty Response

#### API Details

Visit the [OpenAPI spec docs](./openapi.md)
