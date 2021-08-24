/* Replace with your SQL commands */

SET search_path TO scheduler, public;

ALTER TABLE scheduler.calendars DROP COLUMN "delete_on";
ALTER TABLE scheduler.calendars DROP COLUMN "delete_by";
ALTER TABLE scheduler.subscriptions DROP COLUMN "delete_on";
ALTER TABLE scheduler.subscriptions DROP COLUMN "delete_by";
ALTER TABLE scheduler.working_hours DROP COLUMN "delete_on";
ALTER TABLE scheduler.working_hours DROP COLUMN "delete_by";
ALTER TABLE scheduler.events DROP COLUMN "delete_on";
ALTER TABLE scheduler.events DROP COLUMN "delete_by";
ALTER TABLE scheduler.attendees DROP COLUMN "delete_on";
ALTER TABLE scheduler.attendees DROP COLUMN "delete_by";
ALTER TABLE scheduler.attachments DROP COLUMN "delete_on";
ALTER TABLE scheduler.attachments DROP COLUMN "delete_by";
ALTER TABLE scheduler.settings DROP COLUMN "delete_on";
ALTER TABLE scheduler.settings DROP COLUMN "delete_by";
ALTER TABLE scheduler.themes DROP COLUMN "delete_on";
ALTER TABLE scheduler.themes DROP COLUMN "delete_by";
ALTER TABLE logs.audit_logs DROP COLUMN "delete_on";
ALTER TABLE logs.audit_logs DROP COLUMN "delete_by";