-- dropping procedure 
DROP PROCEDURE IF EXISTS generic_audit_procedure;

-- dropping foreign keys
ALTER TABLE working_hours
DROP FOREIGN KEY fk_working_hours_calendars;

ALTER TABLE subscriptions
DROP FOREIGN KEY fk_subscriptions_calendars;

ALTER TABLE events
DROP FOREIGN KEY fk_events_calendars;

ALTER TABLE events
DROP FOREIGN KEY fk_events_events;

ALTER TABLE attendees
DROP FOREIGN KEY fk_attendees_events;

ALTER TABLE attachments
DROP FOREIGN KEY fk_attachments_events;

-- dropping tables
DROP TABLE IF EXISTS calendars;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS working_hours;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS attendees;
DROP TABLE IF EXISTS attachments;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS themes;
DROP TABLE IF EXISTS audit_logs;
