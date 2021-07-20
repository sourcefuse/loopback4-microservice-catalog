
# audit-service

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

A LoopBack microservice used for auditing user actions. It uses [@sourceloop/audit-log](https://www.npmjs.com/package/@sourceloop/audit-log) to store the logs to a datasource. This service provides REST endpoints to perform CRUD operations for the audit logs.


## Installation

```bash

npm i @sourceloop/audit-service

```


## Usage

 - Create a new Loopback4 Application (If you don't have one already)
  `lb4 testapp`
- Install the audit service
`npm i @sourceloop/audit-service`
- Set the [environment variables](#environment-variables).
- Run the [migrations](#migrations).
- Add the `AuditServiceComponent` to your Loopback4 Application (in `application.ts`).
	``` typescript
  // import the AuditServiceComponent
  import {AuditServiceComponent} from '@sourceloop/audit-service';
	// add Component for AuditServiceComponent
	this.component(AuditServiceComponent);
	```
- Set up a [Loopback4 Datasource](https://loopback.io/doc/en/lb4/DataSource.html) with `dataSourceName` property set to `AuditDbSourceName`. You can see an example datasource [here](#setting-up-a-datasource).
- Start the application
  `npm start`


### Creating Logs

The logs in this service can either be created through the REST endpoint, or through a repository mixin provided with the [@sourceloop/audit-log](https://www.npmjs.com/package/@sourceloop/audit-log)  npm module. This mixin, by default, creates logs for all the inbuilt actions done through the extended repository.
You can read more about how to use this package [here](https://github.com/sourcefuse/loopback4-audit-log#readme).  


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
DB_DATABASE=audit_db
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


### Setting up a `DataSource`  

Here is a Sample Implementation `DataSource` implementation using environment variables.
``` TypeScript
import {inject, lifeCycleObserver, LifeCycleObserver} from  '@loopback/core';
import {juggler} from  '@loopback/repository';
import {AuditDbSourceName} from  '@sourceloop/audit-log';  

const  config = {
  name:  AuditDbSourceName,
  connector:  'postgresql',
  url:  '',
  host:  process.env.DB_HOST,
  port:  process.env.DB_PORT,
  user:  process.env.DB_USER,
  password:  process.env.DB_PASSWORD,
  database:  process.env.DB_DATABASE,
  schema:  process.env.DB_SCHEMA,
};
  

@lifeCycleObserver('datasource')
export  class  AuditDbDataSource  extends  juggler.DataSource implements  LifeCycleObserver {
  static  dataSourceName = AuditDbSourceName;
  static  readonly  defaultConfig = config;

  constructor(
    // You need to set datasource configuration name as 'datasources.config.audit' otherwise you might get Errors
    @inject('datasources.config.audit', {optional:  true})
    dsConfig: object = config,
  ) {
      super(dsConfig);
  }
}

```


### Migrations

The migrations required for this service are processed during the installation automatically if you set the `AUDIT_MIGRATION` or `SOURCELOOP_MIGRATION` env variable. The migrations use [`db-migrate`](https://www.npmjs.com/package/db-migrate) with [`db-migrate-pg`](https://www.npmjs.com/package/db-migrate-pg) driver for migrations, so you will have to install these packages to use auto-migration. Please note that if you are using some pre-existing migrations or database, they may be effected. In such scenario, it is advised that you copy the migration files in your project root, using the `AUDIT_MIGRATION_COPY` or `SOURCELOOP_MIGRATION_COPY` env variables. You can customize or cherry-pick the migrations in the copied files according to your specific requirements and then apply them to the DB.


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