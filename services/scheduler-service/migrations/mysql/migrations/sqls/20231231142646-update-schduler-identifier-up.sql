-- rename columns
ALTER TABLE calendars CHANGE COLUMN owner_email identifier VARCHAR(255);
ALTER TABLE events CHANGE COLUMN organizer_email identifier VARCHAR(255);
ALTER TABLE attendees CHANGE COLUMN email identifier VARCHAR(255);
ALTER TABLE subscriptions CHANGE COLUMN subscriber identifier VARCHAR(255);

-- drop columns
ALTER TABLE calendars DROP COLUMN owner_display_name;
ALTER TABLE events DROP COLUMN organizer_display_name;
