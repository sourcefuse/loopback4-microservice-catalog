# @sourceloop/feature-toggle-service

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

![npm](https://img.shields.io/npm/dm/@sourceloop/feature-toggle-service)

![node-current (scoped)](https://img.shields.io/node/v/@sourceloop/feature-toggle-service)

![npm (prod) dependency version (scoped)](https://img.shields.io/npm/dependency-version/@sourceloop/feature-toggle-service/@loopback/core)

## Overview

Microservice that provides functionality to maintain feature flags at various levels. Initial support for system level, tenant level and user level is provided.

## Working and Flow

This service provides CRUD APIs to insert values into the feature-toggle specific data tables that can be read while making the decision if a particular feature is allowed or not to the user.
This feature is an extension of the feature-toggle package -- @sourceloop/feature-toggle that provides a method level decorator which will check if that particular API is accessible or not.

Initial implementation for system level, tenant level and user level feature flag is provided.

## Installation

npm i @sourceloop/feature-toggle-service

## Usage

### Service Setup

- Create a new Loopback4 Application (If you don't have one already) lb4 testapp
- Install the service - npm i @sourceloop/feature-toggle-service
- Set up the [environment variables](#environment-variables)
- Run the [migrations](#migrations). (this will create respective tables in your Database)
- Add the `FeatureToggleServiceComponent` to your Loopback4 Application (in `application.ts`).
  ```typescript
  // import the FeatureToggleServiceComponent
  import {FeatureToggleServiceComponent} from '@sourceloop/feature-toggle-service';
  // add controllers to your application (optional)
  this.bind(FeatureToggleBindings.Config).to({
    bindControllers: true,
    useCustomSequence: false,
  });
  // add Component for FeatureToggleService
  this.component(FeatureToggleServiceComponent);
  ```
- Set up a [Loopback4 Datasource](https://loopback.io/doc/en/lb4/DataSource.html) with `dataSourceName` property set to
  `FeatureToggleDbName`. You can see an example datasource [here](#setting-up-a-datasource).
- Start the application
  `npm start`

### Environment Variables

| Name          | Required | Default Value | Description                                                                                                                        |
| ------------- | -------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `NODE_ENV`    | Y        |               | Node environment value, i.e. `dev`, `test`, `prod`                                                                                 |
| `LOG_LEVEL`   | Y        |               | Log level value, i.e. `error`, `warn`, `info`, `verbose`, `debug`                                                                  |
| `DB_HOST`     | Y        |               | Hostname for the database server.                                                                                                  |
| `DB_PORT`     | Y        |               | Port for the database server.                                                                                                      |
| `DB_USER`     | Y        |               | User for the database.                                                                                                             |
| `DB_PASSWORD` | Y        |               | Password for the database user.                                                                                                    |
| `DB_DATABASE` | Y        |               | Database to connect to on the database server.                                                                                     |
| `DB_SCHEMA`   | Y        |               | Database schema used for the data source. In PostgreSQL, this will be `public` unless a schema is made explicitly for the service. |
| `JWT_SECRET`  | Y        |               | Symmetric signing key of the JWT token.                                                                                            |
| `JWT_ISSUER`  | Y        |               | Issuer of the JWT token.                                                                                                           |

### Setting up a `DataSource`

Here is a sample Implementation `DataSource` implementation using environment variables and PostgreSQL as the data source.

```typescript
import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {FeatureToggleDbName} from '@sourceloop/feature-toggle-service';

const config = {
  name: FeatureToggleDbName,
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
export class FeatureToggleDbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = FeatureToggleDbName;
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.feature', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
```

### Migrations

The migrations required for this service are processed during the installation automatically if you set the `FEATURETOGGLE_MIGRATION` or `SOURCELOOP_MIGRATION` env variable. The migrations use [`db-migrate`](https://www.npmjs.com/package/db-migrate) with [`db-migrate-pg`](https://www.npmjs.com/package/db-migrate-pg) driver for migrations, so you will have to install these packages to use auto-migration. Please note that if you are using some pre-existing migrations or database, they may be effected. In such scenario, it is advised that you copy the migration files in your project root, using the `FEATURETOGGLE_MIGRATION_COPY` or `SOURCELOOP_MIGRATION_COPY` env variables. You can customize or cherry-pick the migrations in the copied files according to your specific requirements and then apply them to the DB.

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
