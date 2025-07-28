<a style="position: relative; top: 10px;" href="https://sourcefuse.github.io/arc-docs/arc-api-docs" target="_blank"><img src="https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/docs/assets/logo-dark-bg.png?raw=true" alt="ARC By SourceFuse logo" title="ARC By SourceFuse" align="right" width="150" /></a>

# [@sourceloop/audit-service](https://github.com/sourcefuse/loopback4-microservice-catalog/tree/master/services/audit-service)

<p align="left">
<a href="https://www.npmjs.org/package/@sourceloop/audit-service">
<img src="https://img.shields.io/npm/v/@sourceloop/audit-service.svg" alt="npm version" />
</a>
<a href="https://github.com/sourcefuse/loopback4-microservice-catalog/graphs/contributors" target="_blank">
<img alt="GitHub contributors" src="https://img.shields.io/github/contributors/sourcefuse/loopback4-microservice-catalog">
</a>
<a href="https://www.npmjs.com/@sourceloop/audit-service" target="_blank">
<img alt="sourceloop audit-service downloads" src="https://img.shields.io/npm/dm/@sourceloop/audit-service">
</a>
<a href="./LICENSE">
<img src="https://img.shields.io/github/license/sourcefuse/loopback4-microservice-catalog" alt="License" />
</a>
<a href="https://loopback.io/" target="_blank">
<img alt="Pb Loopback" src="https://img.shields.io/badge/Powered%20by-Loopback 4-brightgreen" />
</a>
</p>

## Overview

The `@sourceloop/audit-service` is a powerful microservice specifically designed for managing audit logs. It offers extensive functionality to track and record user actions such as inserts, updates, and deletes. Built on the foundation of [@sourceloop/audit-log](https://www.npmjs.com/package/@sourceloop/audit-log), this service provides a repository mixin for easy integration.

While the repository mixin logs all actions by default, the audit-service takes customization to the next level. It allows you to selectively audit specific scenarios or cases, giving you complete control over the auditing process. With the service's exposed APIs, you can effortlessly insert and retrieve audited data, enabling you to tailor your auditing approach to your unique needs.

Additionally, the audit-service goes beyond basic functionality by offering an archiving feature. This feature allows you to seamlessly archive logs to an AWS S3 bucket based on specific filters. You can even retrieve logs from both the S3 bucket and the audit database simultaneously, providing a comprehensive view of your audit history.

## Installation

```bash
npm i @sourceloop/audit-service

```

## Getting Started

You can start using `@sourceloop/audit-service` in just 4 steps:

1. [Bind Component](#bind-component)
2. [Set the environment variables](#set-the-environment-variables)
3. [Configure DataSource](#configure-datasource)
4. [Run the Migrations](#migrations)

### Bind Component

Bind the `AuditServiceComponent` to your application constructor as shown below, this will load all controllers, repositories or any other artifact provided by this service in your application to use.

```ts
import {AuditServiceComponent} from '@sourceloop/audit-service';
// ...
export class MyApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    // ...
    this.component(AuditServiceComponent);
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

### Set the [environment variables](#environment-variables)

The examples below show a common configuration for a PostgreSQL Database running locally.

```environment
NODE_ENV=dev
LOG_LEVEL=DEBUG
HOST=0.0.0.0
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=pg_service_user
DB_PASSWORD=pg_service_user_password
DB_DATABASE=audit_db
DB_SCHEMA=public
JWT_SECRET=super_secret_string
JWT_ISSUER=https://authentication.service
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET_NAME=
PATH_TO_EXPORT_FILES_FOLDER=
PATH_TO_UPLOAD_FILES=
```

### Configure DataSource

Set up a [LoopBack4 Datasource](https://loopback.io/doc/en/lb4/DataSource.html) with `dataSourceName` property set to `AuditDbSourceName`.

```ts
import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {AuditDbSourceName} from '@sourceloop/audit-log';

const config = {
  name: AuditDbSourceName,
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
export class AuditDbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = AuditDbSourceName;
  static readonly defaultConfig = config;

  constructor(
    @inject(`datasources.config.${AuditDbSourceName}`, {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
```

### Migrations

The migrations required for this service are processed during the installation automatically if you set the `AUDIT_MIGRATION` or `SOURCELOOP_MIGRATION` env variable. The migrations use [`db-migrate`](https://www.npmjs.com/package/db-migrate) with [`db-migrate-pg`](https://www.npmjs.com/package/db-migrate-pg) driver for migrations, so you will have to install these packages to use auto-migration. Please note that if you are using some pre-existing migrations or databases, they may be affected. In such a scenario, it is advised that you copy the migration files in your project root, using the `AUDIT_MIGRATION_COPY` or `SOURCELOOP_MIGRATION_COPY` env variables. You can customize or cherry-pick the migrations in the copied files according to your specific requirements and then apply them to the DB.

This migration script supports both MySQL and PostgreSQL databases, controlled by environment variables. By setting MYSQL_MIGRATION to 'true', the script runs migrations using MySQL configuration files; otherwise, it defaults to PostgreSQL. .

Additionally, there is now an option to choose between SQL migration or PostgreSQL migration.
NOTE : for [`@sourceloop/cli`](https://www.npmjs.com/package/@sourceloop/cli?activeTab=readme) users, this choice can be specified during the scaffolding process by selecting the "type of datasource" option.

## Usage

### Creating Logs

The logs in this service can either be created through the REST endpoint, or through a repository mixin provided with the [@sourceloop/audit-log](https://www.npmjs.com/package/@sourceloop/audit-log) npm module. This mixin, by default, creates logs for all the inbuilt actions done through the extended repository.
You can read more about how to use this package [here](https://github.com/sourcefuse/loopback4-audit-log#readme).

All the different types of action that are logged are:

```ts
export declare enum Action {
  INSERT_ONE = 'INSERT_ONE',
  INSERT_MANY = 'INSERT_MANY',
  UPDATE_ONE = 'UPDATE_ONE',
  UPDATE_MANY = 'UPDATE_MANY',
  DELETE_ONE = 'DELETE_ONE',
  DELETE_MANY = 'DELETE_MANY',
}
```

### Archive Logs

The audit logs can be archived via the REST endpoint [`/audit-logs/archive`](openapi.md#archivelogcontrollerarchive). A [custom filter](#archival-filter) is provided based on which logs can be archived. Currently it supports uploading the archived logs to s3 for which you'll need to set the AWS credentials.

#### Archival Filter

```ts
{
  "date": {
    "fromDate": "2023-06-09T05:20:55.097Z",
    "toDate": "2023-06-09T05:20:55.097Z"
  },
  //date parameter allows user to archive data from a given date to a given date
  "deleted": true,
  //deleted flag repesents the 'deleted' property of the 'after' column
  "entityId": "string",
  //entityId represents the unique id of a particular entities
  "actedOn": "Product"
  //actedOn represents the model class for which audit logs are generated
}
```

#### Archival Response

You'll get a similar response like this after requesting the archival:

```json
{
  "message": "Entries archived successfully",
  "numberOfEntriesArchived": 1,
  "key": "audit_logs_2023-06-09T05:44:24.780Z.csv"
}
```

Here `key` repesents the [AWS S3 object key](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#BasicsKeys) of the file which contains the archived logs.

#### Archive audit logs

This provides a function that is used to convert the selected data in csv format and the same is exported to AWS S3 bucket as specified in the variables `AWS_ACCESS_KEY_ID`,
`AWS_SECRET_ACCESS_KEY`,`AWS_REGION`,`AWS_S3_BUCKET_NAME` variables of the `env` file. By default file is exported in csv format on a AWS S3 bucket which can be overwritten using this provider. Value of these can be provided in the config file as well. Also it is necessary to provide the value of`PATH_TO_UPLOAD_FILES` variable in the `env` file. Config file can be binded in application like

```ts
this.bind(AWSS3Bindings.Config).to({
  accessKeyId: '', // Replace with your actual access key
  secretAccessKey: '', // Replace with your actual secret access key
  region: '', // Replace with your desired AWS region
} as AwsS3Config);
```

```ts
this.bind(ExportToCsvServiceBindings.EXPORT_LOGS.key).toProvider(
  ExportToCsvProvider,
);
```

Implementation for this can be seen [here](src/services/export-to-csv.service.ts)

### Get Logs

This feature is used to query the logs present in the Audit Database or the archive storage (eg. AWS S3). A sefault LoopBack filter is accepted based on which logs can be fetched. Along with this a boolean variable called `includeArchivedLogs` is also provided which accepts `true` or `false` resulting in whether to include the archieved logs in response.

If `includeArchivedLogs` is set to `true` the data will be fetched from both Audit database and archive storage based on the filter provided as an input **but it is not immediately returned**, a `jobId` is returned which represents the operation happening in the background to fetch and parse logs from archive storage. This `jobId` can be used to check the status of this process and get the result when it is done.

If `includeArchivedLogs` option is set to `false` (which is default if not provided) the data is fetched from only Audit Database and not from the archive storage and in this case the response contains the data requested.

### Export Logs

This feature is used to export the logs present in Audit Database or the archive storage(eg. AWS.S3). A default loopback filter is accepted based on which logs are exported to the desired location as specified as an excel file(by default) using `AuditLogExportProvider` [here](src/providers/audit-log-export.service.ts).
The exceljs dependency, used by the `AuditLogExportProvider` for generating Excel files, is optional. Users who wish to utilize this feature should manually install exceljs and bind the AuditLogExportProvider in the application.ts of your application:

```ts
this.bind(AuditLogExportServiceBindings.EXPORT_AUDIT_LOGS).toProvider(
  AuditLogExportProvider,
);
```

By following these steps, users can seamlessly incorporate the AuditLogExportProvider into their applications while having the flexibility to choose whether or not to include the exceljs dependency.

Along with this a boolean variable called `includeArchivedLogs` is also provided which accepts `true` or `false` resulting in whether to include the archieved logs in response.

If `includeArchivedLogs` is set to `true` then data will be fetched from both Audit database and archive storage based on the filter provided as an input **but it is not immediately returned**, a `jobId` is returned which represents the operation happening in the background to fetch and parse logs from archive storage. This `jobId` can be used to check the status of this process and get the result when it is done.

If `includeArchivedLogs` option is set to `false` (which is default if not provided) the data is fetched from only Audit Database and not from the archive storage and in this case the response contains the data requested.

This feature also allows custom column names to be given to the data or clubbing of specific columns together. This can be done with the help of providers which can be overwritten as mentioned below

#### Create custom columns

This provides a function which is used to customize the column present in the original data. The names of custom columns can also be specified in the function. By default no change is made to the original data. For making the change desired changes the provider can overwritten as shown below.

Sample implementation-

The provider for this key is to create custom column and custom column names

```ts
this.bind(ColumnBuilderServiceBindings.COLUMN_BUILDER.key).toProvider(
  ColumnBuilderProvider,
);
```

```ts
export class ColumnBuilderProvider implements Provider<ColumnBuilderFn> {
  constructor() {}

  value(): ColumnBuilderFn {
    return async (auditLogs: AuditLog[]) => {
      return this.columnBuilder(auditLogs);
    };
  }
  async columnBuilder(auditLogs: AuditLog[]): Promise<AnyObject[]> {
    return auditLogs.map(log => ({
      beforeAfterCombined: `${JSON.stringify(log.before)} ${JSON.stringify(
        log.after,
      )}`,
      actedOnActionCombined: `${log.actedOn} ${log.actionKey}`,
    }));
  }
}
```

#### Process audit logs

This provides a function that takes excel file buffer as an input and any whatever desired operation can be performed on the excel file buffer.

```ts
this.bind(ExportHandlerServiceBindings.PROCESS_FILE.key).toProvider(
  ExportHandlerProvider,
);
```

Implementation for this can be seen [here](src/services/export-handler.service.ts)

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
      <td><code>AWS_ACCESS_KEY_ID </code></td>
      <td>N</td>
      <td></td>
      <td>Access key ID associated with your AWS account</td>
    </tr>
    <tr>
      <td><code>AWS_SECRET_ACCESS_KEY</code></td>
      <td>N</td>
      <td></td>
      <td>Secret access key associated with your AWS account.</td>
    </tr>
    <tr>
      <td><code>AWS_REGION</code></td>
      <td>N</td>
      <td></td>
      <td>Specifies the AWS region where your AWS S3 bucket is located.</td>
    </tr>
    <tr>
      <td><code>AWS_S3_BUCKET_NAME</code></td>
      <td>N</td>
      <td></td>
      <td>Name of the AWS S3 bucket you want to save the archived audit logs in.</td>
    </tr>
    <tr>
      <td><code>PATH_TO_EXPORT_FILES_FOLDER</code></td>
      <td>N</td>
      <td></td>
      <td>Specifies the path to store the exported files.</td>
    </tr>
    <tr>
      <td><code>PATH_TO_UPLOAD_FILES</code></td>
      <td>N</td>
      <td></td>
      <td>Specifies the path to store the archived files on S3 bucket.</td>
    </tr>
    
    
  </tbody>
</table>

### Using with Sequelize

This service supports Sequelize as the underlying ORM using [@loopback/sequelize](https://www.npmjs.com/package/@loopback/sequelize) extension. And in order to use it, you'll need to do following changes.

1.To use Sequelize in your application, add following to application.ts:

```ts
this.bind(AuditServiceBindings.Config).to({
  useCustomSequence: false,
  useSequelize: true,
});
```

2. Use the `SequelizeDataSource` in your audit datasource as the parent class. Refer [this](https://www.npmjs.com/package/@loopback/sequelize#step-1-configure-datasource) for more.

### API Documentation

#### Common Headers

Authorization: Bearer <token> where <token> is a JWT token signed using JWT issuer and secret.
`Content-Type: application/json` in the response and in request if the API method is NOT GET.

#### API Details

Visit the [OpenAPI spec docs](./openapi.md) for more details on the APIs provided in this service.

## License

Sourceloop is [MIT licensed](./LICENSE).
