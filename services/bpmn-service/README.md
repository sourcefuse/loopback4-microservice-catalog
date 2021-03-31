# bpmn-service

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

## Overview

A Loopback Microservice for handling BPMN workflows using engines like (Camunda)[https://camunda.com/products/cloud/].

## Installation

## Overview

Microservice for handling bpmn flow in an application.

### Installation

```bash
npm i @sourceloop/bpmn-service
```

## Implementation

Create a new Application using Loopback CLI and add the Component for `BpmnService` in `application.ts`

```typescript
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import { NotificationServiceComponent } from '@sourceloop/notification-service';
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';
import path from 'path';

export {ApplicationConfig};

const port = 3000;
export class Client extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    dotenv.config();
    dotenvExt.load({
      schema: '.env.example',
      errorOnMissing: true,
      includeProcessEnv: true,
    });
    options.rest = options.rest || {};
    options.rest.port = +(process.env.PORT || port);
    options.rest.host = process.env.HOST;
    super(options);
    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    // add Component for NotificationService
    this.component(NotificationServiceComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
```

### Environment Variables

| Name          | Required | Default Value | Description                                                  |
| ------------- | -------- | ------------- | ------------------------------------------------------------ |
| `NODE_ENV`    | Y        |               | Node environment value, i.e. `dev`, `test`, `prod`           |
| `LOG_LEVEL`   | Y        |               | Log level value, i.e. `error`, `warn`, `info`, `verbose`, `debug` |
| `DB_HOST`     | Y        |               | Hostname for the database server.                            |
| `DB_PORT`     | Y        |               | Port for the database server.                                |
| `DB_USER`     | Y        |               | User for the database.                                       |
| `DB_PASSWORD` | Y        |               | Password for the database user.                              |
| `DB_DATABASE` | Y        |               | Database to connect to on the database server.               |
| `DB_SCHEMA`   | Y        |               | Database schema used for the data source. In PostgreSQL, this will be `public` unless a schema is made explicitly for the service. |
| `JWT_SECRET`  | Y        |               | Symmetric signing key of the JWT token.                      |
| `JWT_ISSUER`  | Y        |               | Issuer of the JWT token.                                     |

### Setting up `DataSource`

Here is a sample Implementation `DataSource` implementation using environment variables and PostgreSQL as the data source. 

```typescript
import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'notificationDb',
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
export class NotificationDbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'notification';
  static readonly defaultConfig = config;

  constructor(
    // You need to set datasource configuration name as 'datasources.config.Notification' otherwise you might get Errors
    @inject('datasources.config.Notification', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
```
and bind a provider to the `BPMNBindings.BPMNProvider` key 

```ts
    this.bind(BPMNBindings.BPMNProvider).toProvider(
      BpmnProvider,
    );
```
### Environment Variables

The service comes with a default `DataSource` using PostgreSQL, if you intend to use this, you have to provide the following variables in the environment - 

| Name                          | Required | Default Value | Description                                                  |
| ----------------------------- | -------- | ------------- | ------------------------------------------------------------ |
| `DB_HOST`                     | Y        |               | Hostname for the database server.                            |
| `DB_PORT`                     | Y        |               | Port for the database server.                                |
| `DB_USER`                     | Y        |               | User for the database.                                       |
| `DB_PASSWORD`                 | Y        |               | Password for the database user.                              |
| `DB_DATABASE`                 | Y        |               | Database to connect to on the database server.               |
| `DB_SCHEMA`                   | Y        |               | Database schema used for the data source. In PostgreSQL, this will be `public` unless a schema is made explicitly for the service.

### Setting up a `DataSource`

A sample implementation of a `DataSource` using environment variables and PostgreSQL is included with the service, you can provide your own using the `BpmnDbSourceName` variable. Implementation of the sample `DataSource` can be seen [here](/src/datasources/bpmn-db.datasource.ts).

### Providers

#### BPMNProvider

To use the services, you need to implement a provider and bind it to the `BPMNBindings.BPMNProvider` key. The provider returns a value containing the 4 methods - `create`, `update`, `delete` and `execute`. These methods are responsible for performing their respective tasks in the workflow engine.  Here is the default implementation of this provider - 

```ts
import {Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';

import {ErrorKeys} from '../../constants/error-keys';
import {BPMN, ExecutionRequest} from '../types';
import {Workflow, WorkflowDto} from '../../models';

export class BpmnProvider implements Provider<BPMN> {

  value() {
    return {
      create: async (workflow: WorkflowDto) => {
        throw new HttpErrors.UnprocessableEntity(
          ErrorKeys.ProviderNotFound,
        );
      },
      update: async (workflow: WorkflowDto) => { //NOSONAR
        throw new HttpErrors.UnprocessableEntity(
          ErrorKeys.ProviderNotFound,
        );
      },
      delete: async (workflow: Workflow) => { //NOSONAR
        throw new HttpErrors.UnprocessableEntity(
          ErrorKeys.ProviderNotFound,
        );
      },
      execute: async (executionRequest: ExecutionRequest) => { //NOSONAR
        throw new HttpErrors.UnprocessableEntity(
          ErrorKeys.ProviderNotFound,
        );
      },
    };
  }
}

```

### Migrations

Refer to [Database Migrations | LoopBack Documentation](https://loopback.io/doc/en/lb4/Database-migrations.html) for instructions for handling migrations.

### API Documentation

#### Common Headers

Authorization: Bearer <token> where <token> is a JWT token signed using JWT issuer and secret.
`Content-Type: application/json` in the response and in request if the API method is NOT GET

#### Common Request path Parameters

{version}: Defines the API Version

### Common Responses

200: Successful Response. Response body varies w.r.t API<br/>
401: Unauthorized: The JWT token is missing or invalid<br/>
403: Forbidden : Not allowed to execute the concerned API<br />
404: Entity Not Found<br />
400: Bad Request (Error message varies w.r.t API)<br />
201: No content: Empty Response<br />

### API Details

`POST /workflow`
 Endpoint to create a new workflow, uses the `create` method from the provider.

`PATCH /workflow/{id}`
 Endpoint to update a workflow, uses the `update` method from the provider.

`POST /workflow/{id}/start`
 Endpoint to trigger a workflow, uses the `execute` method from the provider.

`DELETE /workflow/{id}`
 Endpoint to delete a workflow, uses the `delete` method from the provider.

`GET /workflow`
 Endpoint to get all the workflows.
