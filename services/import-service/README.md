# @sourceloop/import-service

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

## Overview

A LoopBack microservice used to import excel files from cloud to the database along with the feature of uploading excel files to the cloud.

## Installation

```bash

npm i @sourceloop/import-service

```

## Usage

- Install the import service
  `npm i @sourceloop/import-service`
- Set the [environment variables](#environment-variables).
- Run the [migrations](#migrations).
- Add the `ImportServiceComponent` to your Loopback4 Application (in `application.ts`).

  ```typescript
  // import the ImportServiceComponent
  import {ImportServiceComponent} from '@sourceloop/audit-service';
  // add Component for ImportServiceComponent
  this.component(ImportServiceComponent);
  ```

- Set up a [Loopback4 Datasource](https://loopback.io/doc/en/lb4/DataSource.html) with `dataSourceName` property set to `ImportDbSourceName`. You can see an example datasource [here](#setting-up-a-datasource).
- Start the application
  `npm start`

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
DB_DATABASE=import_db
DB_SCHEMA=public
JWT_SECRET=super_secret_string
JWT_ISSUER=https://authentication.service
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
S3_FILE_BUCKET=
SAMPLE_FILE_PATH=

```

| Name             | Required | Default Value | Description                                                                                                                        |
| ---------------- | -------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `NODE_ENV`       | Y        |               | Node environment value, i.e. `dev`, `test`, `prod`                                                                                 |
| `LOG_LEVEL`      | Y        |               | Log level value, i.e. `error`, `warn`, `info`, `verbose`, `debug`                                                                  |
| `HOST`           | Y        |               | Host for the service to run under, i.e. `0.0.0.0`                                                                                  |
| `PORT`           | Y        | `3000`        | Port for the service to listen on.                                                                                                 |
| `DB_HOST`        | Y        |               | Hostname for the database server.                                                                                                  |
| `DB_PORT`        | Y        |               | Port for the database server.                                                                                                      |
| `DB_USER`        | Y        |               | User for the database.                                                                                                             |
| `DB_PASSWORD`    | Y        |               | Password for the database user.                                                                                                    |
| `DB_DATABASE`    | Y        |               | Database to connect to on the database server.                                                                                     |
| `DB_SCHEMA`      | Y        | `public`      | Database schema used for the data source. In PostgreSQL, this will be `public` unless a schema is made explicitly for the service. |
| `JWT_SECRET`     | Y        |               | Symmetric signing key of the JWT token.                                                                                            |
| `JWT_ISSUER`     | Y        |               | Issuer of the JWT token.                                                                                                           |
| `S3_FILE_BUCKET` | Y        |               | S3 Bucket name to upload file.                                                                                                     |

### Setting up a `DataSource`

Here is a Sample Implementation `DataSource` implementation using environment variables.

```TypeScript
import {inject, lifeCycleObserver, LifeCycleObserver} from  '@loopback/core';
import {juggler} from  '@loopback/repository';
import {ImportDbSourceName} from  '@sourceloop/audit-log';

const  config = {
  name:  ImporttDbSourceName,
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
export  class  ImportDbDataSource  extends  juggler.DataSource implements  LifeCycleObserver {
  static  dataSourceName = ImportDbSourceName;
  static  readonly  defaultConfig = config;

  constructor(
    @inject('datasources.config.import', {optional:  true})
    dsConfig: object = config,
  ) {
      super(dsConfig);
  }
}

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
