# ocr-s3-service

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

![npm](https://img.shields.io/npm/dm/@sourceloop/ocr-s3-service)

![node-current (scoped)](https://img.shields.io/node/v/@sourceloop/ocr-s3-service)

![npm (prod) dependency version (scoped)](https://img.shields.io/npm/dependency-version/@sourceloop/ocr-s3-service/@loopback/core)

## Overview

Microservice for getting HOCR files and image files from AWS S3.

## Installation

```bash

npm i @sourceloop/ocr-s3-service

```

## Usage

- Create a new Loopback4 Application (If you don't have one already)
  `lb4 testapp`
- Install the ocr s3 service.
  `npm i @sourceloop/ocr-s3-service`
- Set the [environment variables](#environment-variables).
- Add the `OcrS3ServiceComponent` to your Loopback4 Application (in `application.ts`).
  ```typescript
  // import the OcrS3ServiceComponent
  import {OcrS3ServiceComponent} from '@sourceloop/ocr-s3-service';
  // add Component for OcrS3ServiceComponent
  this.component(OcrS3ServiceComponent);
  ```
- Set up a [Loopback4 Datasource](https://loopback.io/doc/en/lb4/DataSource.html) with `dataSourceName` property set to `OcrS3DbSourceName`. You can see an example datasource [here](#setting-up-a-datasource).
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
DB_DATABASE=ocr_db
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

```TypeScript
import {inject, lifeCycleObserver, LifeCycleObserver} from  '@loopback/core';
import {juggler} from  '@loopback/repository';

const  config = {
  name:  'OcrS3DbSourceName',
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
export  class  OcrS3DbSourceName  extends  juggler.DataSource implements  LifeCycleObserver {
  static  dataSourceName = OcrS3DbSourceName;
  static  readonly  defaultConfig = config;

  constructor(
    // You need to set datasource configuration name as 'datasources.config.ocr' otherwise you might get Errors
    @inject('datasources.config.ocrs3', {optional:  true})
    dsConfig: object = config,
  ) {
      super(dsConfig);
  }
}

```



