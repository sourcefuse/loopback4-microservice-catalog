# @sourceloop/payment-service

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

![npm](https://img.shields.io/npm/dm/@sourceloop/payment-service)

![node-current (scoped)](https://img.shields.io/node/v/@sourceloop/payment-service)

![npm (prod) dependency version (scoped)](https://img.shields.io/npm/dependency-version/@sourceloop/payment-service/@loopback/core)

![npm dev dependency version (scoped)](https://img.shields.io/npm/dependency-version/@sourceloop/payment-service/dev/@loopback/cli)

A Loopback Microservice primarily used for payment implementation to charge the payments for
any client application.

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
  **Binding the Providers**

```typescript
//import Providers
import {
  GatewayBindings,
  GatewayProvider,
  RazorpayBindings,
  RazorpayProvider,
  StripeBindings,
  StripeProvider,
} from 'payment-service/dist/providers';
//Bind the providers
this.bind(StripeBindings.Config).to({dataKey: '', publishKey: ''});
this.bind(StripeBindings.StripeHelper).toProvider(StripeProvider);
this.bind(RazorpayBindings.RazorpayConfig).to({dataKey: '', publishKey: ''});
this.bind(RazorpayBindings.RazorpayHelper).toProvider(RazorpayProvider);
this.bind(GatewayBindings.GatewayHelper).toProvider(GatewayProvider);
```

- Set up a [Loopback4 Datasource](https://loopback.io/doc/en/lb4/DataSource.html) with `dataSourceName` property set to `PaymentDatasourceName`. You can see an example datasource [here](#setting-up-a-datasource).
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

The migrations required for this service are processed during the installation automatically if you set the `PAYMENT_MIGRATION` or `SOURCELOOP_MIGRATION` env variable. The migrations use [`db-migrate`](https://www.npmjs.com/package/db-migrate) with [`db-migrate-pg`](https://www.npmjs.com/package/db-migrate-pg) driver for migrations, so you will have to install these packages to use auto-migration. Please note that if you are using some pre-existing migrations or database, they may be effected. In such scenario, it is advised that you copy the migration files in your project root, using the `PAYMENT_MIGRATION_COPY` or `SOURCELOOP_MIGRATION_COPY` env variables. You can customize or cherry-pick the migrations in the copied files according to your specific requirements and then apply them to the DB.

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

Get list of all orders.

##### GET /transactions

Get list of all transactions.

##### GET /transactions/{id}

Get details of particular transaction.

##### GET /orders/{id}

Get details of particular order.

##### POST /templates

Create a template to overwrite the existing default Gateway Templates if needed.
