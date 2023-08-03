<a style="position: relative; top: 10px;" href="https://sourcefuse.github.io/arc-docs/arc-api-docs" target="_blank"><img src="https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/docs/assets/logo-dark-bg.png?raw=true" alt="ARC By SourceFuse logo" title="ARC By SourceFuse" align="right" width="150" /></a>

# [@sourceloop/survey-service](https://github.com/sourcefuse/loopback4-microservice-catalog/tree/master/services/survey-service)

<p align="left">
<a href="https://www.npmjs.org/package/@sourceloop/survey-service">
<img src="https://img.shields.io/npm/v/@sourceloop/survey-service.svg" alt="npm version" />
</a>
<a href="https://github.com/sourcefuse/loopback4-microservice-catalog/graphs/contributors" target="_blank">
<img alt="GitHub contributors" src="https://img.shields.io/github/contributors/sourcefuse/loopback4-microservice-catalog">
</a>
<a href="https://www.npmjs.com/@sourceloop/survey-service" target="_blank">
<img alt="sourceloop survey-service downloads" src="https://img.shields.io/npm/dm/@sourceloop/survey-service">
</a>
<a href="./LICENSE">
<img src="https://img.shields.io/github/license/sourcefuse/loopback4-microservice-catalog" alt="License" />
</a>
<a href="https://loopback.io/" target="_blank">
<img alt="Pb Loopback" src="https://img.shields.io/badge/Powered%20by-Loopback 4-brightgreen" />
</a>
</p>

## Overview

A LoopBack microservice used for creating survey using different entities like questions, question-templates,sections.

- Questions - A Question can be created of multiple types like Multi Selection,Single Selection,Text , Drop Down , Scale.
- Question Template - A question template consists of a group of questions which can be directly used in a survey.
- Survey - Questions can be added to survey via question-templates or individual questions itself.
- Section -Section can be created inside a survey and questions can be added to it.
- Survey cycles - If there is a need for periodic re-assessment of the survey we need to create survey cycles which can be quarterly, monhtly,annually etc as per the business requirement.
- Survey responder -Responders are users who can respond to the survey. Survey responders can be created ,updated,deleted for a survey.

## Installation

Install SurveyServiceComponent using `npm`;

```sh
$ [npm install | yarn add] @sourceloop/survey-service
```

## Usage

- Install the audit service
  `npm i @sourceloop/survey-service`
- Set the [environment variables](#environment-variables).
- Run the [migrations](#migrations).
- Add the `SurveyServiceComponent` to your Loopback4 Application (in `application.ts`).
  ```typescript
  // import the SurveyServiceComponent
  import {SurveyServiceComponent} from '@sourceloop/survey-service';
  // add Component for SurveyServiceComponent
  this.component(SurveyServiceComponent);
  ```
- Set up a [Loopback4 Datasource](https://loopback.io/doc/en/lb4/DataSource.html) with `dataSourceName` property set to `SurveyDbSourceName`. You can see an example datasource [here](#setting-up-a-datasource).
- Start the application
  `npm start`

### Using with Sequelize

This service supports Sequelize as the underlying ORM using [@loopback/sequelize](https://www.npmjs.com/package/@loopback/sequelize) extension. And in order to use it, you'll need to do following changes.

1. Change the import statements from `@sourceloop/survey-service` to `@sourceloop/survey-service/sequelize`. This can be done easily with your IDEs find and replace feature.

For example, from this:

```ts
import {SurveyServiceComponent} from '@sourceloop/survey-service';
```

to this:

```ts
import {SurveyServiceComponent} from '@sourceloop/survey-service/sequelize';
```

2. Use the `SequelizeDataSource` in your audit datasource as the parent class. Refer [this](https://www.npmjs.com/package/@loopback/sequelize#step-1-configure-datasource) for more.

### Environment Variables

Do not forget to set Environment variables. The examples below show a common configuration for a MySQL Database running locally.

```environment
NODE_ENV=dev
LOG_LEVEL=DEBUG
HOST=0.0.0.0
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=pg_service_user
DB_PASSWORD=pg_service_user_password
DB_DATABASE=survey_db
DB_SCHEMA=main
JWT_SECRET=super_secret_string
JWT_ISSUER=issuer_name
```

| Name          | Required | Default Value | Description                                                                                                                 |
| ------------- | -------- | ------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `NODE_ENV`    | Y        |               | Node environment value, i.e. `dev`, `test`, `prod`                                                                          |
| `LOG_LEVEL`   | Y        |               | Log level value, i.e. `error`, `warn`, `info`, `verbose`, `debug`                                                           |
| `HOST`        | Y        |               | Host for the service to run under, i.e. `0.0.0.0`                                                                           |
| `PORT`        | Y        | `3000`        | Port for the service to listen on.                                                                                          |
| `DB_HOST`     | Y        |               | Hostname for the database server.                                                                                           |
| `DB_PORT`     | Y        |               | Port for the database server.                                                                                               |
| `DB_USER`     | Y        |               | User for the database.                                                                                                      |
| `DB_PASSWORD` | Y        |               | Password for the database user.                                                                                             |
| `DB_DATABASE` | Y        |               | Database to connect to on the database server.                                                                              |
| `DB_SCHEMA`   | Y        | `public`      | Database schema used for the data source. In MYSQL, this will be `main` unless a schema is made explicitly for the service. |
| `JWT_SECRET`  | Y        |               | Symmetric signing key of the JWT token.                                                                                     |
| `JWT_ISSUER`  | Y        |               | Issuer of the JWT                                                                                                           |
| token.        |

### Setting up a `DataSource`

Here is a Sample Implementation `DataSource` implementation using environment variables.

```TypeScript
import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {SurveyDbSourceName} from '@sourceloop/survey-service';

const config = {
  name:  SurveyDbSourceName,
  connector:  'mysql',
  url:  '',
  host:  process.env.DB_HOST,
  port:  process.env.DB_PORT,
  user:  process.env.DB_USER,
  password:  process.env.DB_PASSWORD,
  database:  process.env.DB_DATABASE,
  schema:  process.env.DB_SCHEMA,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MysqlDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = SurveyDbSourceName;
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mysql', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
```

### Migrations

The migrations required for this service are processed during the installation automatically if you set the `SURVEY_MIGRATION` or `SOURCELOOP_MIGRATION` env variable. The migrations use [`db-migrate`] with [`db-migrate-mysql`] driver for migrations, so you will have to install these packages to use auto-migration. Please note that if you are using some pre-existing migrations or databases, they may be affected. In such a scenario, it is advised that you copy the migration files in your project root, using the `SURVEY_MIGRATION_COPY` or `SOURCELOOP_MIGRATION_COPY` env variables. You can customize or cherry-pick the migrations in the copied files according to your specific requirements and then apply them to the DB.

#### Common Headers

Authorization: Bearer <token> where <token> is a JWT token signed using JWT issuer and secret.
`Content-Type: application/json` in the response and in request if the API method is NOT GET

### Common Responses

200: Successful Response. Response body varies w.r.t API
401: Unauthorized: The JWT token is missing or invalid
403: Forbidden : Not allowed to execute the concerned API
404: Entity Not Found
400: Bad Request (Error message varies w.r.t API)
201: No content: Empty Response

#### API Details

Visit the [OpenAPI spec docs](./openapi.md)
