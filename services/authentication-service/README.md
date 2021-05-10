# authentication-service

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

## Overview

A Loopback Microservice for handling authentications. Provides multi tenant support, external Identity Provider integration, and the ability the issue tokens.

To get started with a basic implementation of this service, see `/sandbox/auth-basic-example`.

For a more elaborate and custom implementation that overrides the default models and repositories, see `/sandbox/auth-multitenant-example`.

### Installation

```bash
npm i @sourceloop/authentication-service
```

## Implementation

Create a new Application using Loopback CLI and add the Component for `AuthenticationService` in `application.ts`

```typescript
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import {AuthenticationServiceComponent} from '@sourceloop/in-mail-service';
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';
import path from 'path';

export {ApplicationConfig};

const port = 3000;
export class Client extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    dotenv.config();
    dotenvExt.load({
      schema: '.env.example',
      errorOnMissing: true,
      includeProcessEnv: true,
    });
    options.rest = options.rest || {};
    options.rest.port = +(process.env.PORT || port);
    options.rest.host = process.env.HOST;
    super(options);
    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    // add Component for AuthenticationService
    this.component(AuthenticationServiceComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
```

### Environment Variables

| Name                          | Required | Default Value | Description                                                                                                                        |
| ----------------------------- | -------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `NODE_ENV`                    | Y        |               | Node environment value, i.e. `dev`, `test`, `prod`                                                                                 |
| `LOG_LEVEL`                   | Y        |               | Log level value, i.e. `error`, `warn`, `info`, `verbose`, `debug`                                                                  |
| `DB_HOST`                     | Y        |               | Hostname for the database server.                                                                                                  |
| `DB_PORT`                     | Y        |               | Port for the database server.                                                                                                      |
| `DB_USER`                     | Y        |               | User for the database.                                                                                                             |
| `DB_PASSWORD`                 | Y        |               | Password for the database user.                                                                                                    |
| `DB_DATABASE`                 | Y        |               | Database to connect to on the database server.                                                                                     |
| `DB_SCHEMA`                   | Y        |               | Database schema used for the data source. In PostgreSQL, this will be `public` unless a schema is made explicitly for the service. |
| `REDIS_HOST`                  | Y        |               | Hostname of the Redis server.                                                                                                      |
| `REDIS_PORT`                  | Y        |               | Port to connect to the Redis server over.                                                                                          |
| `REDIS_URL`                   | Y        |               | Fully composed URL for Redis connection. Used instead of other settings if set.                                                    |
| `REDIS_PASSWORD`              | Y        |               | Password for Redis if authentication is enabled.                                                                                   |
| `REDIS_DATABASE`              | Y        |               | Database within Redis to connect to.                                                                                               |
| `JWT_SECRET`                  | Y        |               | Symmetric signing key of the JWT token.                                                                                            |
| `JWT_ISSUER`                  | Y        |               | Issuer of the JWT token.                                                                                                           |
| `USER_TEMP_PASSWORD`          | N        |               | Temporary password that can be used during development.                                                                            |
| `GOOGLE_AUTH_URL`             | N        |               | Google OAuth2.0 authorization URL if authentication strategy is set to Google                                                      |
| `GOOGLE_AUTH_CLIENT_ID`       | N        |               | Google client ID for the service                                                                                                   |
| `GOOGLE_AUTH_CLIENT_SECRET`   | N        |               | Google client secret for the service                                                                                               |
| `GOOGLE_AUTH_TOKEN_URL`       | N        |               | Google OAuth2.0 authorization URL if authentication strategy is set to Google                                                      |
| `GOOGLE_AUTH_CALLBACK_URL`    | N        |               | Google callback URL for the client configuration in Google                                                                         |
| `FORGOT_PASSWORD_LINK_EXPIRY` | N        | 1800          | Expiration period of temporary password in seconds. 1800 seconds (30 minutes) is the default.                                      |
| `KEYCLOAK_HOST`               | N        |               | Hostname of the Keycloak instance                                                                                                  |
| `KEYCLOAK_REALM`              | N        |               | Realm (tenant) in Keycloak                                                                                                         |
| `KEYCLOAK_CLIENT_ID`          | N        |               | Keycloak client ID for the service                                                                                                 |
| `KEYCLOAK_CLIENT_SECRET`      | N        |               | Keycloak client secret for the service                                                                                             |
| `KEYCLOAK_CALLBACK_URL`       | N        |               | Keycloak callback URL for the client configuration in Google                                                                       |
| `HTTPS_PROXY`                 | N        |               | Https proxy url for keycloak auth                                                                                                  |

### Setting up a `DataSource`

Here is a sample Implementation `DataSource` implementation using environment variables and PostgreSQL as the data source. The `auth-multitenant-example` utilizes both Redis and PostgreSQL as data sources.

```typescript
import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'authenticationDb',
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
  implements LifeCycleObserver {
  static dataSourceName = 'authentication';
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

The migrations required for this service are processed during the installation automatically if you set the `AUTH_MIGRATION` or `SOURCELOOP_MIGRATION` env variable. The migrations use [`db-migrate`](https://www.npmjs.com/package/db-migrate) with [`db-migrate-pg`](https://www.npmjs.com/package/db-migrate-pg) driver for migrations, so you will have to install these packages to use auto-migration. Please note that if you are using some pre-existing migrations or database, they may be effected. In such scenario, it is advised that you copy the migration files in your project root, using the `AUTH_MIGRATION_COPY` or `SOURCELOOP_MIGRATION_COPY` env variables. You can customize or cherry-pick the migrations in the copied files according to your specific requirements and then apply them to the DB.

### API Documentation

### Providers

You can find documentation for some of the providers available in this service [here](./src/providers/README.md)

#### Common Headers

Authorization: Bearer <token> where <token> is a JWT token signed using JWT issuer and secret.
`Content-Type: application/json` in the response and in request if the API method is NOT GET

#### Common Request path Parameters

{version}: Defines the API Version

### Common Responses

200: Successful Response. Response body varies w.r.t API<br/>
401: Unauthorized: The JWT token is missing or invalid<br/>
403: Forbidden : Not allowed to execute the concerned API<br />
404: Entity Not Found<br />
400: Bad Request (Error message varies w.r.t API)<br />
201: No content: Empty Response<br />

#### API Details

Visit the [OpenAPI spec docs](OPEN_API_SPEC.md)
