/* Replace with your SQL commands */

DROP VIEW scheduler.events_attendees_view;

ALTER TABLE scheduler.subscriptions ALTER COLUMN access_role TYPE varchar;

ALTER TABLE scheduler.attendees ALTER COLUMN response_status TYPE varchar;

ALTER TABLE scheduler.settings ALTER COLUMN owner_type TYPE varchar;

ALTER TABLE scheduler.events ALTER COLUMN status TYPE varchar;

CREATE OR REPLACE VIEW scheduler.events_attendees_view AS
SELECT et.*,
    at.id AS attendee_id,
    at.identifier AS attendee_identifier,
    at.event_id,
    at.is_optional,
    at.is_organizer,
    at.messages,
    at.response_status
FROM scheduler.events et
    LEFT JOIN scheduler.attendees at ON et.id = at.event_id;
