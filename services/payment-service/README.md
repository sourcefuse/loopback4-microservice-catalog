# @sourceloop/payment-service

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

![npm](https://img.shields.io/npm/dm/@sourceloop/payment-service)

![node-current (scoped)](https://img.shields.io/node/v/@sourceloop/payment-service)

![npm (prod) dependency version (scoped)](https://img.shields.io/npm/dependency-version/@sourceloop/payment-service/@loopback/core)

## Overview

A Loopback Microservice primarily used for payment implementation to charge the payments for
any client application.

- Users can seamlessly integrate PayPal for payment transactions.
- The microservice supports Stripe as a preferred payment gateway option.
- Razorpay integration is also available for users seeking diverse payment methods.

## Installation

```bash
npm i @sourceloop/payment-service
```

## Usage

- Create a new Loopback4 Application (If you don't have one already)
  `lb4 testapp`
- Install the in mail service
  `npm i @sourceloop/payment-service`
- Set the [environment variables](#environment-variables).
- Run the [migrations](#migrations).
- Add the `PaymentServiceComponent` to your Loopback4 Application (in `application.ts`).
  ```typescript
  // import the PaymentServiceComponent
  import {PaymentServiceComponent} from '@sourceloop/payment-service';
  // add Component for PaymentServiceComponent
  this.component(PaymentServiceComponent);
  ```
- Set up a [Loopback4 Datasource](https://loopback.io/doc/en/lb4/DataSource.html) with `dataSourceName` property set to `PaymentDatasourceName`. You can see an example datasource [here](#setting-up-a-datasource).
- Bind any of the custom [providers](#providers) you need.
- **Using Paypal payment Gateway**
  Bind the PayPalHelper and PayPalConfig as shown below

  ```typescript
  //import Providers
  import {PayPalBindings, PaypalProvider} from 'payment-service/dist/providers';
  //Bind the providers
  this.bind(PayPalBindings.PayPalHelper.key).toProvider(PaypalProvider);
  this.bind(PayPalBindings.PayPalConfig).to({
    clientId: process.env.PAYPAL_CLIENT_ID ?? '',
    clientSecret: process.env.PAYPAL_CLIENT_SECRET ?? '',
  });
  ```

- **Using Stripe payment Gateway**
  Bind the StripeHelper and Config as shown below

  ```typescript
  //import Providers
  import {StripeBindings, StripeProvider} from 'payment-service/dist/providers';
  //Bind the providers
  this.bind(StripeBindings.Config).to({dataKey: '', publishKey: ''});
  this.bind(StripeBindings.StripeHelper).toProvider(StripeProvider);
  ```

- **Using RazorPay payment Gateway**
  Bind the RazorPayHelper and RazorPayConfig as shown below

  ```typescript
  //import Providers
  import {
    RazorpayBindings,
    RazorpayProvider,
  } from 'payment-service/dist/providers';
  //Bind the providers
  this.bind(RazorpayBindings.RazorpayConfig).to({dataKey: '', publishKey: ''});
  this.bind(RazorpayBindings.RazorpayHelper).toProvider(RazorpayProvider);
  ```

- **Using with Sequelize**

  This service supports Sequelize as the underlying ORM using [@loopback/sequelize](https://www.npmjs.com/package/@loopback/sequelize) extension. And in order to use it, you'll need to do following changes.

  - To use Sequelize in your application, add following to application.ts:

    ```ts
    this.bind(PaymentServiceBindings.Config).to({
      useCustomSequence: false,
      useSequelize: true,
    });
    ```

  - Use the `SequelizeDataSource` in your datasource as the parent class. Refer [this](https://www.npmjs.com/package/@loopback/sequelize#step-1-configure-datasource) for more.

- Start the application
  `npm start`

### Setting up a `DataSource`

Here is a sample Implementation `DataSource` implementation using environment variables and PostgreSQL as the data source.

```typescript
import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {PaymentDatasourceName} from '@sourceloop/payment-service';

const config = {
  name: PaymentDatasourceName,
  connector: 'postgresql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA,
};

@lifeCycleObserver('datasource')
export class InmailDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = PaymentDatasourceName;
  static readonly defaultConfig = config;

  constructor(
    @inject(`datasources.config.${PaymentDatasourceName}`, {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
```

### Migration

The migrations required for this service are processed during the installation automatically if you set the `PAYMENT_MIGRATION` or `SOURCELOOP_MIGRATION` env variable. The migrations use [`db-migrate`](https://www.npmjs.com/package/db-migrate) with [`db-migrate-pg`](https://www.npmjs.com/package/db-migrate-pg) driver for migrations, so you will have to install these packages to use auto-migration. Please note that if you are using some pre-existing migrations or databases, they may be affected. In such a scenario, it is advised that you copy the migration files in your project root, using the `PAYMENT_MIGRATION_COPY` or `SOURCELOOP_MIGRATION_COPY` env variables. You can customize or cherry-pick the migrations in the copied files according to your specific requirements and then apply them to the DB.

This migration script supports both MySQL and PostgreSQL databases, controlled by environment variables. By setting MYSQL_MIGRATION to 'true', the script runs migrations using MySQL configuration files; otherwise, it defaults to PostgreSQL. .

Additionally, there is now an option to choose between SQL migration or PostgreSQL migration.
NOTE : For @sourceloop/cli users, this choice can be specified during the scaffolding process by selecting the "type of datasource" option.

### Database Schema

![Database Schema](https://user-images.githubusercontent.com/98279679/186740482-496cd283-8073-4db5-b9d1-cd066d85d313.png)

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

### Setting Environment Variables

Do not forget to set Environment variables. The examples below show a common configuration for a PostgreSQL Database running locally.

```environment
NODE_ENV=dev
LOG_LEVEL=DEBUG
HOST=0.0.0.0
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=pg_service_user
DB_PASSWORD=pg_service_user_password
DB_DATABASE=payment_db
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

### Providers

You can find documentation for some of the providers available in this service [here](./src/providers/README.md)

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

### PayPal Payment Integration

Sign up for payPal account at https://www.paypal.com/signin
login to the developer section and create sandbox accounts
copy the credentials to the sandbox account and use them to develop payment-service

Order creation , capture and refund is supported right now.

#### API Details

##### POST /payment-gateways

Create a payment gateway.

##### POST /place-order-and-pay

Create an order and initiate transaction for the selected payment gateway, this will create order and initiate payment process.

##### POST /orders

Creating orders manually.

##### GET /transactions/orderid/{id}

Pass order id in {id} for manually created orders or retry the payment in case of failure.

##### POST /transactions/refund/{id}

Pass transactions ID in {id} to initiate a refund.

##### GET /orders

Get a list of all orders.

##### GET /transactions

Get a list of all transactions.

##### GET /transactions/{id}

Get details of a particular transaction.

##### GET /orders/{id}

Get details of a particular order.

##### POST /templates

Create a template to overwrite the existing default Gateway Templates if needed.
