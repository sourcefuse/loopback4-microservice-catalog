# video-conferencing-service

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

Various features of Video Conferncing Services: 

1. Schedule Meetings and Generate Token
    Book on demand meetings or schedule meetings and generate token which is required for connection to a session/room on the client side.

2. List Archives 
    Get a specific archive or list a set of archives for the recorded meetings.

3. Configure storage target
    Set Storage settings to store archives to custom s3 bucket or Microsoft Azure Storage.

4. Webhook Events
    Webhook Events (such as session or webhook) when configured receive events from third party. These events are used to store session attendees or store archive information.
    For Vonage, you need to add this microserivce server url in your current vonage project 
    so it will receive webhook events. See Vonage Documentation for more information.

## Install 

```sh
npm i @sourceloop/video-conferencing-service
```

## Usage - integrating with main app

In order to use this component into your LoopBack application, please follow below steps.

Add component to application.

```ts
....
import { VideoConfServiceComponent } from '@sourceloop/video-conferencing-service';

export class ClientComponent extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    ....
    this.component(VideoConfServiceComponent);
    ....
  }
}
```

## DB migrations

The migrations required for this service are processed during the installation automatically if you set the `VIDEOCONF_MIGRATION` or `SOURCELOOP_MIGRATION` env variable. The migrations use [`db-migrate`](https://www.npmjs.com/package/db-migrate) with [`db-migrate-pg`](https://www.npmjs.com/package/db-migrate-pg) driver for migrations, so you will have to install these packages to use auto-migration. Please note that if you are using some pre-existing migrations or database, they may be effected. In such scenario, it is advised that you copy the migration files in your project root, using the `VIDEOCONF_MIGRATION_COPY` or `SOURCELOOP_MIGRATION_COPY` env variables. You can customize or cherry-pick the migrations in the copied files according to your specific requirements and then apply them to the DB.

## Using config

```ts
....
export class VideoConfServiceComponent extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    ....
    this.component(SchedulerComponent);
    // example showing Vonage Binding
    this.bind(VonageBindings.Config).to({
        apiKey: process.env.VONAGE_API_KEY;
        apiSecret: process.env.VONAGE_API_SECRET;
    });
    ....
  }
}
```

## APIs available (Currently Vonage is Supported) 

1. Session Creation and Generating Token

### POST /session
Used for Creating a session with options such as end to end encryption, archive mode.
Note: Archving Option cannot be enabled while using end to end encryption, otherwise an Error will be thrown.
Successful execution will send a meeting link id which can be used to amend in client url.

### POST /session/{meetingLinkId}/token
Used for Generating token, which is used for connecting to a room/session on a client side.
In vonage, there are three different roles (Moderator, Subscriber, Publisher).
We can use expire time for limited validity of a token.
Successful execution will send a token.

### PATCH /session/{meetingLinkId}/end
Used to stop the current active meeting. Meeting cannot be stopped again if it is already stopped.
Successful execution will add the endTime attribute to a recently ending session.

2. List and deleting Archive(s) 

### GET /archives
Used to fetch a list of archives (meetings that were recorded).

### GET /archives/{archiveId}
Used to fetch a specific archive w.r.t archiveId.
If archive is not present, it will throw HTTP Not Found Error.

### DELETE /archives/{archiveId}
Used to delete a specific archive w.r.t archiveId.
If archive is not present, it will throw HTTP Not Found Error.

3. Session Webhook

### POST /webhooks/session
Webhook API hit from a third party to add/update session attendees in a meeting.
For configuration in vonage, see [Session Monitoring](https://tokbox.com/developer/guides/session-monitoring/)


4. Storage Target

### PUT /archives/storage-target
Configures custom storage target to a custom Amazon s3 bucket or Microsoft Azure Storage.


## Feedback
If you've noticed a bug or have a question or have a feature request, [search the issue tracker](https://github.com/sourcefuse/loopback4-microservice-catalog/issues) to see if someone else in the community has already created a ticket.
If not, go ahead and [make one](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/new/choose)!
All feature requests are welcome. Implementation time may vary. Feel free to contribute the same, if you can.
If you think this extension is useful, please [star](https://help.github.com/en/articles/about-stars) it. Appreciation really helps in keeping this project alive.
