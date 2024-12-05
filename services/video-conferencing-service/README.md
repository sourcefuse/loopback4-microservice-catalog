# @sourceloop/video-conferencing-service

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

![npm](https://img.shields.io/npm/dm/@sourceloop/video-conferencing-service)

![node-current (scoped)](https://img.shields.io/node/v/@sourceloop/video-conferencing-service)

![npm (prod) dependency version (scoped)](https://img.shields.io/npm/dependency-version/@sourceloop/video-conferencing-service/@loopback/core)

## Overview

Various features of Video Conferencing Services:

1. Schedule Meetings and Generate a Token
   Book on demand meetings or schedule meetings and generate token which is required for connection to a session/room on the client side.

2. List Archives
   Get a specific archive or list a set of archives for the recorded meetings.

3. Configure storage target
   Set Storage settings to store archives to custom s3 bucket or Microsoft Azure Storage.

4. Webhook Events
   Webhook Events (such as session or webhook) when configured receive events from a third party. These events are used to store session attendees or store archive information.
   For Vonage, you need to add this microservice server url in your current vonage project
   so it will receive webhook events. See [Vonage Documentation](https://developer.nexmo.com/documentation) for more information.

You can see the database schema [here](#database-schema).

To get started with a basic implementation of this service, see [/sandbox/video-conferencing-ms-example](https://github.com/sourcefuse/loopback4-microservice-catalog/tree/master/sandbox/video-conferencing-ms-example).

## Install

```sh
npm i @sourceloop/video-conferencing-service
```

## Working and Flow

![video](https://user-images.githubusercontent.com/82804130/126984338-754c0788-270a-40df-b601-ff66dcd3d5f8.jpg)

## Usage

- Create a new Loopback4 Application (If you don't have one already)
  `lb4 testapp`
- Install the video conferencing service
  `npm i @sourceloop/video-conferencing-service`
- Set the [environment variables](#environment-variables).
- Run the [migrations](#migrations).
- Bind Vonage config to the `VonageBindings.Config` key -

  ```typescript
  this.bind(VonageBindings.Config).to({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET,
    timeToStart: 0, // time in minutes, meeting can not be started 'timeToStart' minutes before the scheduled time
  });
  ```

- For Twilio bind twilio config to the `TwilioBindings.config` key-

  ```typescript
  this.bind(TwilioBindings.config).to({
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    apiSid: process.env.TWILIO_API_KEY,
    apiSecret: process.env.TWILIO_API_SECRET,
  });
  ```

- Add the `VideoConfServiceComponent` to your Loopback4 Application (in `application.ts`)

  ```typescript
  // import the component for VideoConfService
  import { VideoConfServiceComponent } from '@sourceloop/video-conferencing-service';
  ...
  // add VideoConfServiceComponent inside the application class
  this.component(VideoConfServiceComponent);
  ...
  ```

- Set up a [Loopback4 Datasource](https://loopback.io/doc/en/lb4/DataSource.html) with `dataSourceName` property set to `VideoConfDatasource`. You can see an example datasource [here](#setting-up-a-datasource).
- **Using with Sequelize**

  This service supports Sequelize as the underlying ORM using [@loopback/sequelize](https://www.npmjs.com/package/@loopback/sequelize) extension. And in order to use it, you'll need to do following changes.

  - To use Sequelize in your application, add following to application.ts:

    ```ts
    this.bind(VideoChatBindings.Config).to({
      useCustomSequence: false,
      useSequelize: true,
    });
    ```

  - Use the `SequelizeDataSource` in your audit datasource as the parent class. Refer [this](https://www.npmjs.com/package/@loopback/sequelize#step-1-configure-datasource) for more details.

- **Configurable Audit Logs**

  To generate audit logs for video conferencing service, you'll have to set the env var `ADD_AUDIT_LOG_MIXIN` to `true` and configure a datasource for it like below:

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

  import {
    ApplicationConfig,
    VideoConferencingExampleApplication,
  } from './application';
  export * from './application';
  //...
  ```

- Start the application
  `npm start`

### Asymmetric Token Signing and Verification

If you are using asymmetric token signing and verification, you need to create a datasource for auth database. Example datasource file for auth:-

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

### Environment Variables

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
DB_DATABASE=video_conferencing_db
DB_SCHEMA=public
JWT_SECRET=super_secret_string
JWT_ISSUER=https://authentication.service
```

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
      <td><code>NODE_ENV</code></td>
      <td>Y</td>
      <td></td>
      <td>Node environment value, i.e. <code>dev</code>, <code>test</code>, <code>prod</code></td>
    </tr>
    <tr>
      <td><code>LOG_LEVEL</code></td>
      <td>Y</td>
      <td></td>
      <td>Log level value, i.e. <code>error</code>, <code>warn</code>, <code>info</code>, <code>verbose</code>, <code>debug</code></td>
    </tr>
    <tr>
      <td><code>HOST</code></td>
      <td>Y</td>
      <td></td>
      <td>Host for the service to run under, i.e. <code>0.0.0.0</code></td>
    </tr>
    <tr>
      <td><code>PORT</code></td>
      <td>Y</td>
      <td><code>3000</code></td>
      <td>Port for the service to listen on.</td>
    </tr>
    <tr>
      <td><code>DB_HOST</code></td>
      <td>Y</td>
      <td></td>
      <td>Hostname for the database server.</td>
    </tr>
    <tr>
      <td><code>DB_PORT</code></td>
      <td>Y</td>
      <td></td>
      <td>Port for the database server.</td>
    </tr>
    <tr>
      <td><code>DB_USER</code></td>
      <td>Y</td>
      <td></td>
      <td>User for the database.</td>
    </tr>
    <tr>
      <td><code>DB_PASSWORD</code></td>
      <td>Y</td>
      <td></td>
      <td>Password for the database user.</td>
    </tr>
    <tr>
      <td><code>DB_DATABASE</code></td>
      <td>Y</td>
      <td></td>
      <td>Database to connect to on the database server.</td>
    </tr>
    <tr>
      <td><code>DB_SCHEMA</code></td>
      <td>Y</td>
      <td><code>public</code></td>
      <td>Database schema used for the data source. In PostgreSQL, this will be <code>public</code> unless a schema is made explicitly for the service.</td>
    </tr>
    <tr>
      <td><code>JWT_SECRET</code></td>
      <td>Y</td>
      <td></td>
      <td>Symmetric signing key of the JWT token.</td>
    </tr>
    <tr>
      <td><code>JWT_ISSUER</code></td>
      <td>Y</td>
      <td></td>
      <td>Issuer of the JWT token.</td>
    </tr>
    <tr>
      <td><code>ADD_AUDIT_LOG_MIXIN</code></td>
      <td>N</td>
      <td><code>false</code></td>
      <td>Whether to store audit logs for the entities provided by this service. Setting this to true requires the following AUDIT_* env vars to also be set.</td>
    </tr>
    <tr>
      <td><code>AUDIT_DB_HOST</code></td>
      <td>N</td>
      <td></td>
      <td>Hostname of the audit database server</td>
    </tr>
    <tr>
      <td><code>AUDIT_DB_PORT</code></td>
      <td>N</td>
      <td></td>
      <td>Audit Database Server Port</td>
    </tr>
     <tr>
      <td><code>AUDIT_DB_USER</code></td>
      <td>N</td>
      <td></td>
      <td>Username of the audit database server</td>
    </tr>
    <tr>
      <td><code>AUDIT_DB_PASSWORD</code></td>
      <td>N</td>
      <td></td>
      <td>Password of the audit database user</td>
    </tr>
    <tr>
      <td><code>AUDIT_DB_DATABASE</code></td>
      <td>N</td>
      <td></td>
      <td>Audit database name</td>
    </tr>
    <tr>
      <td><code>AUDIT_DB_SCHEMA</code></td>
      <td>N</td>
      <td></td>
      <td>Database schema used for the data source. In PostgreSQL, this will be public unless a schema is made explicitly for the service.</td>
    </tr>
  </tbody>
</table>

### Setting up a `DataSource`

Here is a sample Implementation `DataSource` implementation using environment variables and PostgreSQL as the data source.

```typescript
import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {VideoConfDatasource} from '@sourceloop/video-conferencing-service';

const config = {
  name: VideoConfDatasource,
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
export class VideoDbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = VideoConfDatasource;
  static readonly defaultConfig = config;

  constructor(
    @inject(`datasources.config.${VideoConfDatasource}`, {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
```

## Database Schema

![canva-photo-editor](https://user-images.githubusercontent.com/82804130/126635878-4e39ce2c-e48d-4a67-9c81-6a5f8ee9b70e.png)

## Migrations

The migrations required for this service are processed during the installation automatically if you set the `VIDEOCONF_MIGRATION` or `SOURCELOOP_MIGRATION` env variable. The migrations use [`db-migrate`](https://www.npmjs.com/package/db-migrate) with [`db-migrate-pg`](https://www.npmjs.com/package/db-migrate-pg) driver for migrations, so you will have to install these packages to use auto-migration. Please note that if you are using some pre-existing migrations or databases, they may be affected. In such a scenario, it is advised that you copy the migration files in your project root, using the `VIDEOCONF_MIGRATION_COPY` or `SOURCELOOP_MIGRATION_COPY` env variables. You can customize or cherry-pick the migrations in the copied files according to your specific requirements and then apply them to the DB.

This migration script supports both MySQL and PostgreSQL databases, controlled by environment variables. By setting MYSQL_MIGRATION to 'true', the script runs migrations using MySQL configuration files; otherwise, it defaults to PostgreSQL. .

Additionally, there is now an option to choose between SQL migration or PostgreSQL migration.
NOTE : For @sourceloop/cli users, this choice can be specified during the scaffolding process by selecting the "type of datasource" option.

## API's Details

Visit the [OpenAPI spec docs](./openapi.md)

## Feedback

If you've noticed a bug or have a question or have a feature request, [search the issue tracker](https://github.com/sourcefuse/loopback4-microservice-catalog/issues) to see if someone else in the community has already created a ticket.
If not, go ahead and [make one](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/new/choose)!
All feature requests are welcome. Implementation time may vary. Feel free to contribute the same, if you can.
If you think this extension is useful, please [star](https://help.github.com/en/articles/about-stars) it. Appreciation really helps in keeping this project alive.
