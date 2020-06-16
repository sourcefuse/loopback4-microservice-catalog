/* Replace with your SQL commands */

SET search_path TO main, public;

ALTER TABLE scheduler.calendars RENAME COLUMN "sch_identifier" TO "owner_email";
ALTER TABLE scheduler.events RENAME COLUMN "sch_identifier" TO "organizer_email";
ALTER TABLE scheduler.attendees RENAME COLUMN "sch_identifier" TO "email";
ALTER TABLE scheduler.subscriptions RENAME COLUMN "sch_identifier" TO "subscriber";
ALTER TABLE scheduler.calendars ADD COLUMN "owner_display_name" varchar(100);
ALTER TABLE scheduler.events ADD COLUMN "organizer_display_name" varchar(100);