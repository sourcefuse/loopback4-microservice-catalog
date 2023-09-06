<a style="position: relative; top: 10px;" href="https://sourcefuse.github.io/arc-docs/arc-api-docs" target="_blank"><img src="https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/docs/assets/logo-dark-bg.png?raw=true" alt="ARC By SourceFuse logo" title="ARC By SourceFuse" align="right" width="150" /></a>

# [@sourceloop/task-service](https://github.com/sourcefuse/loopback4-microservice-catalog/tree/master/services/audit-service)

<p align="left">
<a href="./LICENSE">
<img src="https://img.shields.io/github/license/sourcefuse/loopback4-microservice-catalog" alt="License" />
</a>
<a href="https://loopback.io/" target="_blank">
<img alt="Pb Loopback" src="https://img.shields.io/badge/Powered%20by-Loopback 4-brightgreen" />
</a>
</p>

## Overview

A reusable, customizable and workflow based task service which creates some actionable tasks based upon various events happening via different microservices in a distributed system.

To get started with a basic implementation of this service, see [/sandbox/task-ms-example](https://github.com/sourcefuse/loopback4-microservice-catalog/tree/master/sandbox/task-example).

## Installation

```bash
npm i @sourceloop/task-service
```

## Getting Started

You can start using `@sourceloop/task-service` in just 4 steps:

1. [Configure Bindings](#bind-component)
2. [Set the environment variables](#set-the-environment-variables)
3. [Configure DataSource](#configure-datasource)
4. [Run the Migrations](#migrations)

Bind the `TaskServiceComponent` to your application constructor as shown below, this will load all controllers, repositories or any other artifact provided by this service in your application to use.

```ts
import {TaskServiceComponent} from '@sourceloop/task-service';
// ...
export class MyApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    // STEP 1: Bind the component
    this.component(TaskServiceComponent);

    // STEP 2: Bind a connector, in this case, we are using AWS SQS
    this.bind(TaskServiceBindings.CONNECTOR_CONFIG).to({
      accessKeyId: process.env.AWS_SQS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SQS_SECRET_KEY,
      region: process.env.AWS_SQS_REGION,
      queueUrl: process.env.AWS_QUEUE_URL,
    });

    // STEP 3: Bind the name of the connector
    this.bind(TaskServiceBindings.CONNECTOR_NAME).to('myConn');

    // STEP 4: Bind the BPMN Engine rest url, in this case, we are using
    // Camunda version 7
    this.bind(ExportedWorkflowServiceBindingConfig).to({
      useCustomSequence: true,
      workflowEngineBaseUrl: process.env.CAMUNDA_URL,
    });

    // STEP 5: Bind a provider for the event queue, more info can be found
    // in the sandbox/task-ms-example
    this.bind(TaskServiceBindings.TASK_PROVIDER).toProvider(SQSConnector);

    // STEP 6: Bind a provider to write custom logic for node workers in a BPMN Engine
    // in this case we are using camunda external tasks, which are configured
    // as service tasks. More info availabe in the sandbox/task-ms-example
    this.bind(TaskServiceBindings.CUSTOM_BPMN_RUNNER).toProvider(
      CustomBpmnRunner,
    );
  }
}
```

## Example Usage

1. ### Generate API key and secret for webhook subscription

   Currently, this service broadcasts messages through a secured webhook, which requires api key and secret, to subscribe in the next step.

   `POST: /api-keys` with your unique client key and secret

2. ### Subscribe to the webhook
   `POST: /tasks/subscribe` with your post URL and an event key to listen for broadcast messages. Include the previously generated apiKey and apiSecret in the headers
3. ### Setup Mappings

   `POST: /events/mapping` - with a particular eventKey and workflowKey, to map an event to a bpmn workflow

   `POST: /tasks/mapping` - with a particular taskKey and workflowKey, to map a task to a bpmn workflow

   These keys are required to dynamically map workflows and execute them.

4. ### Send Events
   `POST: /enque-event` with your dynamic payload according to your custom bpmn to start the task service!  
   The task ms will create tasks according to the payload and configuration of your bpmn.
5. ### Listen for messages
   The task ms will send a broadcast message once the event has been processed. You can verify various bpmn instances in the camunda cockpit.
6. ### Move the BPMN process through API
   `POST: /tasks` with your particular task key and required variables to move the bpmn process forward

### Environment Variables

The service comes with a default `DataSource` using PostgreSQL, if you intend to use this, you have to provide the following variables in the environment -

| Name          | Required | Default Value | Description                                                                                                                      |
| ------------- | -------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `DB_HOST`     | Y        |               | Hostname for the database server.                                                                                                |
| `DB_PORT`     | Y        |               | Port for the database server.                                                                                                    |
| `DB_USER`     | Y        |               | User for the database.                                                                                                           |
| `DB_PASSWORD` | Y        |               | Password for the database user.                                                                                                  |
| `DB_DATABASE` | Y        |               | Database to connect to on the database server.                                                                                   |
| `DB_SCHEMA`   | Y        |               | Database schema used for the data source. In PostgreSQL, this will be `main` unless a schema is made explicitly for the service. |
| `CAMUNDA_URL` | Y        |               | Camunda REST Engine URL.                                                                                                         |
