# video-conferencing-service

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

Various features of Video Conferencing Services:

1. Schedule Meetings and Generate Token
   Book on demand meetings or schedule meetings and generate token which is required for connection to a session/room on the client side.

2. List Archives
   Get a specific archive or list a set of archives for the recorded meetings.

3. Configure storage target
   Set Storage settings to store archives to custom s3 bucket or Microsoft Azure Storage.

4. Webhook Events
   Webhook Events (such as session or webhook) when configured receive events from third party. These events are used to store session attendees or store archive information.
   For Vonage, you need to add this microserivce server url in your current vonage project
   so it will receive webhook events. See [Vonage Documentation](https://developer.nexmo.com/documentation) for more information.

You can see the database schema [here](#database-schema).

To get started with a basic implementation of this service, see [/sandbox/video-conferencing-ms-example](https://github.com/sourcefuse/loopback4-microservice-catalog/tree/master/sandbox/video-conferencing-ms-example).

## Install

```sh
npm i @sourceloop/video-conferencing-service
```

## Usage

- Create a new Loopback4 Application (If you don't have one already)
  `lb4 testapp`
- Install the video conferencing service
  `npm i @sourceloop/video-conferencing-service`
- Set the [environment variables](#environment-variables).
- Run the [migrations](#migrations).
- Bind Vonage config to the `VonageBindings.Config` key -
  ```typescript
  this.bind(VonageBindings.Config).to({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET,
    timeToStart: 0, // time in minutes, meeting can not be started 'timeToStart' minutes before the scheduled time
  });
  ```
- Add the `VideoConfServiceComponent` to your Loopback4 Application (in `application.ts`).
  ```typescript
  // import the component for VideoConfService
  import { VideoConfServiceComponent } from '@sourceloop/video-conferencing-service';
  ...
  // add VideoConfServiceComponent inside the application class
  this.component(VideoConfServiceComponent);
  ...
  ```
- Set up a [Loopback4 Datasource](https://loopback.io/doc/en/lb4/DataSource.html) with `dataSourceName` property set to `VideoConfDatasource`. You can see an example datasource [here](#setting-up-a-datasource).
- Start the application
  `npm start`

## Working and Flow
![video](https://user-images.githubusercontent.com/82804130/126984338-754c0788-270a-40df-b601-ff66dcd3d5f8.jpg)


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
DB_DATABASE=video_conferencing_db
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

Here is a sample Implementation `DataSource` implementation using environment variables and PostgreSQL as the data source.

```typescript
import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {VideoConfDatasource} from '@sourceloop/video-conferencing-service';

const config = {
  name: VideoConfDatasource,
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
export class VideoDbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = VideoConfDatasource;
  static readonly defaultConfig = config;

  constructor(
    @inject(`datasources.config.${VideoConfDatasource}`, {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
```

## Database Schema

![canva-photo-editor](https://user-images.githubusercontent.com/82804130/126635878-4e39ce2c-e48d-4a67-9c81-6a5f8ee9b70e.png)

## Migrations

The migrations required for this service are processed during the installation automatically if you set the `VIDEOCONF_MIGRATION` or `SOURCELOOP_MIGRATION` env variable. The migrations use [`db-migrate`](https://www.npmjs.com/package/db-migrate) with [`db-migrate-pg`](https://www.npmjs.com/package/db-migrate-pg) driver for migrations, so you will have to install these packages to use auto-migration. Please note that if you are using some pre-existing migrations or database, they may be effected. In such scenario, it is advised that you copy the migration files in your project root, using the `VIDEOCONF_MIGRATION_COPY` or `SOURCELOOP_MIGRATION_COPY` env variables. You can customize or cherry-pick the migrations in the copied files according to your specific requirements and then apply them to the DB.

## API's Details

Visit the [OpenAPI spec docs](./openapi.md)

## Feedback

If you've noticed a bug or have a question or have a feature request, [search the issue tracker](https://github.com/sourcefuse/loopback4-microservice-catalog/issues) to see if someone else in the community has already created a ticket.
If not, go ahead and [make one](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/new/choose)!
All feature requests are welcome. Implementation time may vary. Feel free to contribute the same, if you can.
If you think this extension is useful, please [star](https://help.github.com/en/articles/about-stars) it. Appreciation really helps in keeping this project alive.
