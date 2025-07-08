# @sourceloop/notification-service

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

![npm](https://img.shields.io/npm/dm/@sourceloop/notification-service)

![node-current (scoped)](https://img.shields.io/node/v/@sourceloop/notification-service)

![npm (prod) dependency version (scoped)](https://img.shields.io/npm/dependency-version/@sourceloop/notification-service/@loopback/core)

## Overview

Microservice for handling notifications to users through real time notifications, email, or SMS. This microservice uses the [loopback4-notifications](https://www.npmjs.com/package/loopback4-notifications) module to publish/send the notifications.

### Installation

```bash
npm i @sourceloop/notification-service
```

### Usage

- Install the notification service
  `npm i @sourceloop/notification-service`
- Install the loopback4-notifications module -
  `npm i loopback4-notifications`
- Set the [environment variables](#environment-variables).
- Run the [migrations](#migrations).
- Add the `NotificationServiceComponent` to your Loopback4 Application (in `application.ts`).
  ```typescript
  // add Component for NotificationService
  this.component(NotificationServiceComponent);
  ```
- Set up a [Loopback4 Datasource](https://loopback.io/doc/en/lb4/DataSource.html) with `dataSourceName` property set to
  `NotifDbSourceName`. You can see an example datasource [here](#setting-up-a-datasource).
- Using this service you can send Email, SMS and push notifications. Steps to add any of these are described below. You may choose to add one or more of these depending on your requirement.

- **Email Notifications with Amazon SES** -

  - Bind the SES Config to the `SESBindings.Config` key -

    ```typescript
    this.bind(SESBindings.Config).to({
      accessKeyId: process.env.SES_ACCESS_KEY_ID,
      secretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
      region: process.env.SES_REGION,
    });
    ```

  - Implement an SES Provider(refer [this](https://github.com/sourcefuse/loopback4-notifications/tree/master/src/providers/email/ses)) or you can import the default SES provider from the [loopback4-notifications](https://www.npmjs.com/package/loopback4-notifications) module and bind it to the `NotificationBindings.EmailProvider` key as described [here](https://github.com/sourcefuse/loopback4-notifications#email-notifications).

- **Email Notifications with Nodemailer** -

  - Bind the Nodemailer Config to the `NodemailerBindings.Config` key -

  ```typescript
  this.bind(NodemailerBindings.Config).to({
    pool: true,
    maxConnections: 100,
    url: '',
    host: 'smtp.example.com',
    port: 80,
    secure: false,
    auth: {
      user: 'username',
      pass: 'password',
    },
    tls: {
      rejectUnauthorized: true,
    },
  });
  ```

  - Implement a Nodemailer Provider(refer [this](https://github.com/sourcefuse/loopback4-notifications/tree/master/src/providers/email/nodemailer)) or import the default Nodemailer provider from the [loopback4-notifications](https://www.npmjs.com/package/loopback4-notifications) module and bind it to the `NotificationBindings.EmailProvider` key as described [here](https://github.com/sourcefuse/loopback4-notifications#email-notifications),

- **SMS Notification with Amazon SNS** -
  - Bind the SNS Config to the `SNSBindings.Config` key -
  ```typescript
  this.bind(SNSBindings.Config).to({
    accessKeyId: process.env.SNS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SNS_SECRET_ACCESS_KEY,
    region: process.env.SNS_REGION,
  });
  ```
  - Implement an SnsProvider(refer [this](https://github.com/sourcefuse/loopback4-notifications/tree/master/src/providers/sms/sns)) or import the default SNS provider from the [loopback4-notifications](https://www.npmjs.com/package/loopback4-notifications) module and bind it to the `NotificationBindings.SMSProvider` key -
  ```typescript
  import {NotificationBindings} from 'loopback4-notifications';
  import {SnsProvider} from 'loopback4-notifications/sns'; // or your own provider
  ...
  this.bind(NotificationBindings.SMSProvider).toProvider(SnsProvider);
  ...
  ```
- **Push Notifications with Pubnub** -
  - Bind the Pubnub Config to the `PubnubBindings.Config` key -
  ```typescript
  this.bind(PubnubBindings.Config).to({
    subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
    publishKey: process.env.PUBNUB_PUBLISH_KEY,
    secretKey: process.env.PUBNUB_SECRET_KEY,
    ssl: true,
    logVerbosity: true,
    uuid: 'my-app',
    cipherKey: process.env.PUBNUB_CIPHER_KEY,
    apns2Env: 'production',
    apns2BundleId: 'com.app.myapp',
  });
  ```
  - Implement a Pubnub Provider(refer [this](https://github.com/sourcefuse/loopback4-notifications/tree/master/src/providers/push/pubnuba)) or import the default Pubnub provider from the [loopback4-notifications](https://www.npmjs.com/package/loopback4-notifications) module and bind it to the `NotificationBindings.PushProvider` key -
  ```typescript
  import {NotificationBindings} from 'loopback4-notifications';
  import {PubNubProvider} from 'loopback4-notifications/pubnub';  //or your own provider
  ...
  this.bind(NotificationBindings.PushProvider).toProvider(PubNubProvider);
  ...
  ```
- **Push Notifications with Socket.io** -

  - Bind the Socket.io Config to the `SocketBindings.Config` key -

  ```typescript
  this.bind(SocketBindings.Config).to({
    url: process.env.SOCKETIO_SERVER_URL,
  });
  ```

  - Implement a SocketIO Provider(refer [this](https://github.com/sourcefuse/loopback4-notifications/tree/master/src/providers/push/socketio)) or import the default Socket.io provider from the [loopback4-notifications](https://www.npmjs.com/package/loopback4-notifications) module and bind it to the `NotificationBindings.PushProvider` key -

  ```typescript
  import {NotificationBindings} from 'loopback4-notifications';
  import {SocketIOProvider} from 'loopback4-notifications/socketio';  //or your own provider
  ...
  this.bind(NotificationBindings.PushProvider).toProvider(SocketIOProvider);
  ...
  ```

- Start the application
  `npm start`

### Create Notification Payload Structures

#### Email Notification with SES

```typescript
interface SESMessage {
  receiver: {
    to: {
      id: string; //Email address
      name?: string;
    }[];
  };
  subject: string;
  body: string;
  sentDate: Date;
  type: 1; //Email
  options?: {
    fromEmail: string; // We do not support attachments with SES Provider yet.
  };
}
```

#### Email Notification with Nodemailer

```typescript
interface NodemailerMessage {
  receiver: {
    to: {
      id: string; //Email address
      name?: string;
    }[];
  };
  subject: string;
  body: string;
  sentDate: Date;
  type: 1; //Email
  options?: {
    from: string;
    subject?: string;
    text?: string;
    html?: string;
    attachments?: {
      filename?: string | false;
      cid?: string;
      encoding?: string;
      contentType?: string;
      contentTransferEncoding?: '7bit' | 'base64' | 'quoted-printable' | false;
      contentDisposition?: 'attachment' | 'inline';
      headers?: Headers;
      raw?:
        | string
        | Buffer
        | Readable
        | {
            content?: string | Buffer | Readable;
            path?: string | Url;
          };
    }[];
  };
}
```

#### SMS Notification with SNS

```typescript
interface SMSMessage {
  receiver: {
    to: {
      id: string; // TopicArn or PhoneNumber
      name?: string;
    }[];
  };
  subject: undefined;
  body: string;
  sentDate: Date;
  type: 2; //SMS
  options?: {
    messageType: any;
  };
}
```

#### Push Notification with Pubunb

```typescript
interface PubNubMessage {
  receiver: {
    to: {
      type: 0; //Channel Type
      id: string; //Channel identifier
      name?: string;
    }[];
  };
  subject: string;
  body: string;
  sentDate: Date;
  type: 0; //Push Notification
  options?: {
    sound: string;
  };
}
```

#### Push Notification with Socket.io

```typescript
interface SocketMessage {
  receiver: {
    to: {
      type: 0; //Channel Type
      id: string; //Channel identifier
      name?: string;
    }[];
  };
  subject: string;
  body: string;
  sentDate: Date;
  type: 0; //Push Notification
  options?: {
    path?: string;
  };
}
```

### Using with Sequelize

This service supports Sequelize as the underlying ORM using [@loopback/sequelize](https://www.npmjs.com/package/@loopback/sequelize) extension. And in order to use it, you'll need to do following changes.

1.To use Sequelize in your application, add following to application.ts:

```ts
this.bind(NotifServiceBindings.Config).to({
  useCustomSequence: false,
  useSequelize: true,
});
```

2. Use the `SequelizeDataSource` in your audit datasource as the parent class. Refer [this](https://www.npmjs.com/package/@loopback/sequelize#step-1-configure-datasource) for more.

### Blacklisting Users

Here is a sample implementation of how we can blacklist a user(s).

Create a new provider:

```typescript
import {BindingScope, injectable, Provider} from '@loopback/core';
import {
  INotificationFilterFunc,
  Notification,
} from '@sourceloop/notification-service';

@injectable({scope: BindingScope.TRANSIENT})
export class NotificationfilterProvider
  implements Provider<INotificationFilterFunc>
{
  constructor() {}

  value() {
    return async (notif: Notification) => this.notificationFilterFunc(notif);
  }

  blacklistedUsers = ['id1', 'id2']; //ID's of blacklisted users

  notificationFilterFunc(notif: Notification) {
    const receivers = notif!.receiver.to;
    const result = receivers.filter(receiver => {
      return this.blacklistedUsers.indexOf(receiver.id) === -1;
    });
    notif.receiver.to = result;
    return notif;
  }
}
```

Add the following line to `src/application.ts` file

```typescript
this.bind(NotifServiceBindings.NotificationFilter).toProvider(
  NotificationfilterProvider,
);
```

Note: One can modify the provider according to the requirements

### **Drafting Notification** -

Notification drafting i.e. draft or save notification to send it later.

1. For this, there is a POST API to save notification as draft. There is one column in DB in `notifications` table `is_draft` which is used to mark a notification as draft.
2. The drafted notification could be `based on a group key` OR `without a group key`. In DB group key is saved in a column called `group_key`.

   - There is a POST API with end url `/notifications/drafts` to save notification(s) as draft.
   - The draft notification request body `with group key` looks like:

     ```json
     {
       "body": "text",
       "groupKey": "text",
       "type": "number"
     }
     ```

   - The draft notification request body `without group key` looks like, e.g. the email notification draft:

     ```json
     {
       "body": "text",
       "body": "text",
       "type": "number",
       "receiver": {
         "to": [
           {
             "type": "number",
             "id": "text"
           }
         ]
       }
     }
     ```

### **Grouping Notification** -

Notification grouping i.e. send many notification as one notification by grouping those together using the `groupKey` OR `group_key` field from DB table.

1. There is an API's to send already saved or already drafted notifications by grouping it using `groupKey`.
2. The API end point looks like `/notifications/groups/{groupKey}`.
3. The request body of the API to send the grouped notification looks like below. Note that, this `example` request body is for email notification.

   ```json
   {
     "subject": "text",
     "receiver": {
       "to": [
         {
           "type": "number",
           "id": "text"
         }
       ]
     },
     "options": {
       "fromEmail": "string"
     },
     "isCritical": "boolean",
     "type": "number"
   }
   ```

   - In above request body one can add additional key to the json object in case they want to concatenate new thing in addition to saved drafts and then request body will look like below:

   ```json
   {
     "subject": "text",
     "body": "text",
     "receiver": {
       "to": [
         {
           "type": "number",
           "id": "text"
         }
       ]
     },
     "options": {
       "fromEmail": "string"
     },
     "isCritical": "boolean",
     "type": "number"
   }
   ```

### **Sending Drafted Notification Independently** -

There is one API for sending drafted notification independently using `id` of already saved or drafted notification.

1. This API has `id` (of an already drafted notification) in it's end point which looks like `/notifications/{draftedNotificationId}/send` and it sends already saved or drafted notification to the receiver(s).
2. The request body for this API looks like

   ```json
   {
     "options": {
       "fromEmail": "string"
     },
     "isCritical": "boolean"
   }
   ```

### **User Notification Sleep Time Settings** -

User or receiver's sleep time settings will allow user to stop from getting notifications for any given time interval. There are API's as mentioned below which are used to manage User notification settings for sleep time

1. There is a POST API with end url `/notifications/user-notification-settings` to add sleep time of user or receiver into DB. The request body for this looks like below:

   ```json
   {
     "userId": "text",
     "sleepStartTime": "timestamp",
     "sleepEndTime": "timestamp",
     "type": "number"
   }
   ```

2. There is a PATCH API with end url `/notifications/user-notification-settings/{id}` to update sleep time of user or receiver in DB. The request body for this looks like below:

   ```json
   {
     "userId": "text",
     "sleepStartTime": "timestamp",
     "sleepEndTime": "timestamp",
     "type": "number"
   }
   ```

3. There is a GET API with end url `/notifications/user-notification-settings` to get all sleep time settings of users or receivers from DB.
4. There is a GET API with end url `/notifications/user-notification-settings/{id}` to get sleep time setting of a user or a receiver from DB by given id.
5. There is a DELETE API with end url `/notifications/user-notification-settings/{id}` to delete sleep time setting of a user or a receiver from DB by given id.

- **Note:** _Sleep time is applicable for send grouped notification API as well as for send drafted notification by id except in case request body contains parameter `isCritical` and it's value is true. The value of field `isCritical` is saved in DB into the column named `is_critical`._
- **Send notification to users having sleep time in past:**
  - There is one POST API with end url `/notifications/send` which sends notifications to users (with respect a given search criteria in the request body) who where having sleep time when notifications were being sent (in past). For this API the request body looks like:
    ```json
    {
      "ids": ["text"],
      "userId": ["text"],
      "startTime": "timestamp",
      "endTime": "timestamp"
    }
    ```
  - Based on given search criteria in the request body, this API finds the receiver(s) and the respective notifications which could not be sent due to the receiver's sleep time interval and sends it.
- **Note:** To use this feature in your application, please run the required migrations. Also if one want to make some logical changes they can make changes in the provider.

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

### Environment Variables

| Name          | Required | Default Value | Description                                                                                                                        |
| ------------- | -------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `NODE_ENV`    | Y        |               | Node environment value, i.e. `dev`, `test`, `prod`                                                                                 |
| `LOG_LEVEL`   | Y        |               | Log level value, i.e. `error`, `warn`, `info`, `verbose`, `debug`                                                                  |
| `DB_HOST`     | Y        |               | Hostname for the database server.                                                                                                  |
| `DB_PORT`     | Y        |               | Port for the database server.                                                                                                      |
| `DB_USER`     | Y        |               | User for the database.                                                                                                             |
| `DB_PASSWORD` | Y        |               | Password for the database user.                                                                                                    |
| `DB_DATABASE` | Y        |               | Database to connect to on the database server.                                                                                     |
| `DB_SCHEMA`   | Y        |               | Database schema used for the data source. In PostgreSQL, this will be `public` unless a schema is made explicitly for the service. |
| `JWT_SECRET`  | Y        |               | Symmetric signing key of the JWT token.                                                                                            |
| `JWT_ISSUER`  | Y        |               | Issuer of the JWT token.                                                                                                           |

### Setting up a `DataSource`

Here is a sample Implementation `DataSource` implementation using environment variables and PostgreSQL as the data source.

```typescript
import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {NotifDbSourceName} from '@sourceloop/notification-service';

const config = {
  name: NotifDbSourceName,
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
export class NotificationDbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = NotifDbSourceName;
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

### Migrations

The migrations required for this service are processed during the installation automatically if you set the `NOTIF_MIGRATION` or `SOURCELOOP_MIGRATION` env variable. The migrations use [`db-migrate`](https://www.npmjs.com/package/db-migrate) with [`db-migrate-pg`](https://www.npmjs.com/package/db-migrate-pg) driver for migrations, so you will have to install these packages to use auto-migration. Please note that if you are using some pre-existing migrations or databases, they may be affected. In such a scenario, it is advised that you copy the migration files in your project root, using the `NOTIF_MIGRATION_COPY` or `SOURCELOOP_MIGRATION_COPY` env variables. You can customize or cherry-pick the migrations in the copied files according to your specific requirements and then apply them to the DB.

This migration script supports both MySQL and PostgreSQL databases, controlled by environment variables. By setting MYSQL_MIGRATION to 'true', the script runs migrations using MySQL configuration files; otherwise, it defaults to PostgreSQL. .

Additionally, there is now an option to choose between SQL migration or PostgreSQL migration.
NOTE: For [`@sourceloop/cli`](https://www.npmjs.com/package/@sourceloop/cli?activeTab=readme) users, this choice can be specified during the scaffolding process by selecting the "type of datasource" option.

### API Documentation

#### Common Headers

Authorization: Bearer <token> where <token> is a JWT token signed using JWT issuer and secret.
`Content-Type: application/json` in the response and in request if the API method is NOT GET

#### Common Request path Parameters

{version}: Defines the API Version

### Common Responses

| Status | Description                                          |
| ------ | ---------------------------------------------------- |
| 200    | Successful Response. Response body varies w.r.t API  |
| 401    | Unauthorized: The JWT token is missing or invalid    |
| 403    | Forbidden : Not allowed to execute the concerned API |
| 404    | Entity Not Found                                     |
| 400    | Bad Request (Error message varies w.r.t API)         |
| 201    | No content: Empty Response                           |

## API's Details

Visit the [OpenAPI spec docs](./openapi.md)
