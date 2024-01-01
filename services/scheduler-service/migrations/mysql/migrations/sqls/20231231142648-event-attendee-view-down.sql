-- adding back the dropped columns
ALTER TABLE attendees ADD COLUMN end_datetime TIMESTAMP;
ALTER TABLE attendees ADD COLUMN start_datetime TIMESTAMP;

-- dropping view
DROP VIEW IF EXISTS events_attendees_view;
