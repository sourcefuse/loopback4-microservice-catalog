# @sourceloop/user-tenant-service

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

![npm](https://img.shields.io/npm/dm/@sourceloop/payment-service)

![node-current (scoped)](https://img.shields.io/node/v/@sourceloop/payment-service)

![npm (prod) dependency version (scoped)](https://img.shields.io/npm/dependency-version/@sourceloop/payment-service/@loopback/core)

A Loopback Microservice primarily used for payment implementation to charge the payments for
any client application.

## Prerequiste

Authenication service as it uses the same database tables and no new migration is needed for this service.

## Installation

```bash
npm i @sourceloop/user-tenant-service
```

## Usage

- Create a new Loopback4 Application (If you don't have one already)
  `lb4 testapp`
- Install the in mail service
  `npm i @sourceloop/user-tenant-service`
- Set the [environment variables](#environment-variables).
- Add the `UserTenantServiceComponent` to your Loopback4 Application (in `application.ts`).

  ```typescript
  // import the UserTenantServiceComponent
  import {UserTenantServiceComponent} from '@sourceloop/payment-service';
  // add Component for UserTenantServiceComponent
  this.component(UserTenantServiceComponent);
  ```

- Start the application
  `npm start`

### Setting Environment Variables

Do not forget to set Environment variables in .env. The examples below show a common configuration for a PostgreSQL Database running locally.

```environment
NODE_ENV=dev
LOG_LEVEL=DEBUG
HOST=0.0.0.0
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=pg_service_user
DB_PASSWORD=pg_service_user_password
DB_DATABASE=AuthDB
DB_SCHEMA=public
JWT_SECRET=super_secret_string
JWT_ISSUER=https://authentication.service
```

| Name          | Required | Default Value | Description                                                                                                                        |
| ------------- | -------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `NODE_ENV`    | Y        |               | Node environment value, i.e. `dev`, `test`, `prod`                                                                                 |
| `LOG_LEVEL`   | Y        |               | Log level value, i.e. `error`, `warn`, `info`, `verbose`, `debug`                                                                  |
| `HOST`        | Y        |               | Host for the service to run under, i.e. `0.0.0.0`                                                                                  |
| `PORT`        | Y        | `3000`        | Port for the service to listen on.                                                                                                 |
| `DB_HOST`     | Y        |               | Hostname for the database server.                                                                                                  |
| `DB_PORT`     | Y        |               | Port for the database server.                                                                                                      |
| `DB_USER`     | Y        |               | User for the database.                                                                                                             |
| `DB_PASSWORD` | Y        |               | Password for the database user.                                                                                                    |
| `DB_DATABASE` | Y        |               | Database to connect to on the database server.                                                                                     |
| `DB_SCHEMA`   | Y        | `public`      | Database schema used for the data source. In PostgreSQL, this will be `public` unless a schema is made explicitly for the service. |
| `JWT_SECRET`  | Y        |               | Symmetric signing key of the JWT token.                                                                                            |
| `JWT_ISSUER`  | Y        |               | Issuer of the JWT token.                                                                                                           |

## Audit Logs

To generate audit logs for user tenant service, you'll have to set the env var `ADD_AUDIT_LOG_MIXIN` to `true` and configure a datasource for it like below:

```ts
import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {AuditDbSourceName} from '@sourceloop/audit-log';

const config = {
  name: 'audit',
  connector: 'postgresql',
  url: '',
  host: '',
  port: 0,
  user: '',
  password: '',
  database: '',
};

@lifeCycleObserver('datasource')
export class AuditDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = AuditDbSourceName;
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.audit', {optional: true})
    dsConfig: object = config,
  ) {
    const auditEnvConfig = {
      host: process.env.AUDIT_DB_HOST,
      port: process.env.AUDIT_DB_PORT,
      user: process.env.AUDIT_DB_USER,
      password: process.env.AUDIT_DB_PASSWORD,
      database: process.env.AUDIT_DB_DATABASE,
      schema: process.env.AUDIT_DB_SCHEMA,
    };
    Object.assign(dsConfig, auditEnvConfig);
    super(dsConfig);
  }
}
```

Configure .env of application in index.ts before exporting application like follows

```ts
import * as dotenv from 'dotenv';
dotenv.config();

import {ApplicationConfig, UserTenantExampleApplication} from './application';
export * from './application';
//...
```

### API Documentation

Visit the [OpenAPI spec docs](./openapi.md)

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
