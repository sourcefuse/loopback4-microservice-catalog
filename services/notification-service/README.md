# notification-service

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)


## Overview

Microservice for handling notifications to users through real time notifications, email, or SMS. This microservice uses the [loopback4-notifications](https://www.npmjs.com/package/loopback4-notifications) module to publish/send the notifications.

### Installation

```bash
npm i @sourceloop/notification-service
```

### Usage

 - Create a new Loopback4 Application (If you don't have one already)
	`lb4 testapp` 
 - Install the notification service
	 `npm i @sourceloop/notification-service`
 - Install the loopback4-notifications module -
   `npm i loopback4-notifications`
 - Set the [environment variables](#environment-variables).
 - Run the [migrations](#migrations).
 - Add the `NotificationServiceComponent` to your Loopback4 Application (in `application.ts`).
	  ``` typescript
	  // add Component for AuthenticationService
	  this.component(NotificationServiceComponent);
	```
  - Set up a [Loopback4 Datasource](https://loopback.io/doc/en/lb4/DataSource.html) with `dataSourceName` property set to 
	`NotifDbSourceName`. You can see an example datasource [here](#setting-up-a-datasource).
 - **Email Notifications with Amazon SES** - 
    - Bind the SES Config to the `SESBindings.Config` key - 
    ``` typescript
    this.bind(SESBindings.Config).to({
      accessKeyId: process.env.SES_ACCESS_KEY_ID,
      secretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
      region: process.env.SES_REGION,
    });
    ```
    - Implement an SES Provider(refer [this](https://github.com/sourcefuse/loopback4-notifications/tree/master/src/providers/email/ses)) or you can import the default SES provider from the [loopback4-notifications](https://www.npmjs.com/package/loopback4-notifications) module and bind it to the `NotificationBindings.EmailProvider` key as described [here](https://github.com/sourcefuse/loopback4-notifications#email-notifications).

 - **Email Notifications with Nodemailer** -
    - Bind the Nodemailer Config to the `NodemailerBindings.Config` key - 
    ``` typescript
    this.bind(NodemailerBindings.Config).to({
      pool: true,
      maxConnections: 100,
      url:"",
      host: "smtp.example.com",
      port: 80,
      secure: false,
      auth: {
       user: "username",
       pass: "password"
      },
      tls: {
        rejectUnauthorized: true
       }
    });
    ```
    - Implement a Nodemailer Provider(refer [this](https://github.com/sourcefuse/loopback4-notifications/tree/master/src/providers/email/nodemailer)) or import the default Nodemailer provider from the [loopback4-notifications](https://www.npmjs.com/package/loopback4-notifications) module and bind it to the `NotificationBindings.EmailProvider` key as described [here](https://github.com/sourcefuse/loopback4-notifications#email-notifications), 

 - **SMS Notification with Amazon SNS** - 
    - Bind the SNS Config to the `SNSBindings.Config` key - 
    ``` typescript
    this.bind(SNSBindings.Config).to({
      accessKeyId: process.env.SNS_ACCESS_KEY_ID,
      secretAccessKey: process.env.SNS_SECRET_ACCESS_KEY,
      region: process.env.SNS_REGION,
    });
    ```
    - Implement an SnsProvider(refer [this](https://github.com/sourcefuse/loopback4-notifications/tree/master/src/providers/sms/sns)) or import the default SNS provider from the [loopback4-notifications](https://www.npmjs.com/package/loopback4-notifications) module and bind it to the `NotificationBindings.SMSProvider` key -
    ``` typescript
    import {
      NotificationBindings,
      SnsProvider // or your own provider
    } from 'loopback4-notifications';
    ...
    this.bind(NotificationBindings.SMSProvider).toProvider(SnsProvider);
    ...
    ```
    
 - **Push Notifications with Pubnub** - 
    - Bind the Pubnub Config to the `PubNubProvider.Config` key - 
    ``` typescript
    this.bind(PubnubBindings.Config).to({
      subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
      publishKey: process.env.PUBNUB_PUBLISH_KEY,
      secretKey: process.env.PUBNUB_SECRET_KEY,
      ssl: true,
      logVerbosity: true,
      uuid: 'my-app',
      cipherKey: process.env.PUBNUB_CIPHER_KEY,
      apns2Env: 'production',
      apns2BundleId: 'com.app.myapp'
    });
    ```
    - Implement a Pubnub Provider(refer [this](https://github.com/sourcefuse/loopback4-notifications/tree/master/src/providers/push/pubnuba)) or import the default Pubnub provider from the [loopback4-notifications](https://www.npmjs.com/package/loopback4-notifications) module and bind it to the `NotificationBindings.PushProvider` key -
    ``` typescript
    import {
      NotificationBindings,
      PubNubProvider //or your own provider
    } from 'loopback4-notifications';
    ...
    this.bind(NotificationBindings.PushProvider).toProvider(PubNubProvider);
    ...
    ```
 - **Push Notifications with Socket.io** -
    - Bind the Socket.io Config to the `SocketBindings.Config` key - 
    ``` typescript
    this.bind(SocketBindings.Config).to({
      url: process.env.SOCKETIO_SERVER_URL
    });
    ```
    - Implement a SocketIO Provider(refer [this](https://github.com/sourcefuse/loopback4-notifications/tree/master/src/providers/push/socketio)) or import the default Socket.io provider from the [loopback4-notifications](https://www.npmjs.com/package/loopback4-notifications) module and bind it to the `NotificationBindings.PushProvider` key -
    ``` typescript
    import {
      NotificationBindings,
      SocketIOProvider // or your own provider
    } from 'loopback4-notifications';
    ...
    this.bind(NotificationBindings.PushProvider).toProvider(SocketIOProvider);
    ...
    ```
 - Start the application
	`npm start`

### Create Notification Payload Structures

#### Email Notification with SES

``` typescript
  interface SESMessage {
    receiver: {
      to: {
          id: string; //Email address
          name?: string;
      }[];
    },
    subject: string;
    body: string;
    sentDate: Date;
    type: 1; //Email
    options?: {
      fromEmail: string, // We do not support attachments with SES Provider yet.
    };
  }
```
#### Email Notification with Nodemailer

``` typescript
  interface NodemailerMessage {
      receiver: {
          to: {
              id: string; //Email address
              name?: string;
          }[];
      },
      subject: string;
      body: string;
      sentDate: Date;
      type: 1; //Email
      options?: {
          from: string,
          subject?: string,
          text?: string,
          html?: string,
          attachments?: {
              filename?: string | false;
              cid?: string;
              encoding?: string;
              contentType?: string;
              contentTransferEncoding?: '7bit' | 'base64' | 'quoted-printable' | false;
              contentDisposition?: 'attachment' | 'inline';
              headers?: Headers;
              raw?: string | Buffer | Readable | {
                                                    content?: string | Buffer | Readable;
                                                    path?: string | Url;
                                                 };
          }[]
      };
  }
```

#### SMS Notification with SNS

``` typescript
  interface SMSMessage {
    receiver: {
      to: {
        id: string; // TopicArn or PhoneNumber
        name?: string;
      }[]
    };
    subject: undefined;
    body: string;
    sentDate: Date;
    type: 2; //SMS
    options?: {
      messageType: any,
    };
  }
```

#### Push Notification with Pubunb

``` typescript
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
        sound: string,
    };
  }
```

#### Push Notification with Socket.io

``` typescript
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
        path?: string,
    };
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
export class NotificationDbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
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

The migrations required for this service are processed during the installation automatically if you set the `NOTIF_MIGRATION` or `SOURCELOOP_MIGRATION` env variable. The migrations use [`db-migrate`](https://www.npmjs.com/package/db-migrate) with [`db-migrate-pg`](https://www.npmjs.com/package/db-migrate-pg) driver for migrations, so you will have to install these packages to use auto-migration. Please note that if you are using some pre-existing migrations or database, they may be effected. In such scenario, it is advised that you copy the migration files in your project root, using the `NOTIF_MIGRATION_COPY` or `SOURCELOOP_MIGRATION_COPY` env variables. You can customize or cherry-pick the migrations in the copied files according to your specific requirements and then apply them to the DB.

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
