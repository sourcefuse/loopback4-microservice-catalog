# @sourceloop/authentication-service

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

![npm](https://img.shields.io/npm/dm/@sourceloop/authentication-service)

![node-current (scoped)](https://img.shields.io/node/v/@sourceloop/authentication-service)

![npm (prod) dependency version (scoped)](https://img.shields.io/npm/dependency-version/@sourceloop/authentication-service/@loopback/core)

![check-code-coverage](https://img.shields.io/badge/code--coverage-75.01%25-yellow)

## Overview

A Loopback Microservice for handling authentications. It provides -

- Multi-Tenant support, you can see the database schema [here](#database-schema).
- External Identity Provider integration.
- Ability to issue [JWT](https://jwt.io/) tokens using [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken).
- Authenticate JWT tokens using [passport-http-bearer](http://www.passportjs.org/packages/passport-http-bearer/).
- Local Signup using a signup token.
- Forgot/Reset/Change password.
- Google OAuth using [passport-google-oauth](http://www.passportjs.org/docs/google/).
- Keycloak OAuth using [passport-keycloak-bearer](https://www.npmjs.com/package/passport-keycloak-bearer).
- Instagram OAuth using [passport-instagram](http://www.passportjs.org/packages/passport-instagram/).
- Facebook OAuth using [passport-facebook](http://www.passportjs.org/packages/passport-facebook/).
- Apple OAuth using [passport-apple](https://www.npmjs.com/package/passport-apple).
- OTP Auth using custom passport otp strategy.
- Two-Factor Authentication.

To get started with a basic implementation of this service, see `/sandbox/auth-basic-example`.

For a more elaborate and custom implementation that overrides the default models and repositories, see `/sandbox/auth-multitenant-example`.

### Working and Flow

This module uses the decorators provided by [loopback4-authentication](https://www.npmjs.com/package/loopback4-authentication) and [loopback4-authorization](https://www.npmjs.com/package/loopback4-authorization). For reference, below is the flow for the login code generation that uses the authenticate client, authenticate user and authorization decorators from these npm packages -

![Login Flow](https://user-images.githubusercontent.com/77672713/126627507-072a056c-de27-4764-9e5b-03d871da2438.png)

### Installation

```bash

npm i @sourceloop/authentication-service

```

### Usage

- Create a new Loopback4 Application (If you don't have one already)
  `lb4 testapp`
- Install the authentication service
  `npm i @sourceloop/authentication-service`
- Set the [environment variables](#environment-variables).
- Run the [migrations](#migrations).
- Add the `AuthenticationServiceComponent` to your Loopback4 Application (in `application.ts`).
  ```typescript
  // import the AuthenticationServiceComponent
  import {AuthenticationServiceComponent} from '@sourceloop/authentication-service';
  // add Component for AuthenticationService
  this.component(AuthenticationServiceComponent);
  ```
- Set up a [Loopback4 Datasource](https://loopback.io/doc/en/lb4/DataSource.html) with `dataSourceName` property set to
  `AuthDbSourceName`. You can see an example datasource [here](#setting-up-a-datasource).
- Set up a Loopback4 Datasource for caching tokens with `dataSourceName` property set to `AuthCacheSourceName`.
- Bind any of the custom [providers](#providers) you need.
- **OTP** -
  - Implement OtpSenderProvider(refer [this](./src/providers/otp-sender.provider.ts)) in your application and bind it to its respective key in application.ts
  ```typescript
  import {
    VerifyBindings,
    AuthServiceBindings,
  } from '@sourceloop/authentication-service';
  this.bind(VerifyBindings.OTP_SENDER_PROVIDER).toProvider(OtpSenderProvider);
  this.bind(AuthServiceBindings.MfaConfig).to({
    secondFactor: STRATEGY.OTP,
  });
  this.bind(AuthServiceBindings.OtpConfig).to({
    method: OtpMethodType.OTP,
  });
  ```
  - This provider is responsible for sending OTP to user.
  - By default OTP is valid for 5 minutes. To change it, set OTP_STEP and OTP_WINDOW (refer [otp-options](https://www.npmjs.com/package/otplib#totp-options)) as per your need in .env.
- **Google Authenticator** -
  - To use google Authenticator in your application, add following to application.ts
  ```typescript
  import {AuthServiceBindings} from '@sourceloop/authentication-service';
  this.bind(AuthServiceBindings.MfaConfig).to({
    secondFactor: STRATEGY.OTP,
  });
  this.bind(AuthServiceBindings.OtpConfig).to({
    method: OtpMethodType.GOOGLE_AUTHENTICATOR,
  });
  ```
- Set APP_NAME in .env.
- To authenticate using only OTP or Authenticator app, use the following APIs:
  - `/send-otp`
  - `/auth/check-qr-code`
  - `/auth/create-qr-code`
  - `/verify-otp`
- **Two-Factor-Authentication** -

  - As of now, 2nd Factor will always be either OTP or Google Authenticator.
  - Implement MfaProvider(refer [this](./src/providers/mfa.provider.ts)) in your application and bind it to its respective key in application.ts

  ```typescript
  import {VerifyBindings} from '@sourceloop/authentication-service';
  this.bind(VerifyBindings.MFA_PROVIDER).toProvider(MfaProvider);
  ```

  - It works for almost all authentication methods provided by this service.
  - Use `/verify-otp` to enter otp or code from authenticator app.

- Start the application
  `npm start`

### Environment Variables

| Name | Required | Default Value | Description |

| ----------------------------- | -------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |

| `NODE_ENV` | Y | | Node environment value, i.e. `dev`, `test`, `prod` |

| `LOG_LEVEL` | Y | | Log level value, i.e. `error`, `warn`, `info`, `verbose`, `debug` |

| `DB_HOST` | Y | | Hostname for the database server. |

| `DB_PORT` | Y | | Port for the database server. |

| `DB_USER` | Y | | User for the database. |

| `DB_PASSWORD` | Y | | Password for the database user. |

| `DB_DATABASE` | Y | | Database to connect to on the database server. |

| `DB_SCHEMA` | Y | | Database schema used for the data source. In PostgreSQL, this will be `public` unless a schema is made explicitly for the service. |

| `REDIS_HOST` | Y | | Hostname of the Redis server. |

| `REDIS_PORT` | Y | | Port to connect to the Redis server over. |

| `REDIS_URL` | Y | | Fully composed URL for Redis connection. Used instead of other settings if set. |

| `REDIS_PASSWORD` | Y | | Password for Redis if authentication is enabled. |

| `REDIS_DATABASE` | Y | | Database within Redis to connect to. |

| `JWT_SECRET` | Y | | Symmetric signing key of the JWT token. |

| `JWT_ISSUER` | Y | | Issuer of the JWT token. |

| `USER_TEMP_PASSWORD` | N | | Temporary password that can be used during development. |

| `GOOGLE_AUTH_URL` | N | | Google OAuth2.0 authorization URL if authentication strategy is set to Google |

| `GOOGLE_AUTH_CLIENT_ID` | N | | Google client ID for the service |

| `GOOGLE_AUTH_CLIENT_SECRET` | N | | Google client secret for the service |

| `GOOGLE_AUTH_TOKEN_URL` | N | | Google OAuth2.0 authorization URL if authentication strategy is set to Google |

| `GOOGLE_AUTH_CALLBACK_URL` | N | | Google callback URL for the client configuration in Google |

| `FORGOT_PASSWORD_LINK_EXPIRY` | N | 1800 | Expiration period of temporary password in seconds. 1800 seconds (30 minutes) is the default. |

| `KEYCLOAK_HOST` | N | | Hostname of the Keycloak instance |

| `KEYCLOAK_REALM` | N | | Realm (tenant) in Keycloak |

| `KEYCLOAK_CLIENT_ID` | N | | Keycloak client ID for the service |

| `KEYCLOAK_CLIENT_SECRET` | N | | Keycloak client secret for the service |

| `KEYCLOAK_CALLBACK_URL` | N | | Keycloak callback URL for the client configuration in Google |

| `HTTPS_PROXY` | N | | Https proxy url for keycloak auth |

### Setting up a `DataSource`

Here is a sample Implementation `DataSource` implementation using environment variables and PostgreSQL as the data source. The `auth-multitenant-example` utilizes both Redis and PostgreSQL as data sources.

```typescript
import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {AuthDbSourceName} from '@sourceloop/authentication-service';

const config = {
  name: AuthDbSourceName,
  connector: 'postgresql',
  url: '',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA,
};

@lifeCycleObserver('datasource')
export class AuthenticationDbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = AuthDbSourceName;
  static readonly defaultConfig = config;

  constructor(
    // You need to set datasource configuration name as 'datasources.config.Authentication' otherwise you might get Errors
    @inject('datasources.config.authentication', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
```

### Migrations

The migrations required for this service are processed during the installation automatically if you set the `AUTH_MIGRATION` or `SOURCELOOP_MIGRATION` env variable. The migrations use [`db-migrate`](https://www.npmjs.com/package/db-migrate) with [`db-migrate-pg`](https://www.npmjs.com/package/db-migrate-pg) driver for migrations, so you will have to install these packages to use auto-migration. Please note that if you are using some pre-existing migrations or databases, they may be affected. In such a scenario, it is advised that you copy the migration files in your project root, using the `AUTH_MIGRATION_COPY` or `SOURCELOOP_MIGRATION_COPY` env variables. You can customize or cherry-pick the migrations in the copied files according to your specific requirements and then apply them to the DB.

### Database Schema

![Auth DB Schema](https://user-images.githubusercontent.com/77672713/126612271-3ce065aa-9f87-45d4-bf9a-c5cc8ad21764.jpg)

### Providers

You can find documentation for some of the providers available in this service [here](./src/providers/README.md)

# **Using AZURE AD for OAuth**

Passport strategy for authenticating via Azure Ad using [passport-azure-ad](https://www.npmjs.com/package/passport-azure-ad).
Make sure you have an account on Azure and have your application registered. Follow the steps [here](https://docs.microsoft.com/en-us/azure/active-directory-b2c/configure-a-sample-node-web-app).

### Application Binding

To use this in your application bind `AuthenticationServiceComponent` the component in your appliation.

```ts
import {AuthenticationServiceComponent} from '@sourceloop/authentication-service';

this.component(AuthenticationServiceComponent);
```

### Set the environment variables

Refer the .env.example file to add all the relevant env variables for Azure Auth.
Note - For boolean values that need to passed as false keep them blank.

We are using cookie based approach instead of session based, so the library requires a cookie-parser middleware. To bind the middleware to you application set
AZURE_AUTH_ENABLED=true in env file so the middleware will be added to the sequence.

Also the verifier function uses Signup provider whose implementation needs to be added by the user.

Bind the provider key to its corresponding value.

```ts
this.providers[SignUpBindings.AZURE_AD_SIGN_UP_PROVIDER.key] =
  AzureAdSignupProvider;
```

```ts
export class AzureAdSignupProvider implements Provider<AzureAdSignUpFn> {
  value(): AzureAdSignUpFn {
    // sonarignore:start
    return async profile => {
      // sonarignore:end
      throw new HttpErrors.NotImplemented(
        `AzureAdSignupProvider not implemented`,
      );
    };
  }
}
```

Also bind `VerifyBindings.AZURE_AD_PRE_VERIFY_PROVIDER` and `VerifyBindings.AZURE_AD_POST_VERIFY_PROVIDER` to override the basic implementation provided by [default](https://github.com/sourcefuse/loopback4-microservice-catalog/tree/master/services/authentication-service/src/providers).

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
