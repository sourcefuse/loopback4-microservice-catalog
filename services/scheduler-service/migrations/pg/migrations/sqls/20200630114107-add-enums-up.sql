DROP VIEW scheduler.events_attendees_view;

CREATE TYPE scheduler.accessRoleType AS ENUM
('freeBusyReader','reader', 'writer', 'owner');
ALTER TABLE scheduler.subscriptions ALTER COLUMN access_role DROP DEFAULT;
ALTER TABLE scheduler.subscriptions ALTER COLUMN access_role TYPE
scheduler.accessRoleType USING access_role::text::scheduler.accessRoleType;
ALTER TABLE scheduler.subscriptions ALTER COLUMN access_role
SET
DEFAULT 'reader';

CREATE TYPE scheduler.responseStatus AS ENUM
('needsAction','declined', 'tentative', 'accepted');
ALTER TABLE scheduler.attendees ALTER COLUMN response_status DROP DEFAULT;
ALTER TABLE scheduler.attendees ALTER COLUMN response_status TYPE
scheduler.responseStatus USING response_status::text::scheduler.responseStatus;
ALTER TABLE scheduler.attendees ALTER COLUMN response_status
SET
DEFAULT 'needsAction';

CREATE TYPE scheduler.setting_owner_type AS ENUM
('global', 'user', 'calendar', 'event');
ALTER TABLE scheduler.settings ALTER COLUMN owner_type DROP DEFAULT;
ALTER TABLE scheduler.settings ALTER COLUMN owner_type TYPE
scheduler.setting_owner_type USING owner_type::text::scheduler.setting_owner_type;
ALTER TABLE scheduler.settings ALTER COLUMN owner_type
SET
DEFAULT 'global';

CREATE TYPE scheduler.eventStatus AS ENUM
('confirmed', 'tentative', 'cancelled', 'completed');
ALTER TABLE scheduler.events ALTER COLUMN status DROP DEFAULT;
ALTER TABLE scheduler.events ALTER COLUMN status TYPE
scheduler.eventStatus USING status::text::scheduler.eventStatus;
ALTER TABLE scheduler.events ALTER COLUMN status
SET
DEFAULT 'tentative';

CREATE VIEW scheduler.events_attendees_view
AS
  SELECT et.*,
    at.id AS attendee_id,
    at.identifier AS attendee_identifier,
    at.event_id,
    at.is_optional,
    at.is_organizer,
    at.messages,
    at.response_status
  FROM (scheduler.events et
    LEFT JOIN scheduler.attendees at ON ((et.id = at.event_id)));
