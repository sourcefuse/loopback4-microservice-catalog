/* Replace with your SQL commands */

SET search_path TO scheduler, public;

ALTER TABLE scheduler.attendees ADD COLUMN end_datetime timestamptz;

ALTER TABLE scheduler.attendees ADD COLUMN start_datetime timestamptz;

DROP VIEW scheduler.events_attendees_view;