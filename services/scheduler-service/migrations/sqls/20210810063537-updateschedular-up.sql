/* Replace with your SQL commands */

SET search_path TO scheduler, public;

ALTER TABLE scheduler.calendars ADD COLUMN "delete_on" timestamptz;
ALTER TABLE scheduler.calendars ADD COLUMN "delete_by" uuid;
ALTER TABLE scheduler.subscriptions ADD COLUMN "delete_on" timestamptz;
ALTER TABLE scheduler.subscriptions ADD COLUMN "delete_by" uuid;
ALTER TABLE scheduler.working_hours ADD COLUMN "delete_on" timestamptz;
ALTER TABLE scheduler.working_hours ADD COLUMN "delete_by" uuid;
ALTER TABLE scheduler.events ADD COLUMN "delete_on" timestamptz;
ALTER TABLE scheduler.events ADD COLUMN "delete_by" uuid;
ALTER TABLE scheduler.attendees ADD COLUMN "delete_on" timestamptz;
ALTER TABLE scheduler.attendees ADD COLUMN "delete_by" uuid;
ALTER TABLE scheduler.attachments ADD COLUMN "delete_on" timestamptz;
ALTER TABLE scheduler.attachments ADD COLUMN "delete_by" uuid;
ALTER TABLE scheduler.settings ADD COLUMN "delete_on" timestamptz;
ALTER TABLE scheduler.settings ADD COLUMN "delete_by" uuid;
ALTER TABLE scheduler.themes ADD COLUMN "delete_on" timestamptz;
ALTER TABLE scheduler.themes ADD COLUMN "delete_by" uuid;
ALTER TABLE logs.audit_logs ADD COLUMN "delete_on" timestamptz;
ALTER TABLE logs.audit_logs ADD COLUMN "delete_by" uuid; 