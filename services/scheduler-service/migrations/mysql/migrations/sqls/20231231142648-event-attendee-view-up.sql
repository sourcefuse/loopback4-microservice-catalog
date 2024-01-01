-- drop columns 
ALTER TABLE attendees DROP COLUMN end_datetime;
ALTER TABLE attendees DROP COLUMN start_datetime;

-- create view 
CREATE VIEW events_attendees_view AS
SELECT et.*,
    at.id AS attendee_id,
    at.identifier AS attendee_identifier,
    at.event_id,
    at.is_optional,
    at.is_organizer,
    at.messages,
    at.response_status
FROM events et
    LEFT JOIN attendees at ON et.id = at.event_id;

