/* Replace with your SQL commands */
CREATE SCHEMA scheduler;

GRANT ALL ON SCHEMA scheduler TO public;

DROP SCHEMA IF EXISTS logs CASCADE;

CREATE SCHEMA logs;

GRANT ALL ON SCHEMA logs TO public;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE scheduler.calendars (
    id uuid DEFAULT uuid_generate_v1 () NOT NULL,
    created_by varchar,
    created_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted bool DEFAULT FALSE,
    "source" text,
    enable_working_hours bool DEFAULT FALSE,
    "location" varchar(300),
    modified_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_by varchar,
    owner_display_name varchar(100),
    owner_email varchar(200) NOT NULL,
    summary varchar(100),
    timezone varchar(120),
    ext_id varchar,
    ext_metadata jsonb,
    CONSTRAINT pk_calendars_id PRIMARY KEY (id)
);

COMMENT ON TABLE scheduler.calendars IS 'A calendar is a collection of related events, along with additional \nmetadata such as summary, default time zone, location, etc. \nEach calendar is identified by an ID. Calendars can have multiple owners.';

COMMENT ON COLUMN scheduler.calendars.id IS 'Identifier of the calendar.';

COMMENT ON COLUMN scheduler.calendars.created_by IS 'User/Person Email Id.';

COMMENT ON COLUMN scheduler.calendars.deleted IS 'For doing soft delete operation. The default is False.';

COMMENT ON COLUMN scheduler.calendars. "source" IS 'source like ''internal'', ''google calander'', ''outlook''';

COMMENT ON COLUMN scheduler.calendars. "location" IS 'Geographic location of the calendar as free-form text.';

COMMENT ON COLUMN scheduler.calendars.modified_by IS 'User/Person Email Id.';

COMMENT ON COLUMN scheduler.calendars.timezone IS 'The time zone of the calendar.';

CREATE TABLE scheduler.subscriptions (
    id uuid DEFAULT uuid_generate_v1 () NOT NULL,
    access_role varchar DEFAULT 'reader',
    bg_color varchar,
    calendar_id uuid NOT NULL,
    created_by varchar,
    created_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    default_reminders json,
    deleted bool DEFAULT FALSE,
    fg_color varchar,
    is_hidden bool DEFAULT FALSE,
    is_primary bool DEFAULT FALSE,
    modified_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_by varchar,
    notification_settings json,
    subscriber varchar NOT NULL,
    ext_id varchar,
    ext_metadata jsonb,
    CONSTRAINT pk_subscriptions_id PRIMARY KEY (id)
);

COMMENT ON TABLE scheduler.subscriptions IS 'Subscribe is a collection of all calendar entries that a user has added to their list. \nYou can use it to add and remove existing calendars to/from the users’ list. \nYou also use it to retrieve and set the values of user-specific calendar properties, such as default reminders. \nAnother example is foreground color, since different users can have different colors set for the same calendar.';

COMMENT ON COLUMN scheduler.subscriptions.access_role IS 'The effective access role that the user has on the calendar. Possible values are:\n"freeBusyReader" - Provides read access to free/busy information.\n"reader" - Provides read access to the calendar. Private events will appear to users with reader access, but event details will be hidden.\n"writer" - Provides read and write access to the calendar. Private events will appear to users with writer access, and event details will be visible.\n"owner" - Provides ownership of the calendar. This role has all of the permissions of the writer role with the additional ability to assign acess to other users.\n\nThe owners of a calendar can share the calendar by giving access to other users.';

COMMENT ON COLUMN scheduler.subscriptions.bg_color IS 'The scheduler color of the calendar in the hexadecimal format "#0088aa".';

COMMENT ON COLUMN scheduler.subscriptions.created_by IS 'User/Person Email Id.';

COMMENT ON COLUMN scheduler.subscriptions.default_reminders IS 'The default reminders that the user has for this calendar.';

COMMENT ON COLUMN scheduler.subscriptions.deleted IS 'For doing soft delete operation on user calendard. Read-only. Optional. The default is False.';

COMMENT ON COLUMN scheduler.subscriptions.fg_color IS 'The foreground color of the calendar in the hexadecimal format "#ffffff".';

COMMENT ON COLUMN scheduler.subscriptions.modified_by IS 'User/Person Email Id.';

COMMENT ON COLUMN scheduler.subscriptions.notification_settings IS 'The notifications that the user is receiving for this calendar.';

COMMENT ON COLUMN scheduler.subscriptions.subscriber IS 'User/Person Email Id.';

ALTER TABLE scheduler.subscriptions
    ADD CONSTRAINT fk_subscriptions_calendars FOREIGN KEY (calendar_id) REFERENCES scheduler.calendars (id);

CREATE TABLE scheduler.working_hours (
    id uuid DEFAULT uuid_generate_v1 () NOT NULL,
    calendar_id uuid NOT NULL,
    created_by varchar,
    created_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    day_of_week integer,
    deleted bool DEFAULT FALSE,
    "end" time,
    modified_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_by varchar,
    "start" time,
    ext_id varchar,
    ext_metadata jsonb,
    CONSTRAINT pk_working_hours_id PRIMARY KEY (id)
);

COMMENT ON TABLE scheduler.working_hours IS 'The hours during which appointment is available.';

COMMENT ON COLUMN scheduler.working_hours.created_by IS 'User/Person Email Id.';

COMMENT ON COLUMN scheduler.working_hours.day_of_week IS 'For store the day of week as an integer. ( 0 to 6 )';

COMMENT ON COLUMN scheduler.working_hours.modified_by IS 'User/Person Email Id.';

ALTER TABLE scheduler.working_hours
    ADD CONSTRAINT fk_working_hours_calendars FOREIGN KEY (calendar_id) REFERENCES scheduler.calendars (id);

CREATE TABLE scheduler.events (
    id uuid DEFAULT uuid_generate_v1 () NOT NULL,
    bg_color varchar,
    calendar_id uuid NOT NULL,
    created_by varchar,
    created_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted bool DEFAULT FALSE,
    description text,
    end_datetime timestamptz,
    fg_color varchar,
    icaluid varchar,
    is_full_day_event bool DEFAULT FALSE,
    is_locked bool DEFAULT FALSE,
    link text,
    "location" varchar(300),
    meeting_link text,
    modified_by varchar,
    modified_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    organizer_display_name varchar(100),
    organizer_email varchar(200),
    parent_event_id uuid,
    start_datetime timestamptz,
    status varchar,
    summary text,
    timezone varchar,
    ext_id varchar,
    ext_metadata jsonb,
    CONSTRAINT pk_events_id PRIMARY KEY (id)
);

COMMENT ON TABLE scheduler.events IS 'An event is an object associated with a specific date or time range. Events are identified by an ID that is unique within a calendar. Besides a start and end date-time, events contain other data such as summary, description, location, status, reminders, attachments,';

COMMENT ON COLUMN scheduler.events.id IS 'scheduler primary key';

COMMENT ON COLUMN scheduler.events.created_by IS 'User/Person Email Id.';

COMMENT ON COLUMN scheduler.events.deleted IS 'For doing soft delete operation. The default is False.';

COMMENT ON COLUMN scheduler.events.description IS 'Description of the calendar.';

COMMENT ON COLUMN scheduler.events.icaluid IS 'It is used to uniquely identify events accross calendaring systems \nand must be supplied when importing events via the import method.\nEvent unique identifier as defined in RFC5545.';

COMMENT ON COLUMN scheduler.events.is_locked IS 'Whether this is a locked event copy where no changes can be made to the scheduler event fields "summary", "description", "location", "start", "end" or "recurrence". The default is False.';

COMMENT ON COLUMN scheduler.events.link IS 'Event Link - where user can see the event detail.';

COMMENT ON COLUMN scheduler.events. "location" IS 'Geographic location of the event as free-form text.';

COMMENT ON COLUMN scheduler.events.status IS 'Status of the event. Optional. Possible values are:\n"confirmed" - The event is confirmed. This is the default status.\n"tentative" - The event is tentatively confirmed.\n"cancelled" - The event is cancelled (deleted).';

COMMENT ON COLUMN scheduler.events.modified_by IS 'User/Person Email Id.';

ALTER TABLE scheduler.events
    ADD CONSTRAINT fk_events_calendars FOREIGN KEY (calendar_id) REFERENCES scheduler.calendars (id);

ALTER TABLE scheduler.events
    ADD CONSTRAINT fk_events_events FOREIGN KEY (parent_event_id) REFERENCES scheduler.events (id);

CREATE TABLE scheduler.attendees (
    id uuid DEFAULT uuid_generate_v1 () NOT NULL,
    created_by varchar,
    created_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted bool DEFAULT FALSE,
    email varchar(200) NOT NULL,
    end_datetime timestamptz,
    event_id uuid NOT NULL,
    is_optional bool DEFAULT FALSE,
    is_organizer bool DEFAULT FALSE,
    messages text,
    modified_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_by varchar,
    response_status varchar DEFAULT 'needsAction',
    start_datetime timestamptz,
    ext_id varchar,
    ext_metadata jsonb,
    CONSTRAINT pk_attendees_id PRIMARY KEY (id)
);

COMMENT ON TABLE scheduler.attendees IS 'Events can also have multiple attendees. An attendee is usually the primary calendar of an invited user.';

COMMENT ON COLUMN scheduler.attendees.created_by IS 'User/Person Email Id.';

COMMENT ON COLUMN scheduler.attendees.deleted IS 'For doing soft delete operation. The default is False.';

COMMENT ON COLUMN scheduler.attendees.messages IS 'Attendess Messages';

COMMENT ON COLUMN scheduler.attendees.modified_by IS 'User/Person Email Id.';

COMMENT ON COLUMN scheduler.attendees.response_status IS 'The attendee''s response status. Possible values are:\n"needsAction" - The attendee has not responded to the invitation.\n"declined" - The attendee has declined the invitation.\n"tentative" - The attendee has tentatively accepted the invitation.\n"accepted" - The attendee has accepted the invitation.';

COMMENT ON COLUMN scheduler.attendees.start_datetime IS 'this can be remove later.';

ALTER TABLE scheduler.attendees
    ADD CONSTRAINT fk_attendees_events FOREIGN KEY (event_id) REFERENCES scheduler.events (id);

CREATE TABLE scheduler.attachments (
    id uuid DEFAULT uuid_generate_v1 () NOT NULL,
    created_by varchar,
    created_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted bool DEFAULT FALSE,
    event_id uuid NOT NULL,
    fileurl text NOT NULL,
    iconlink text,
    mimetype varchar(200),
    modified_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    title varchar(400),
    modified_by varchar,
    ext_id varchar,
    ext_metadata jsonb,
    CONSTRAINT pk_attachments_id PRIMARY KEY (id)
);

COMMENT ON COLUMN scheduler.attachments.created_by IS 'User/Person Email Id.';

COMMENT ON COLUMN scheduler.attachments.deleted IS 'For doing soft delete operation. The default is False.';

COMMENT ON COLUMN scheduler.attachments.modified_by IS 'User/Person Email Id.';

ALTER TABLE scheduler.attachments
    ADD CONSTRAINT fk_attachments_events FOREIGN KEY (event_id) REFERENCES scheduler.events (id);

CREATE TABLE scheduler.settings (
    id uuid DEFAULT uuid_generate_v1 () NOT NULL,
    created_by varchar,
    created_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted bool DEFAULT FALSE,
    modified_by varchar,
    modified_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    owner_id varchar(225) NOT NULL,
    owner_type varchar DEFAULT 'global',
    setting_name varchar(225),
    setting_value varchar(1500),
    ext_id varchar,
    ext_metadata jsonb,
    CONSTRAINT pk_settings_id PRIMARY KEY (id)
);

COMMENT ON TABLE scheduler.settings IS 'Setting resources represent settings that users can change from the Calendar UI.';

COMMENT ON COLUMN scheduler.settings.created_by IS 'User/Person Email Id.';

COMMENT ON COLUMN scheduler.settings.modified_by IS 'User/Person Email Id.';

COMMENT ON COLUMN scheduler.settings.owner_id IS 'This can be an uuid or email id of user.';

COMMENT ON COLUMN scheduler.settings.owner_type IS 'values are  ''global'', ''user'', ''calendar'', ''event''';

COMMENT ON COLUMN scheduler.settings.setting_name IS 'setting name - key of setting';

COMMENT ON COLUMN scheduler.settings.setting_value IS 'setting value - setting key value, accept any string.';

CREATE TABLE scheduler.themes (
    id uuid DEFAULT uuid_generate_v1 () NOT NULL,
    cal_bg varchar(200),
    cal_fg varchar(200),
    created_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted bool DEFAULT FALSE,
    event_bg varchar(200),
    event_fg varchar(200),
    modified_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by varchar,
    modified_by varchar,
    ext_id varchar,
    ext_metadata jsonb,
    CONSTRAINT pk_colors_id PRIMARY KEY (id)
);

COMMENT ON TABLE scheduler.themes IS 'A global palette of calendar colors, mapping. \nA Subscribe and event collection have color field related to this.';

COMMENT ON COLUMN scheduler.themes.cal_bg IS 'The background color associated with this color definition.';

COMMENT ON COLUMN scheduler.themes.cal_fg IS 'The foreground color that can be used to write on top of a background with ''background'' color.';

COMMENT ON COLUMN scheduler.themes.deleted IS 'For doing soft delete operation. The default is False.';

COMMENT ON COLUMN scheduler.themes.event_bg IS 'The background color associated with this color definition.';

COMMENT ON COLUMN scheduler.themes.event_fg IS 'The foreground color that can be used to write on top of a background with ''background'' color.';

COMMENT ON COLUMN scheduler.themes.created_by IS 'User/Person Email Id.';

COMMENT ON COLUMN scheduler.themes.modified_by IS 'User/Person Email Id.';

CREATE TABLE logs.audit_logs (
    id uuid DEFAULT uuid_generate_v1 () NOT NULL,
    action_by varchar,
    "after" jsonb,
    "before" jsonb,
    entity_id varchar,
    log_type varchar(100) DEFAULT 'APPLICATION_LOGS' ::character varying,
    operation_name varchar(10) NOT NULL,
    operation_time timestamptz DEFAULT now() NOT NULL,
    "table_name" varchar(60) NOT NULL,
    ext_id varchar,
    ext_metadata jsonb,
    CONSTRAINT pk_audit_logs_id PRIMARY KEY (id)
);

COMMENT ON TABLE logs.audit_logs IS 'DB trigger based audit_logs';

COMMENT ON COLUMN logs.audit_logs.action_by IS 'Person/User Email ID.';

CREATE OR REPLACE FUNCTION logs.audit_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
  DECLARE
    USER_ID VARCHAR;
    ENTITY_ID VARCHAR;
BEGIN
IF TG_OP = 'INSERT'
THEN
USER_ID := to_json(NEW)->'created_by';
ENTITY_ID := to_json(NEW)->'id';
INSERT INTO logs.audit_logs (
  operation_name,
  table_name,
  log_type,
  entity_id,
  action_by,
  after,
  ext_id,
  ext_metadata
  )
VALUES (
  TG_OP,
  TG_TABLE_NAME,
  TG_ARGV[0],
  ENTITY_ID,
  USER_ID,
  to_jsonb(NEW),
  to_json(NEW)->'ext_id',
  to_json(NEW)->'ext_metadata'
  );
RETURN NEW;
ELSIF TG_OP = 'UPDATE'
THEN
USER_ID := to_json(NEW)->'modified_by';
ENTITY_ID := to_json(NEW)->'id';
-- IF NEW != OLD THEN
 INSERT INTO logs.audit_logs (
   operation_name,
   table_name,
   log_type,
   entity_id,
   action_by,
   before,
   after,
   ext_id,
   ext_metadata
   )
VALUES (
  TG_OP,
  TG_TABLE_NAME,
  TG_ARGV[0],
  ENTITY_ID,
  USER_ID,
  to_jsonb(OLD),
  to_jsonb(NEW),
  to_json(NEW)->'ext_id',
  to_json(NEW)->'ext_metadata'
  );
-- END IF;
 RETURN NEW;
ELSIF TG_OP = 'DELETE'
THEN
USER_ID := to_json(OLD)->'modified_by';
ENTITY_ID := to_json(OLD)->'id';
INSERT INTO logs.audit_logs (
  operation_name,
  table_name,
  log_type,
  entity_id,
  action_by,
  before,
  ext_id,
  ext_metadata)
VALUES (
  TG_OP,
  TG_TABLE_NAME,
  TG_ARGV[0],
  ENTITY_ID,
  USER_ID,
  to_jsonb(OLD),
  to_json(OLD)->'ext_id',
  to_json(OLD)->'ext_metadata'
);
RETURN OLD;
END IF;
END;
$function$
;
