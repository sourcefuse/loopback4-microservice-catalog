# @sourceloop/search-service

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

![npm](https://img.shields.io/npm/dm/@sourceloop/search-service)

![node-current (scoped)](https://img.shields.io/node/v/@sourceloop/search-service)

![npm (prod) dependency version (scoped)](https://img.shields.io/npm/dependency-version/@sourceloop/search-service/@loopback/core)

## Overview

A LoopBack microservice used for searching over configured models. It uses in-build Full Text Search support in PostgreSQL and MySQL databases to perform searches.

## Installation

```bash

npm i @sourceloop/search-service

```

## Usage

- Create a new Loopback4 Application (If you don't have one already)
  `lb4 testapp`
- Install the search service
  `npm i @sourceloop/search-service`
- Bind the configuration for the service to the `SearchServiceBindings.Config` key -

  ```typescript
  this.bind({
    useCustomSequence: false, //default
    type: SearchResult, //default
    models: [
      //required
      ToDo, //according to project
      {
        model: User,
        columns: {
          name: 'username',
          description: 'about',
        },
      },
    ],
    controller: {
      //optional
      name: 'ToDo',
      basePath: '/todo/search',
      authorizations: ['SearchTodo'],
    },
  });
  ```

- Add the `SearchService` to your Loopback4 Application (in `application.ts`)

  ```typescript
  // import the SearchServiceComponent
  import {SearchServiceComponent} from '@sourceloop/search-service';
  // add Component for SearchServiceComponent
  this.component(SearchServiceComponent);
  ```

- Set up a [Loopback4 Datasource](https://loopback.io/doc/en/lb4/DataSource.html) with `dataSourceName` property set to `SearchServiceBindings.DATABASE_NAME`. You can see an example datasource [here](#setting-up-a-datasource). This service supports MySQL and PostgreSQL based datasources as of now.
- Start the application
  `npm start`

## Configurations

**useCustomSequence**

The service comes with a default sequence with inbuilt authentication and authorization using the [loopback4-authentication](https://github.com/sourcefuse/loopback4-authentication) and [loopback4-authorization](https://github.com/sourcefuse/loopback4-authorization). If you want to use your custom sequence instead, set this option as true.

**type**

Type of the result set, by default it is a model with two properties - `name` and `description`;

**models**

It sets the models and columns over which the search is performed. It's value is a list with two types of values -

- Models - A class that extends the Loopback Model.
- An Object with two properties -
  - model - A class that extends the Loopback Model
  - columns - A key-value map that maps the keys of the database model to the keys in the result set.

**controller**

Configuration for the controller, it accepts three properties -

- name - name of the Controller, by default it is SearchController
- basePath - basePath of the controller, be default it is {name}/search, if even the name is not provided, it is just /search
- authentication - if authentication should be required or not, this must be enable to use authorizations
- authorizations - list of string corresponding to the permissions required for the search API, by default equal to `['*']`(allowed for everyone).
- recents - provider an endpoint to fetch recent searches. authentication must be enabled to use this.
- recentCount - number of recent searches to be saved for each user, default value is 5.

### Setting up a `DataSource`

Here is a Sample Implementation `DataSource` implementation using environment variables.

```TypeScript
import {inject, lifeCycleObserver, LifeCycleObserver} from  '@loopback/core';
import {juggler} from  '@loopback/repository';
import {SearchServiceBindings.DATABASE_NAME} from  '@sourceloop/search-service';

const  config = {
  name:  SearchServiceBindings.DATABASE_NAME,
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
export  class  SearchDbDataSource  extends  juggler.DataSource implements  LifeCycleObserver {
  static  dataSourceName = SearchServiceBindings.DATABASE_NAME;
  static  readonly  defaultConfig = config;

  constructor(
    // You need to set datasource configuration name as 'datasources.config.search' otherwise you might get Errors
    @inject('datasources.config.search', {optional:  true})
    dsConfig: object = config,
  ) {
      super(dsConfig);
  }
}

```

Also if you are using `postgres` datasource, you need to add the following function in your db -

```sql
CREATE OR REPLACE FUNCTION f_concat_ws(text, VARIADIC text[])
  RETURNS text LANGUAGE sql IMMUTABLE AS 'SELECT array_to_string($2, $1)';
```

And to improve performance define an index like this -

```sql
CREATE INDEX tbl_fts_idx ON main.<TABLENAME> USING GIN (
       to_tsvector('english', f_concat_ws(' ', <COLUMN1>, <COLUMN2>)));
```

### Using with Sequelize

This service supports Sequelize as the underlying ORM using [@loopback/sequelize](https://www.npmjs.com/package/@loopback/sequelize) extension. And in order to use it, you'll need to do following changes.

1.To use Sequelize in your application, add following to application.ts:

```ts
this.bind(SearchServiceBindings.Config).to({
  useCustomSequence: false,
  useSequelize: true,
});
```

2. Use the `SequelizeDataSource` in your datasource as the parent class. Refer [this](https://www.npmjs.com/package/@loopback/sequelize#step-1-configure-datasource) for more.

## Migrations

The migrations required for this service are processed during the installation automatically if you set the `CHAT_MIGRATION` or `SOURCELOOP_MIGRATION` env variable. The migrations use [`db-migrate`](https://www.npmjs.com/package/db-migrate) with [`db-migrate-pg`](https://www.npmjs.com/package/db-migrate-pg) driver for migrations, so you will have to install these packages to use auto-migration. Please note that if you are using some pre-existing migrations or databasea, they may be affected. In such a scenario, it is advised that you copy the migration files in your project root, using the `CHAT_MIGRATION_COPY` or `SOURCELOOP_MIGRATION_COPY` env variables. You can customize or cherry-pick the migrations in the copied files according to your specific requirements and then apply them to the DB.


This migration script supports both MySQL and PostgreSQL databases, controlled by environment variables. By setting MYSQL_MIGRATION to 'true', the script runs migrations using MySQL configuration files; otherwise, it defaults to PostgreSQL. .

Additionally, there is now an option to choose between SQL migration or PostgreSQL migration.
NOTE: For [`@sourceloop/cli`](https://www.npmjs.com/package/@sourceloop/cli?activeTab=readme) users, this choice can be specified during the scaffolding process by selecting the "type of datasource" option.

## API Documentation

#### Common Headers

Authorization: Bearer \<token> where \<token> is a JWT token signed using JWT issuer and secret.
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
