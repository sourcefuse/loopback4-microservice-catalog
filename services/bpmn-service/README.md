# BPMN Microservice

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
import {WorkflowCacheSourceName} from '../types';

const config = {
  name: WorkflowCacheSourceName,
  connector: 'postgresql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, //NOSONAR
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class BpmnDbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = WorkflowCacheSourceName;
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.BpmnDb', {optional: true})
      dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}

```
and bind a provider to the `WorkflowServiceBindings.WorkflowManager` key 

```ts
    this.bind(WorkflowServiceBindings.WorkflowManager).toProvider(
      WorkflowProvider,
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

To use the services, you need to implement a provider and bind it to the `BPMNBindings.BPMNProvider` key. The provider returns a value containing the 5 methods - `getWorkflowById`, `startWorkflow`, `createWorkflow`, `updateWorkflow` and `deleteWorkflowById`. These methods are responsible for performing their respective tasks in the workflow engine.  Here is the default implementation of this provider - 

```ts
import {bind, /* inject, */ BindingScope, Provider} from '@loopback/core';
import { HttpErrors } from '@loopback/rest';
import {WorflowManager} from '../types';

@bind({scope: BindingScope.TRANSIENT})
export class WorkflowProvider
  implements Provider<WorflowManager> {

  value() {
    return {
      getWorkflowById: async () => {
        throw new HttpErrors.BadRequest("getWorkflowId function not implemented");
      },
      startWorkflow: async () => {
        throw new HttpErrors.BadRequest("startWorkflow function not implemented");
      },
      createWorkflow: async () => {
        throw new HttpErrors.BadRequest("createWorkflow function not implemented");
      },
      updateWorkflow: async () => {
        throw new HttpErrors.BadRequest("updateWorkflow function not implemented");
      },
      deleteWorkflowById: async () => {
        throw new HttpErrors.BadRequest("deleteWorkflowById function not implemented");
      }
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
