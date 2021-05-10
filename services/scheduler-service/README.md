# scheduler-service

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

This is a loopback4 component for scheduling events in calender (scheduler/calendar server).

Various features of Scheduler Service: 


1. CRUD feature: 
    Basic add/edit/delete Event/Invitation in calendar. (As a REST API)

2. Reminder Feature: 
    Support or provide integration with notification/reminder service, which has the option of sending email/popup and SMS notification.

3. Importing Calendar: 
    The Scheduler supports exporting all its event data to iCal format, and it supports importing events from an iCal file into the Scheduler.


4. Third party calendar support: 
    Provide a way to import events information from third party components like : Outlook and Google Calendar.

Main feature set:
- Calendar
- Calendar Subscription
- Working Hours
- Events
- Event Attendee
- Event Attachment


## Install 


```sh
npm install @sourceloop/scheduler-service
```

## Usage - integrating with main app

In order to use this component into your LoopBack application, please follow below steps.

Add component to application.

```ts
// application.ts
import {SchedulerComponent} from '@sourceloop/scheduler-service'; 
....
export class SchedulerServiceApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    ....
    this.component(SchedulerComponent);
    ....
  }
}
```

## DB migrations

The migrations required for this service are processed during the installation automatically if you set the `SCHEDULER_MIGRATION` or `SOURCELOOP_MIGRATION` env variable. The migrations use [`db-migrate`](https://www.npmjs.com/package/db-migrate) with [`db-migrate-pg`](https://www.npmjs.com/package/db-migrate-pg) driver for migrations, so you will have to install these packages to use auto-migration. Please note that if you are using some pre-existing migrations or database, they may be effected. In such scenario, it is advised that you copy the migration files in your project root, using the `SCHEDULER_MIGRATION_COPY` or `SOURCELOOP_MIGRATION_COPY` env variables. You can customize or cherry-pick the migrations in the copied files according to your specific requirements and then apply them to the DB.

#### Database Model

![db-schema](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/services/scheduler-service/migrations/scheduler_db_schema.png?raw=true)

## Using config

```ts
import {SchedulerComponent, SchedulerBindings} from '@sourceloop/scheduler-service'; 
....
export class SchedulerServiceApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    ....
    this.component(SchedulerComponent);
    this.bind(SchedulerBindings.Config).to({
        jwtIssuer: process.env.JWT_ISSUER;
        jwtSecret: process.env.JWT_SECRET;
    });
    ....
  }
}
```

## APIs available

### Calendar

Calendar is a primary feature which will be associated with an external identifier. It will hold the information for the user associated to it. 

Calendar module will have following api endpoints :

`GET /calendar`
    These requests will be available to everyone in the event to look at.

`GET /calendar/:id`
    These requests will be available to everyone in the event to look at.

`POST /calendar`
    This is an api to create a calendar for any user.
    Recommendation: Use this while adding a user to the main application, in order to create a primary calendar for that particular user.

`PUT /calendar/:id`
    This api is to update the calendar by passing an id. This action will be allowed only to the owner of the calendar or the admin. To identify the ‘owner’ we will check for the email passed in the token and the corresponding access level, whereas to identify the admin we will check for the permission. 

`DELETE /calendar/:id`
    This api is to update the calendar by passing an id. This action will be allowed only to the owner of the calendar or the admin. To identify the ‘owner’ we will check for the email passed in the token and the corresponding access level, whereas to identify the admin we will check for the permission.

**While creating the calendar there will be business logic to create Working hours and subscriptions. Creation of working hours will be entirely dependent on the key `enableWorkingHours` from calendar requests passed on from the consumer application.** 

### Calendar Subscription

This module will be responsible for maintaining the access level of the user and holding the meta data for this calendar. 
Metadata example: Calendar color, reminder settings, notification settings and more.
Calendar Subscription module will have following api endpoints:

`GET /calendar-subscription/:id`
 These requests will be available to the owner of the subscription.

`POST /calendar/:calendarId/calendar-subscription`

This is an api to create a calendar subscription for any calendar.

`PUT /calendar-subscription/:id`

 This api is to update the calendar subscription by passing an `id`. This action will be allowed only to the owner of the calendar or the admin. To identify the `owner` we will check for the email passed in the token and the corresponding access level, whereas to identify the admin we will check for the permission. 

`DELETE /calendar-subscription/:id`
 This api is to update the calendar subscription by passing an id. This action will be allowed only to the owner of the calendar or the admin. To identify the ‘owner’ we will check for the email passed in the token and the corresponding access level, whereas to identify the admin we will check for the permission.

* Calendar subscriptions hold two important fields, namely `accessRole` and `isPrimary`. 

* Access role defines the access that one user has over the calendar. This will decide how the user interacts with the calendar. It could either be read-only, write or owner level access.
  * `isPrimary` key represents whether the user is the owner and this is the primary calendar for the respective user or not.
  * Delete action won’t happen for primary subscription.

### Working Hours:

Working hours are related to Calendar. If the Calendar had ‘enableWorkingHours’ as true then we create these according to the data provided. These hold the data for working hours and the days for which these hours are applicable. 
Calendar module will have following api endpoints along with the business logic as described below:

`GET /working-hour/:id`
 These requests will be available to everyone to look at. This will be represent the work timings for the owner of the calendar. 

`POST /calendar/:calendarId/working-hour`
 This is an api to create a calendar for any user.

 **Recommendation**: Use this while adding a user to the main application, in order to create a primary calendar for that particular user.

`PUT /working-hour/:id`
 This api is to update the calendar by passing an `id`. This action will be allowed only to the owner of the calendar or the admin. To identify the `owner` we will check for the email passed in the token and the corresponding access level, whereas to identify the admin we will check for the permission. 

`DELETE /working-hour/:id`
 This api is to update the calendar by passing an `id`. This action will be allowed only to the owner of the calendar or the admin. To identify the ‘owner’ we will check for the email passed in the token and the corresponding access level, whereas to identify the admin we will check for the permission.

* While creating the calendar there will be business logic to create Working hours and subscriptions. Creation of working hours will be entirely dependent on the key `enableWorkingHours’`from calendar requests passed on from the consumer application. 
* Delete action won’t happen if only one `working_hour` entry is left in DB and the value for ‘enable_working_hour’ is set as true in Calendar.

### Events:

Events are the basic entity around which all our logic revolves. Events will hold the data related to attendees, event details, timings, organiser (email), etc.
Events module will have following api endpoints along with the business logic as described below:

`POST /events`
 While an organizer creates an event, we get participants details along with it. This api will check for slot availability of all the participants in that particular time slot. If the slot is free the event will be created.

 Events can be scheduled on behalf of someone else, In this case we will be saving the creator details (generally the organiser is the creator themselves, so we will be keeping the organiser and created_by the same).

`GET /events`
 This api will return the events data, based on the filter provided. Sending the data of participants will be optional and will depend on the query.

`GET /events/:id`
 This api will return events data based on the id. Sending the data of participants will be optional and will depend on the query.

`DELETE /events/:id`
 Api to delete the event based on id. The action is only allowed to the organiser or the admin(based on permission).

`PUT /events/:id`
 This api will be responsible for making any updates on an event. This action is only allowed to the organizer or the admin(based on permission).

`PATCH /events/:id`
 This api will be responsible for making any updates on an event. This action is only allowed to the organizer or the admin(based on permission).

* `parentEventId` corresponds to an event in the event table itself. If an event has a value against this key, it will be treated as recurring event for that particular event.
  * Updates for Creator name, Organizer details or Parent event Id won’t be accepted.
  * If event timings are changed then the responses given by the participants will be nullified and then the participants need to accept/reject the invitation again.
  * Event details from the past could not be updated.
  * Event attendees and attachments will be created, in case they were sent with the Event data.

### Event Attendee: 

All the actions under the event attendee module could be performed by the creator only (except for the get and patch functionality).

`GET /events/:id/event-attendee`
 Attendees are visible to everyone according to the access permissions provided to them.

`POST /events/:id/event-attendee`
 Attendees could be added to the event. This action could only be performed by the organizer

`PATCH /event-attendee/:attendeeId`
 Attendees can update details here. (Mainly accept or reject the invitation)

`DELETE /event-attendee/:attendeeId`
 Organiser is allowed to delete an attendee of an event. Event participants' details from the past could not be created or updated.

### Event Attachment

`GET /events/:id/attachment`
 These requests will be available to everyone in the event to look at.

`GET /attachment/:attachmentId`
 These requests will be available to everyone in the event to look at.

`POST /events/:id/attachment`

Organizer can add attachments to the event (if it was missed while creating event).

`PUT /attachment/:attachmentId`

Organizer can update details of the attachment.

`DELETE /attachment/:attachmentId`
 Organizer can delete the attachment.

* Event attachment from the past could not be created or updated.   

### Freebusy

Returns free/busy information for a set of calendars (primary calendars).

`POST /calendar/freeBusy`
 Returns free/busy information for a set of calendars.

### Global Settings  

Setting resources represent settings that users can configureI, such as the user's 
`timezone` - The ID of the user’s timezone.
`format24HourTime` - Whether to show the time in 24 hour format.
`weekStart` - Whether the week should start on Sunday (0), Monday (1) or Saturday (6).
They can be retrieved via list and get methods. Note that if a setting has its default value, it might not be returned.

`GET /settings/list`
 This api will return the settings data, based on the filter provided.

`GET /settings/:Id`
 These requests will be available to everyone in the setting to look at.

`POST /settings`
 Create any new settings

`PUT /settings/:id`
 Update setting.

`DELETE /settings/:id`
 Delete setting.

* Event settings from the past could not be created or updated.   

## Feedback
If you've noticed a bug or have a question or have a feature request, [search the issue tracker](https://github.com/sourcefuse/loopback4-notifications/issues) to see if someone else in the community has already created a ticket.
If not, go ahead and [make one](https://github.com/sourcefuse/loopback4-notifications/issues/new/choose)!
All feature requests are welcome. Implementation time may vary. Feel free to contribute the same, if you can.
If you think this extension is useful, please [star](https://help.github.com/en/articles/about-stars) it. Appreciation really helps in keeping this project alive.
## Contributing
Please read [CONTRIBUTING.md](https://github.com/sourcefuse/loopback4-notifications/blob/master/.github/CONTRIBUTING.md) for details on the process for submitting pull requests to us.
## Code of conduct
Code of conduct guidelines [here](https://github.com/sourcefuse/loopback4-notifications/blob/master/.github/CODE_OF_CONDUCT.md).
## License
[MIT](https://github.com/sourcefuse/loopback4-notifications/blob/master/LICENSE)
