<a style="position: relative; top: 10px;" href="https://sourcefuse.github.io/arc-docs/arc-api-docs" target="_blank"><img src="https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/docs/assets/logo-dark-bg.png?raw=true" alt="ARC By SourceFuse logo" title="ARC By SourceFuse" align="right" width="150" /></a>

# [@sourceloop/task-service](https://github.com/sourcefuse/loopback4-microservice-catalog/tree/master/services/task-service)

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

1. [Configure and bind TaskServiceComponent](#bind-component)
2. [Configure DataSources](#configure-datasources)
3. [Run the Migrations](#migrations)

## Bind Component

- choose and bind an incoming connector and an outgoing connector. refer [Incoming and Outgoing connectors section for more details](#incoming-and-outgoing-connectors)
- bind the config for task service (optional) -

```ts
this.bind(TaskServingBindings.Config).to({
  useCustomSequence: true, // enable this if you want to use your own sequence instead of one provided by the task service
  // though note that using a custom sequence may break or completely disable the authentication and authorization implemenation of task service
});
```

## Configure datasources

- to use the task service you need to bind atleast two datasources (though both could connect to the same db)
- the `dataSourceName` property of these two should be `WorkflowServiceSourceName` and `TaskDbSourceName` variables exported by the task service. For example, one of the datasources would look something like this -

```ts
import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {TaskDbSourceName} from '@sourceloop/task-service';
import {config} from './config';

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class PgDbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = TaskDbSourceName; // this is the line that should variable from task service
  static readonly defaultConfig = config;

  constructor(
    @inject(`datasources.config.${TaskDbSourceName}`, {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
```

## Run the migrations

- To run the migrations provided by the task service (available in the migrations folder of both the source code and the packed version in your `node_modules`), use the [db-migrate](https://db-migrate.readthedocs.io/en/latest/) package.
- Run the HTTP migrations only if you plan to use the Http Outgoing connector.
- Additionally, there is now an option to choose between SQL migration or PostgreSQL migration.
  NOTE : For @sourceloop/cli users, this choice can be specified during the scaffolding process by selecting the "type of datasource" option.

## Commands

The workflows run by the task service could have service tasks for various actions, but the task service provides two common service-tasks-

#### Create Tasks

This command expects an input variable holding a list of tasks. This command creates all the tasks in this variable and triggers an outgoing event with the created tasks. To trigger this command at a node, use the topic - `create-tasks` and provide a variable with structure -

```json
{
  "tasks": {
    "values": [
      {
        // task data
        ...
      }
    ]
  }
}

```

#### End Task

This command is expected to be used as a topic for the end event of a task workflow. For example, in case of camunda, it would be topic for [Message End Event](https://docs.camunda.org/manual/7.20/reference/bpmn20/events/message-events/#message-end-event) node. To use this command, use the topic - `end-task`

## Incoming and Outgoing Connectors

Task service needs an `IIncomingConnector` and an `IOutgoingConnectors` implementation to send and receive events from and to an external source. By default, task service comes with 2 different sets of connectors. Note that you can use different types of incoming and outgoing connectors (For e.g. Incoming events are received through Kafka but outgoing events go to a webhook subcriptions using Http)

#### Kafka

This set of connectors implements connectors to receive and send events through Kafka. It can be bound as both incoming and outgoing connector and needs an extra binding of an adapter for adapting kafka events to the type expected by the task service. You need to install [kafkajs](https://kafka.js.org/) to use these connectors - `npm i kafkajs`

```ts
// Bind the config for Kafka connectors
this.bind(TaskServiceKafkaModule.CONFIG).to({
  // this part is required for both incoming and outgoing connectors
  connection: {
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: [...(process.env.KAFKA_SERVER?.split(',') ?? ['localhost:9092'])],
    ...(process.env.KAFKA_SSL === 'true'
      ? {
          ssl: true,
        }
      : {}),
  },
  // this part is required only if you use it as an incoming connector
  consumer: {
    groupId: process.env.KAFKA_GROUP_ID ?? 'task-service',
  },
  topics: ['sow.update'], // topics for receiving events
  // this part is required only if you use it as an outgoing connector
  producer: {},
  output: {
    topic: 'test', // topic for output events
  },
});

// bind the connector as an incoming connector if required
this.bind(TaskServiceBindings.INCOMING_CONNECTOR).toClass(KafkaStreamService);
// bind the connector as an outgoing connector if required
this.bind(TaskServiceBindings.OUTGOING_CONNECTOR).toClass(KafkaStreamService);
// bind the default adapter (it is available in `@sourceloop/task-service/kafka`)
this.bind(TaskServiceKafkaModule.ADAPTER).toClass(KafkaEventAdapter);
```

#### HTTP

This set of connector implement code to send and receive events through HTTP calls.

```ts
// this line binds both the incoming and outgoing connectors plus some controllers required by the both
this.component(TaskHttpComponent);
// you can override either of the connectors by adding a new binding for them after the above
```

##### Incoming connector

- it receives events through the endpoint - `/events/trigger`
- the payload for this endpoint looks something like this -

```json
{
  "key": "event",
  "payload": {
    "name": "test",
    "description": "description"
  },
  "source": "test-source",
  "description": "description"
}
```

##### Outgoing connector

- The outgoing connector publishes events to all the webhook subcriptions
- A webhook subscription is created by hitting the `/webhooks/subscribe` endpoint with a payload that looks something like this -

```json
{
  "url": "http://localhost:3000", // the url that will hit with the payload for every outgoing event
  "key": "event-key" // the event keys for which this url would be hit
}
```

and a couple of required request headers - `x-api-key` and `x-api-secret`.

- values for these headers are generated through another endpoint - `/client-apps`. This endpoint is supposed to be hit once by each new client and returns newly generated key and secret that are used for sending and verifying webhook calls. The call to the `/client-apps`
  expects following body -

```json
{
  "clientName": "dummyName"
}
```

- each webhook call also sends two headers - `x-task-signature` and `x-task-timestamp` to help validate the authenticity of the webhook calls by the client. This signature can be validated by the client by generating an HMAC using the event payload and the timestamp. A sample node.js code on how to do this is given below -

```js
function validateSignature(request) {
  const signature = request.headers['x-task-signature'];
  const timestamp = request.headers['x-task-timestampt'];
  const payload = request.body;
  // the secret in this line is the one generated by the /client-apps endpoint
  const hmac = createHmac('sha256', yourApiSecret);
  hmac.update(`${JSON.stringify(event)}:${timestamp}`);
  const expectedSignature = hmac.digest('hex');
  if (
    // compare both the strings
    !crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature),
    )
  ) {
    // throw an error if signature does not match
    throw new HttpErrors.Unauthorized(INVALID_WEBHOOK_SIGNATURE);
  }
  return true;
}
```

### Using with Sequelize

This service supports Sequelize as the underlying ORM using [@loopback/sequelize](https://www.npmjs.com/package/@loopback/sequelize) extension. And in order to use it, you'll need to do following changes.

1.To use Sequelize in your application, add following to application.ts:

```ts
this.bind(TaskServiceBindings.CONFIG).to({
  useCustomSequence: false,
  useSequelize: true,
});
```

2. Use the `SequelizeDataSource` in your audit datasource as the parent class. Refer [this](https://www.npmjs.com/package/@loopback/sequelize#step-1-configure-datasource) for more details.

### Asymmetric Token Signing and Verification

If you are using asymmetric token signing and verification, you should have auth datasource present in the service and auth redis datasource on the facade level. Example datasource file for auth database is:-

Auth DB datasource :-

```ts
import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {AuthDbSourceName} from '@sourceloop/core';
const DEFAULT_MAX_CONNECTIONS = 25;
const DEFAULT_DB_IDLE_TIMEOUT_MILLIS = 60000;
const DEFAULT_DB_CONNECTION_TIMEOUT_MILLIS = 2000;

const config = {
  name: 'auth',
  connector: 'postgresql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  schema: process.env.DB_SCHEMA,
  password: process.env.DB_PASSWORD,
  database: process.env.AUTH_DB,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class AuthDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = AuthDbSourceName;

  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.auth', {optional: true})
    dsConfig: object = config,
  ) {
    if (!!+(process.env.ENABLE_DB_CONNECTION_POOLING ?? 0)) {
      const dbPool = {
        max: +(process.env.DB_MAX_CONNECTIONS ?? DEFAULT_MAX_CONNECTIONS),
        idleTimeoutMillis: +(
          process.env.DB_IDLE_TIMEOUT_MILLIS ?? DEFAULT_DB_IDLE_TIMEOUT_MILLIS
        ),
        connectionTimeoutMillis: +(
          process.env.DB_CONNECTION_TIMEOUT_MILLIS ??
          DEFAULT_DB_CONNECTION_TIMEOUT_MILLIS
        ),
      };

      dsConfig = {...dsConfig, ...dbPool};
    }

    super(dsConfig);
  }
}
```

Auth Cache Redis Datasource:-

```ts
import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {AnyObject, juggler} from '@loopback/repository';
import {readFileSync} from 'fs';
import {AuthCacheSourceName} from '@sourceloop/core';

const config = {
  name: process.env.REDIS_NAME,
  connector: 'kv-redis',
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  db: process.env.REDIS_DATABASE,
  url: process.env.REDIS_URL,
  tls:
    +process.env.REDIS_TLS_ENABLED! && process.env.REDIS_TLS_CERT
      ? {
          ca: readFileSync(process.env.REDIS_TLS_CERT),
        }
      : undefined,
  sentinels:
    +process.env.REDIS_HAS_SENTINELS! && process.env.REDIS_SENTINELS
      ? JSON.parse(process.env.REDIS_SENTINELS)
      : undefined,
  sentinelPassword:
    +process.env.REDIS_HAS_SENTINELS! && process.env.REDIS_SENTINEL_PASSWORD
      ? process.env.REDIS_SENTINEL_PASSWORD
      : undefined,
  role:
    +process.env.REDIS_HAS_SENTINELS! && process.env.REDIS_SENTINEL_ROLE
      ? process.env.REDIS_SENTINEL_ROLE
      : undefined,
};

@lifeCycleObserver('datasource')
export class RedisDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static readonly dataSourceName = AuthCacheSourceName;
  static readonly defaultConfig = config;

  constructor(
    @inject(`datasources.config.${process.env.REDIS_NAME}`, {optional: true})
    dsConfig: AnyObject = config,
  ) {
    if (
      +process.env.REDIS_HAS_SENTINELS! &&
      !!process.env.REDIS_SENTINEL_HOST &&
      !!process.env.REDIS_SENTINEL_PORT
    ) {
      dsConfig.sentinels = [
        {
          host: process.env.REDIS_SENTINEL_HOST,
          port: +process.env.REDIS_SENTINEL_PORT,
        },
      ];
    }
    super(dsConfig);
  }
}
```
