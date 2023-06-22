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

The `@sourceloop/audit-service` is a powerful LoopBack microservice specifically designed for managing audit logs. It offers extensive functionality to track and record user actions such as inserts, updates, and deletes. Built on the foundation of [@sourceloop/audit-log](https://www.npmjs.com/package/@sourceloop/audit-log), this service provides a repository mixin for easy integration.

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

You'll a similar response like this after requesting the archival:

```json
{
  "message": "Entries archived successfully",
  "numberOfEntriesArchived": 1,
  "key": "audit_logs_2023-06-09T05:44:24.780Z.csv"
}
```

Here `key` repesents the [AWS S3 object key](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#BasicsKeys) of the file which contains the archived logs.

### Get Logs

This feature is used to query the logs present in the Audit Database or the archive storage (eg. AWS S3). A sefault LoopBack filter is accepted based on which logs can be fetched. Along with this a boolean variable called `includeArchivedLogs` is also provided which accepts `true` or `false` resulting in whether to include the archieved logs in response.

If `includeArchivedLogs` is set to `true` the data will be fetched from both Audit database and archive storage based on the filter provided as an input **but it is not immediately returned**, a `jobId` is returned which represents the operation happening in the background to fetch and parse logs from archive storage. This `jobId` can be used to check the status of this process and get the result when it is done.

If `includeArchivedLogs` option is set to `false` (which is default if not provided) the data is fetched from only Audit Database and not from the archive storage and in this case the response contains the data requested.

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
  </tbody>
</table>

### API Documentation

#### Common Headers

Authorization: Bearer <token> where <token> is a JWT token signed using JWT issuer and secret.
`Content-Type: application/json` in the response and in request if the API method is NOT GET.

#### API Details

Visit the [OpenAPI spec docs](./openapi.md) for more details on the APIs provided in this service.

## License

Sourceloop is [MIT licensed](./LICENSE).
