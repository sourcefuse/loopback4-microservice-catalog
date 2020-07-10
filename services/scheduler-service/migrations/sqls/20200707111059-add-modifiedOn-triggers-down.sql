/* Replace with your SQL commands */

SET search_path TO logs, public;

DROP TRIGGER mdt_calendars ON scheduler.calendars;
DROP TRIGGER mdt_subscriptions ON scheduler.subscriptions;
DROP TRIGGER mdt_working_hours ON scheduler.working_hours;
DROP TRIGGER mdt_events ON scheduler.events;
DROP TRIGGER mdt_attendees ON scheduler.attendees;
DROP TRIGGER mdt_attachments ON scheduler.attachments;
DROP TRIGGER mdt_themes ON scheduler.themes;
DROP TRIGGER mdt_settings ON scheduler.settings;

DROP FUNCTION scheduler.moddatetime();