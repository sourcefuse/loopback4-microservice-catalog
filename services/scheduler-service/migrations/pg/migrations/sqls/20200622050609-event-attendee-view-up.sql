/* Replace with your SQL commands */

SET search_path TO scheduler, public;

ALTER TABLE scheduler.attendees DROP COLUMN end_datetime;

ALTER TABLE scheduler.attendees DROP COLUMN start_datetime;

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