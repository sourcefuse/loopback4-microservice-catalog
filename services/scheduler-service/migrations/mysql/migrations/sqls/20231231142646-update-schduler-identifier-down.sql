-- Rename columns back to their original names
ALTER TABLE calendars CHANGE COLUMN identifier owner_email VARCHAR(255);
ALTER TABLE events CHANGE COLUMN identifier organizer_email VARCHAR(255);
ALTER TABLE attendees CHANGE COLUMN identifier email VARCHAR(255);
ALTER TABLE subscriptions CHANGE COLUMN identifier subscriber VARCHAR(255);

-- Add back the dropped columns
ALTER TABLE calendars ADD COLUMN owner_display_name VARCHAR(255);
ALTER TABLE events ADD COLUMN organizer_display_name VARCHAR(255);
