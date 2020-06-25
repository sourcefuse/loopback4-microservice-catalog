/* Replace with your SQL commands */

SET search_path TO logs, public;

DROP TRIGGER calenders_audit_trigger ON scheduler.calendars;
DROP TRIGGER subscription_audit_trigger ON scheduler.subscriptions;
DROP TRIGGER working_hours_audit_trigger ON scheduler.working_hours;
DROP TRIGGER events_audit_trigger ON scheduler.events;
DROP TRIGGER attendees_audit_trigger ON scheduler.attendees;
DROP TRIGGER attachments_audit_trigger ON scheduler.attachments;