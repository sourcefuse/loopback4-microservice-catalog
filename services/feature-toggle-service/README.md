# @sourceloop/feature-toggle-service

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

![npm](https://img.shields.io/npm/dm/@sourceloop/feature-toggle-service)

![node-current (scoped)](https://img.shields.io/node/v/@sourceloop/feature-toggle-service)

![npm (prod) dependency version (scoped)](https://img.shields.io/npm/dependency-version/@sourceloop/feature-toggle-service/@loopback/core)

![npm dev dependency version (scoped)](https://img.shields.io/npm/dependency-version/@sourceloop/feature-toggle-service/dev/@loopback/cli)

## Overview

Microservice that provides functionality to maintain feature flags at various levels. Initial support for system level, tenant level and user level is provided.
We are using [UNEASH](https://docs.getunleash.io/) to achieve the toggle functionality here.

## Working and Flow

This service provides method level decorators - @featuresFlag that takes an array of provider keys as metadata and verifies if the feature flags are enabled or disabled, it uses an AND operator to check for multiple features. Read more about creating loopback-4 [decorators](https://loopback.io/doc/en/lb4/Creating-decorators.html). To check if a feature is enabled or not add the following decorator over a controller method @featuresFlag({features: [StrategyBindings.TENANT_FEATURE]}) and if you want to skip all the feature checks - @featuresFlag({features: ['*']}) will allow, irrespective even if any feature is disabled. Initial implementation for system level, tenant level and user level feature flag is provided, if you want to add any custom feature flag all you need to do is

```typescript
// A provider that implements FeatureInterface
export class SystemFeatureProvider implements Provider<FeatureInterface> {
  constructor(
    @inject(UNLEASH_CONST)
    private readonly unleashConst: Unleash,
  ) {}
  value(): FeatureInterface {
    return () => {
      return this.unleashConst.isEnabled('system-feature');
    };
  }
}
// Define a key of the type FeatureInterface
export const SYSTEM_FEATURE =
  BindingKey.create<FeatureInterface>('sf.system.feature');

// bind the Provider to the key
this.bind(SYSTEM_FEATURE).toProvider(SystemFeatureProvider);

// pass the key to the decorator
@featuresFlag({features: [StrategyBindings.TENANT_FEATURE,StrategyBindings.SYSTEM_FEATURE]})
```

## Installation

npm i @sourceloop/feature-toggle-service

## Usage

### Unleash Admin UI Setup

Follow the steps to setup unleash [locally](https://docs.getunleash.io/deploy/getting_started) ,make sure all the pre requisits as done. Provide correct database config values. Once the admin console is up generate the [API Token](https://docs.getunleash.io/user_guide/api-token). Token is used to initialise unleash in your application.

### Service Setup

- Create a new Loopback4 Application (If you don't have one already) lb4 testapp
- Install the service - npm i @sourceloop/feature-toggle-service
- Set up the [environment variables](#environment-variables)
- Run the [migrations](#migrations). (this will create the features at system, tenant and user level and their strategies)
- Add the `FeatureToggleServiceComponent` to your Loopback4 Application (in `application.ts`).
  ```typescript
  // import the FeatureToggleServiceComponent
  import {FeatureToggleServiceComponent} from '@sourceloop/feature-toggle-service';
  // add Component for FeatureToggleService
  this.component(FeatureToggleServiceComponent);
  ```
- Set up a [Loopback4 Datasource](https://loopback.io/doc/en/lb4/DataSource.html) with `dataSourceName` property set to
  `FeatureToggleDbName`. You can see an example datasource [here](#setting-up-a-datasource).
- Bind any of the custom providers you need.
- Create new custom [strategies](#strategies) as an when required.
- Initialize unleash and the strategies within your Loopback4 Application and bind it to the unleash constant key `UNLEASH_CONST` (in `application.ts`).
  ```typescript
  const unleash = require('unleash-client');
  unleash.initialize({
    url: 'app-url',
    appName: 'my-node-name',
    environment: process.env.APP_ENV,
    customHeaders: {Authorization: 'key'},
    strategies: [new TenantStrategy(), new UserStrategy()],
  });
  this.bind(UNLEASH_CONST).to(unleash);
  ```
- Start the application
  `npm start`

### Environment Variables

Connect to the unleash database setup above.

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
import {FeatureToggleDbName} from '@sourceloop/authentication-service';

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

The migrations use [`db-migrate`](https://www.npmjs.com/package/db-migrate) with [`db-migrate-pg`](https://www.npmjs.com/package/db-migrate-pg) driver for migrations, so you will have to install these packages to use auto-migration. Please note that if you are using some pre-existing migrations or database, they may be effected. In such scenario, it is advised that you copy the migration files in your project root, using the `SOURCELOOP_MIGRATION_COPY` env variables. You can customize or cherry-pick the migrations in the copied files according to your specific requirements and then apply them to the DB.

### Strategies

The open source unleash allows us to create our custom strategies that the features can have, giving us a free hand in implementaion. Read more about [strategies](). Extend to the base Strategy class override the isEnabled() method and also whenever a new strategy is added it needs to be mentioned while we initialize unleash in our application. We have created our custom strategies like Tenant and User.

```typescript
unleash.initialize({
  strategies: [new TenantStrategy(), new UserStrategy()],
});
```

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

## API's Details

Visit the [OpenAPI spec docs](./openapi.md)
