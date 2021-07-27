# BPMN Microservice

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

## Overview

A Loopback Microservice for handling BPMN workflows using engines like [Camunda](https://camunda.com/products/cloud/). NOTE: The microservice currently works with only one workflow definition for a single diagram. It provides -

 - Deployment and management of Workflows in a BPMN engine.
 - Process Versioning.
 - Executing Workflow using an endpoint, validate inputs before starting an execution.

### Sandbox Example

The [sandbox example](https://github.com/sourcefuse/loopback4-microservice-catalog/tree/master/sandbox/workflow-ms-example) provides a use of this microservice with the [Camunda](https://camunda.com/products/cloud/) BPMN engine.

It uses [camunda-external-task-client-js](https://github.com/camunda/camunda-external-task-client-js) to implement external task workers, that are triggered on executing a workflow. The flow of control is shown in the diagram below - 

![Execute Workflow](https://user-images.githubusercontent.com/77672713/126749866-1344ff59-5a1e-47cf-bf90-d366da3e9498.png)


### Installation

```bash
npm i @sourceloop/bpmn-service
```

### Usage

 - Create a new Loopback4 Application (If you don't have one already)
	`lb4 testapp` 
 - Install the bpmn service
	 `npm i @sourceloop/bpmn-service`
 - Set the [environment variables](#environment-variables).
 - Run the [migrations](#migrations).
 - Bind the BPMN Config to `WorkflowServiceBindings.Config` key-
    ``` typescript
    this.bind(WorkflowServiceBindings.Config).to({
        useCustomSequence: true,
        workflowEngineBaseUrl: process.env.CAMUNDA_URL, // url for the rest engine in case of Camunda
    });
    ```
 - Implement `WorkflowProvider` (refer [this](#bpmnprovider)) and bind it to `WorkflowServiceBindings.WorkflowManager` key -
    ``` typescript
    this.bind(WorkflowServiceBindings.WorkflowManager).toProvider(WorkflowProvider);
    ```
 - Add the `WorkflowServiceComponent` to your Loopback4 Application (in `application.ts`).
	  ``` typescript
    // import WorkflowServiceComponent
    import {WorkflowServiceComponent} from '@sourceloop/bpmn-service';
	  // add Component for WorkflowService
	  this.component(WorkflowServiceComponent);
	  ```
  - Set up a [Loopback4 Datasource](https://loopback.io/doc/en/lb4/DataSource.html) with `dataSourceName` property set to 
	`WorkflowCacheSourceName`. You can see an example datasource [here](#setting-up-a-datasource).
 - Start the application
	`npm start`

### Setting up a `DataSource`

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
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA,
};

@lifeCycleObserver('datasource')
export class BpmnDbDataSource
  extends juggler.DataSource
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

### Environment Variables

The service comes with a default `DataSource` using PostgreSQL, if you intend to use this, you have to provide the following variables in the environment -

| Name          | Required | Default Value | Description                                                                                                                        |
| ------------- | -------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `DB_HOST`     | Y        |               | Hostname for the database server.                                                                                                  |
| `DB_PORT`     | Y        |               | Port for the database server.                                                                                                      |
| `DB_USER`     | Y        |               | User for the database.                                                                                                             |
| `DB_PASSWORD` | Y        |               | Password for the database user.                                                                                                    |
| `DB_DATABASE` | Y        |               | Database to connect to on the database server.                                                                                     |
| `DB_SCHEMA`   | Y        |               | Database schema used for the data source. In PostgreSQL, this will be `public` unless a schema is made explicitly for the service. |

### Setting up a `DataSource`

A sample implementation of a `DataSource` using environment variables and PostgreSQL is included with the service, you can provide your own using the `BpmnDbSourceName` variable. Implementation of the sample `DataSource` can be seen [here](/src/datasources/bpmn-db.datasource.ts).

### Database Schema

![bpmndb](https://user-images.githubusercontent.com/77672713/126750626-205bbd2c-4b51-4b98-ad81-1b39008f2cf5.jpg)


### Providers

#### BPMNProvider

To use the services, you need to implement a provider and bind it to the `BPMNBindings.BPMNProvider` key. The provider returns a value containing the 5 methods - `getWorkflowById`, `startWorkflow`, `createWorkflow`, `updateWorkflow` and `deleteWorkflowById`. These methods are responsible for performing their respective tasks in the workflow engine. Here is the default implementation of this provider -

```ts
import {bind, /* inject, */ BindingScope, Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {WorflowManager} from '../types';

@bind({scope: BindingScope.TRANSIENT})
export class WorkflowProvider implements Provider<WorflowManager> {
  value() {
    return {
      getWorkflowById: async () => {
        throw new HttpErrors.BadRequest(
          'getWorkflowId function not implemented',
        );
      },
      startWorkflow: async () => {
        throw new HttpErrors.BadRequest(
          'startWorkflow function not implemented',
        );
      },
      createWorkflow: async () => {
        throw new HttpErrors.BadRequest(
          'createWorkflow function not implemented',
        );
      },
      updateWorkflow: async () => {
        throw new HttpErrors.BadRequest(
          'updateWorkflow function not implemented',
        );
      },
      deleteWorkflowById: async () => {
        throw new HttpErrors.BadRequest(
          'deleteWorkflowById function not implemented',
        );
      },
    };
  }
}
```

#### WorkerImplementationProvider

Your workers are automatically initiated once a workflow is executed, to provide the implementation details of workers, you need to give implementation template of one such worker using the `WorkflowServiceBindings.WorkerImplementationFunction`, a default implementation is provided [here](/src/providers/worker-implementation.provider.ts). You also need to register individual worker commands using the `WorkflowServiceBindings.RegisterWorkerFunction` function;

#### ExecutionInputValidationProvider

If you need to validate the inputs of a workflow execution, you can bind a custom validation provider using `WorkflowServiceBindings.ExecutionInputValidatorFn` key. The microservice comes with a default implementation using [AJV](https://www.npmjs.com/package/ajv).

### Migrations

The migrations required for this service are processed during the installation automatically if you set the `WORKFLOW_MIGRATION` or `SOURCELOOP_MIGRATION` env variable. The migrations use [`db-migrate`](https://www.npmjs.com/package/db-migrate) with [`db-migrate-pg`](https://www.npmjs.com/package/db-migrate-pg) driver for migrations, so you will have to install these packages to use auto-migration. Please note that if you are using some pre-existing migrations or database, they may be effected. In such scenario, it is advised that you copy the migration files in your project root, using the `WORKFLOW_MIGRATION_COPY` or `SOURCELOOP_MIGRATION_COPY` env variables. You can customize or cherry-pick the migrations in the copied files according to your specific requirements and then apply them to the DB.

This project includes no migrations to seed your BPMN engine. If you are using Camunda BPM Run, you can use either the `resources` folder to seed a model, or you can config it to use a custom DB where you can seed your data. The steps to config Platform Run are given [here](https://camunda.com/blog/2020/03/introducing-camunda-bpm-run/).

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
