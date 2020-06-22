/* Replace with your SQL commands */

SET search_path TO scheduler, public;

ALTER TABLE scheduler.calendars RENAME COLUMN "owner_email" TO "identifier";
ALTER TABLE scheduler.events RENAME COLUMN "organizer_email" TO "identifier";
ALTER TABLE scheduler.attendees RENAME COLUMN "email" TO "identifier";
ALTER TABLE scheduler.subscriptions RENAME COLUMN "subscriber" TO "identifier";
ALTER TABLE scheduler.calendars DROP COLUMN "owner_display_name";
ALTER TABLE scheduler.events DROP COLUMN "organizer_display_name";
