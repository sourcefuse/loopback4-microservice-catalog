-- creating table for storing calendars
CREATE TABLE IF NOT EXISTS calendars (
    id                    VARCHAR(36) PRIMARY KEY,
    created_by            VARCHAR(255),
    created_on            TIMESTAMP DEFAULT current_timestamp NOT NULL,
    deleted               BOOL DEFAULT false,
    deleted_by            VARCHAR(36),
    deleted_on            TIMESTAMP, 
    `source`              TEXT,
    enable_working_hours  BOOL DEFAULT false,
    `location`            VARCHAR(300),
    modified_on           TIMESTAMP DEFAULT current_timestamp NOT NULL,
    modified_by           VARCHAR(255),
    owner_display_name    VARCHAR(100),
    owner_email           VARCHAR(200) NOT NULL,
    summary               VARCHAR(100),
    timezone              VARCHAR(120),
    ext_id                VARCHAR(255),
    ext_metadata          JSON
);

-- adding triggers
CREATE TRIGGER calendars_identity
BEFORE INSERT ON calendars
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER mdt_calendars
BEFORE UPDATE ON calendars
FOR EACH ROW
SET NEW.modified_on = now();

-- Adding comments
ALTER TABLE calendars COMMENT 'A calendar is a collection of related events, along with additional metadata such as summary, default time zone, location, etc. Each calendar is identified by an ID. Calendars can have multiple owners.';
ALTER TABLE calendars MODIFY COLUMN id VARCHAR(36) COMMENT 'Identifier of the calendar.';
ALTER TABLE calendars MODIFY COLUMN created_by VARCHAR(255) COMMENT 'User/Person Email Id.';
ALTER TABLE calendars MODIFY COLUMN deleted BOOLEAN COMMENT 'For doing a soft delete operation. The default is False.';
ALTER TABLE calendars MODIFY COLUMN `source` TEXT COMMENT 'Source like ''internal'', ''google calendar'', ''outlook''';
ALTER TABLE calendars MODIFY COLUMN `location` VARCHAR(300) COMMENT 'Geographic location of the calendar as free-form TEXT.';
ALTER TABLE calendars MODIFY COLUMN modified_by VARCHAR(255) COMMENT 'User/Person Email Id.';
ALTER TABLE calendars MODIFY COLUMN timezone VARCHAR(120) COMMENT 'The time zone of the calendar.';

-- creating table for storing subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id                         VARCHAR(36) PRIMARY KEY,
    access_role                ENUM("freeBusyReader","reader", "writer", "owner") DEFAULT "reader",
    bg_color                   VARCHAR(255),
    calendar_id                VARCHAR(36) NOT NULL,
    created_by                 VARCHAR(255),
    created_on                 TIMESTAMP DEFAULT current_timestamp NOT NULL,
    default_reminders          JSON,
    deleted                    BOOL DEFAULT false,
    deleted_by                 VARCHAR(36),
    deleted_on                 TIMESTAMP, 
    fg_color                   VARCHAR(255),
    is_hidden                  BOOL DEFAULT false,
    is_primary                 BOOL DEFAULT false,
    modified_on                TIMESTAMP DEFAULT current_timestamp NOT NULL,
    modified_by                VARCHAR(255),
    notification_settings      JSON,
    subscriber                 VARCHAR(255) NOT NULL,
    ext_id                     VARCHAR(255),
    ext_metadata               JSON
);

-- adding triggers
CREATE TRIGGER subscriptions_identity
BEFORE INSERT ON subscriptions
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());


CREATE TRIGGER mdt_subscriptions
BEFORE UPDATE ON subscriptions
FOR EACH ROW
SET NEW.modified_on = now();

-- adding comments
ALTER TABLE subscriptions COMMENT 'Subscribe is a collection of all calendar entries that a user has added to their list. 
You can use it to add and remove existing calendars to/from the users’ list. 
You also use it to retrieve and set the values of user-specific calendar properties, such as default reminders. 
Another example is foreground color, since different users can have different colors set for the same calendar.';
ALTER TABLE subscriptions MODIFY COLUMN access_role VARCHAR(255) COMMENT 'The effective access role that the user has on the calendar. Possible values are:
''freeBusyReader'' - Provides read access to free/busy information.
''reader'' - Provides read access to the calendar. Private events will appear to users with reader access, but event details will be hidden.
''writer'' - Provides read and write access to the calendar. Private events will appear to users with writer access, and event details will be visible.
''owner'' - Provides ownership of the calendar. This role has all of the permissions of the writer role with the additional ability to assign access to other users.
The owners of a calendar can share the calendar by giving access to other users.';
ALTER TABLE subscriptions MODIFY COLUMN bg_color VARCHAR(255) COMMENT 'The scheduler color of the calendar in the hexadecimal format ''#0088aa''.';
ALTER TABLE subscriptions MODIFY COLUMN created_by VARCHAR(255) COMMENT 'User/Person Email Id.';
ALTER TABLE subscriptions MODIFY COLUMN default_reminders JSON COMMENT 'The default reminders that the user has for this calendar.';
ALTER TABLE subscriptions MODIFY COLUMN deleted BOOL COMMENT 'For doing soft delete operation on user calendar. Read-only. Optional. The default is False.';
ALTER TABLE subscriptions MODIFY COLUMN fg_color VARCHAR(255) COMMENT 'The foreground color of the calendar in the hexadecimal format ''#ffffff''.';
ALTER TABLE subscriptions MODIFY COLUMN modified_by VARCHAR(255) COMMENT 'User/Person Email Id.';
ALTER TABLE subscriptions MODIFY COLUMN notification_settings JSON COMMENT 'The notifications that the user is receiving for this calendar.';
ALTER TABLE subscriptions MODIFY COLUMN subscriber VARCHAR(255) COMMENT 'User/Person Email Id.';

-- adding foreign key
ALTER TABLE subscriptions
ADD CONSTRAINT fk_subscriptions_calendars 
FOREIGN KEY (calendar_id) 
REFERENCES calendars(id);

-- creating table for storing working_hours
CREATE TABLE IF NOT EXISTS working_hours (
    id                  VARCHAR(36) PRIMARY KEY,
    calendar_id         VARCHAR(36) NOT NULL,
    created_by          VARCHAR(255),
    created_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
    day_of_week         INTEGER,
    deleted             BOOL DEFAULT false,
    deleted_by          VARCHAR(36),
    deleted_on          TIMESTAMP, 
    `end`               TIME,
    modified_on         TIMESTAMP DEFAULT current_timestamp NOT NULL,
    modified_by         VARCHAR(255),
    `start`             TIME,
    ext_id              VARCHAR(255),
    ext_metadata        JSON
);

-- adding triggers
CREATE TRIGGER working_hours_identity
BEFORE INSERT ON working_hours
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER mdt_working_hours
BEFORE UPDATE ON working_hours
FOR EACH ROW
SET NEW.modified_on = now();

-- adding comments
ALTER TABLE working_hours COMMENT 'The hours during which an appointment is available.';
ALTER TABLE working_hours MODIFY COLUMN created_by VARCHAR(255) COMMENT 'User/Person Email Id.';
ALTER TABLE working_hours MODIFY COLUMN day_of_week INT COMMENT 'To store the day of the week as an integer (0 to 6).';
ALTER TABLE working_hours MODIFY COLUMN modified_by VARCHAR(255) COMMENT 'User/Person Email Id.';

-- adding foreign key
ALTER TABLE working_hours
ADD CONSTRAINT fk_working_hours_calendars 
FOREIGN KEY (calendar_id) 
REFERENCES calendars(id);

-- creating table for storing events
CREATE TABLE IF NOT EXISTS events (
    id                        VARCHAR(36) PRIMARY KEY,
    bg_color                  VARCHAR(255),
    calendar_id               VARCHAR(36) NOT NULL,
    created_by                VARCHAR(255),
    created_on                TIMESTAMP DEFAULT current_timestamp NOT NULL,
    deleted                   BOOL DEFAULT false,
    deleted_by                VARCHAR(36),
    deleted_on                TIMESTAMP, 
    description               TEXT,
    end_datetime              TIMESTAMP,
    fg_color                  VARCHAR(255),
    icaluid                   VARCHAR(255),
    is_full_day_event         BOOL DEFAULT false,
    is_locked                 BOOL DEFAULT false,
    link                      TEXT,
    `location`                VARCHAR(300),
    meeting_link              TEXT,
    modified_by               VARCHAR(255),
    modified_on               TIMESTAMP DEFAULT current_timestamp NOT NULL,
    organizer_display_name    VARCHAR(100),
    organizer_email           VARCHAR(200),
    parent_event_id           VARCHAR(36),
    start_datetime            TIMESTAMP,
    status                    ENUM("confirmed", "tentative", "cancelled", "completed") DEFAULT "tentative",
    summary                   TEXT,
    timezone                  VARCHAR(255),
    ext_id                    VARCHAR(255),
    ext_metadata              JSON
);

-- adding triggers
CREATE TRIGGER events_identity
BEFORE INSERT ON events
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER mdt_events
BEFORE UPDATE ON events
FOR EACH ROW
SET NEW.modified_on = now();

-- adding comments
ALTER TABLE events COMMENT 'An event is an object associated with a specific date or time range. Events are identified by an ID that is unique within a calendar. Besides a start and end date-time, events contain other data such as summary, description, location, status, reminders, attachments,';
ALTER TABLE events MODIFY COLUMN id VARCHAR(36) COMMENT 'Scheduler primary key';
ALTER TABLE events MODIFY COLUMN created_by VARCHAR(255) COMMENT 'User/Person Email Id.';
ALTER TABLE events MODIFY COLUMN deleted BOOL DEFAULT false COMMENT 'For doing soft delete operation. The default is False.';
ALTER TABLE events MODIFY COLUMN description TEXT COMMENT 'Description of the calendar.';
ALTER TABLE events MODIFY COLUMN icaluid VARCHAR(255) COMMENT 'It is used to uniquely identify events across calendaring systems and must be supplied when importing events via the import method. Event unique identifier as defined in RFC5545.';
ALTER TABLE events MODIFY COLUMN is_locked BOOL DEFAULT false COMMENT 'Whether this is a locked event copy where no changes can be made to the scheduler event fields "summary", "description", "location", "start", "end" or "recurrence". The default is False.';
ALTER TABLE events MODIFY COLUMN link TEXT COMMENT 'Event Link - where the user can see the event detail.';
ALTER TABLE events MODIFY COLUMN `location` VARCHAR(300) COMMENT 'Geographic location of the event as free-form TEXT.';
ALTER TABLE events MODIFY COLUMN status VARCHAR(255) COMMENT 'Status of the event. Optional. Possible values are: "confirmed" - The event is confirmed. This is the default status. "tentative" - The event is tentatively confirmed. "cancelled" - The event is canceled (deleted).';
ALTER TABLE events MODIFY COLUMN modified_by VARCHAR(255) COMMENT 'User/Person Email Id.';

-- adding foreign keys
ALTER TABLE events
ADD CONSTRAINT fk_events_calendars 
FOREIGN KEY (calendar_id) 
REFERENCES calendars(id);

ALTER TABLE events
ADD CONSTRAINT fk_events_events 
FOREIGN KEY (parent_event_id) 
REFERENCES events(id);

-- creating table for storing attendees
CREATE TABLE IF NOT EXISTS attendees (
    id                  VARCHAR(36) PRIMARY KEY,
    created_by          VARCHAR(255),
    created_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
    deleted             BOOL DEFAULT false,
    deleted_by          VARCHAR(36),
    deleted_on          TIMESTAMP, 
    email               VARCHAR(200) NOT NULL,
    end_datetime        TIMESTAMP,
    event_id            VARCHAR(36) NOT NULL,
    is_optional         BOOL DEFAULT false,
    is_organizer        BOOL DEFAULT false,
    messages            TEXT,
    modified_on         TIMESTAMP DEFAULT current_timestamp NOT NULL,
    modified_by         VARCHAR(255),
    response_status     ENUM("needsAction","declined", "tentative", "accepted") DEFAULT "needsAction",
    start_datetime      TIMESTAMP,
    ext_id              VARCHAR(255),
    ext_metadata        JSON
);

-- adding triggers
CREATE TRIGGER attendees_identity
BEFORE INSERT ON attendees
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER mdt_attendees
BEFORE UPDATE ON attendees
FOR EACH ROW
SET NEW.modified_on = now();

-- adding comments
ALTER TABLE attendees COMMENT 'Events can also have multiple attendees. An attendee is usually the primary calendar of an invited user.';
ALTER TABLE attendees MODIFY COLUMN created_by VARCHAR(255) COMMENT 'User/Person Email Id.';
ALTER TABLE attendees MODIFY COLUMN deleted BOOL DEFAULT false COMMENT 'For doing soft delete operation. The default is False.';
ALTER TABLE attendees MODIFY COLUMN messages TEXT COMMENT 'Attendess Messages.';
ALTER TABLE attendees MODIFY COLUMN modified_by VARCHAR(255) COMMENT 'User/Person Email Id.';
ALTER TABLE attendees MODIFY COLUMN response_status VARCHAR(255) DEFAULT 'needsAction' COMMENT 'The attendee''s response status. Possible values are:\n"needsAction" - The attendee has not responded to the invitation.\n"declined" - The attendee has declined the invitation.\n"tentative" - The attendee has tentatively accepted the invitation.\n"accepted" - The attendee has accepted the invitation.';
ALTER TABLE attendees MODIFY COLUMN start_datetime TIMESTAMP COMMENT 'This can be removed later.';

-- adding foreign key
ALTER TABLE attendees
ADD CONSTRAINT fk_attendees_events 
FOREIGN KEY (event_id) 
REFERENCES events(id);

-- creating table for storing attachments
CREATE TABLE IF NOT EXISTS attachments (
    id                  VARCHAR(36) PRIMARY KEY,
    created_by          VARCHAR(255),
    created_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
    deleted             BOOL DEFAULT false,
    deleted_by          VARCHAR(36),
    deleted_on          TIMESTAMP, 
    event_id            VARCHAR(36) NOT NULL,
    fileurl             TEXT NOT NULL,
    iconlink            TEXT,
    mimetype            VARCHAR(200),
    modified_on         TIMESTAMP DEFAULT current_timestamp NOT NULL,
    title               VARCHAR(400),
    modified_by         VARCHAR(255),
    ext_id              VARCHAR(255),
    ext_metadata        JSON
);

-- adding triggers
CREATE TRIGGER attachments_identity
BEFORE INSERT ON attachments
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER mdt_attachments
BEFORE UPDATE ON attachments
FOR EACH ROW
SET NEW.modified_on = now();

-- adding comments
ALTER TABLE attachments MODIFY COLUMN created_by VARCHAR(255) COMMENT 'User/Person Email Id.';
ALTER TABLE attachments MODIFY COLUMN deleted BOOL DEFAULT false COMMENT 'For doing a soft delete operation. The default is False.';
ALTER TABLE attachments MODIFY COLUMN modified_by VARCHAR(255) COMMENT 'User/Person Email Id.';

-- adding foreign key
ALTER TABLE attachments
ADD CONSTRAINT fk_attachments_events 
FOREIGN KEY (event_id) 
REFERENCES events(id);

-- creating table for storing settings
CREATE TABLE IF NOT EXISTS settings (
    id                  VARCHAR(36) PRIMARY KEY,
    created_by          VARCHAR(255),
    created_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
    deleted             BOOL DEFAULT false,
    deleted_by          VARCHAR(36),
    deleted_on          TIMESTAMP, 
    modified_by         VARCHAR(255),
    modified_on         TIMESTAMP DEFAULT current_timestamp NOT NULL,
    owner_id            VARCHAR(225) NOT NULL,
    owner_type          ENUM("global", "user", "calendar", "event") DEFAULT "global",
    setting_name        VARCHAR(225),
    setting_value       VARCHAR(1500),
    ext_id              VARCHAR(255),
    ext_metadata        JSON
);

-- adding triggers
CREATE TRIGGER settings_identity
BEFORE INSERT ON settings
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER mdt_settings
BEFORE UPDATE ON settings
FOR EACH ROW
SET NEW.modified_on = now();

-- adding comments
ALTER TABLE settings COMMENT 'Setting resources represent settings that users can change from the Calendar UI.';
ALTER TABLE settings MODIFY COLUMN created_by VARCHAR(255) COMMENT 'User/Person Email Id.';
ALTER TABLE settings MODIFY COLUMN modified_by VARCHAR(255) COMMENT 'User/Person Email Id.';
ALTER TABLE settings MODIFY COLUMN owner_id VARCHAR(225) COMMENT 'This can be a VARCHAR(36) or email id of the user.';
ALTER TABLE settings MODIFY COLUMN owner_type VARCHAR(255) DEFAULT "global" COMMENT 'Values are ''global'', ''user'', ''calendar'', ''event''.';
ALTER TABLE settings MODIFY COLUMN setting_name VARCHAR(225) COMMENT "Setting name - key of setting.";
ALTER TABLE settings MODIFY COLUMN setting_value VARCHAR(1500) COMMENT "Setting value - setting key value, accepts any string.";

-- creating table for storing themes
CREATE TABLE IF NOT EXISTS themes (
    id                  VARCHAR(36) PRIMARY KEY,
    cal_bg              VARCHAR(200),
    cal_fg              VARCHAR(200),
    created_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
    deleted             BOOL DEFAULT false,
    deleted_by          VARCHAR(36),
    deleted_on          TIMESTAMP, 
    event_bg            VARCHAR(200),
    event_fg            VARCHAR(200),
    modified_on         TIMESTAMP DEFAULT current_timestamp NOT NULL,
    created_by          VARCHAR(255),
    modified_by         VARCHAR(255),
    ext_id              VARCHAR(255),
    ext_metadata        JSON
);

-- adding triggers
CREATE TRIGGER themes_identity
BEFORE INSERT ON themes
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER mdt_themes
BEFORE UPDATE ON themes
FOR EACH ROW
SET NEW.modified_on = now();

-- adding comments
ALTER TABLE themes COMMENT 'A global palette of calendar colors, mapping. \nA Subscribe and event collection have color field related to this.';
ALTER TABLE themes MODIFY COLUMN cal_bg VARCHAR(200) COMMENT 'The background color associated with this color definition.';
ALTER TABLE themes MODIFY COLUMN cal_fg VARCHAR(200) COMMENT 'The foreground color that can be used to write on top of a background with ''background'' color.';
ALTER TABLE themes MODIFY COLUMN deleted BOOL DEFAULT false COMMENT "For doing a soft delete operation. The default is False.";
ALTER TABLE themes MODIFY COLUMN event_bg VARCHAR(200) COMMENT "The background color associated with this color definition.";
ALTER TABLE themes MODIFY COLUMN event_fg VARCHAR(200) COMMENT "The foreground color that can be used to write on top of a background with 'background'' color.'";
ALTER TABLE themes MODIFY COLUMN created_by VARCHAR(255) COMMENT "User/Person Email Id.";
ALTER TABLE themes MODIFY COLUMN modified_by VARCHAR(255) COMMENT "User/Person Email Id.";

-- creating table for storing audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id                  VARCHAR(36) PRIMARY KEY,
    action_by           VARCHAR(255),
    `after`             JSON,
    `before`            JSON,
    entity_id           VARCHAR(255),
    log_type            VARCHAR(100) DEFAULT 'APPLICATION_LOGS',
    operation_name      VARCHAR(10) NOT NULL,
    operation_time      TIMESTAMP DEFAULT current_timestamp NOT NULL,
    `table_name`        VARCHAR(60) NOT NULL,
    ext_id              VARCHAR(255),
    ext_metadata        JSON
);

-- adding triggers
CREATE TRIGGER audit_logs_identity
BEFORE INSERT ON audit_logs
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- adding comments
ALTER TABLE audit_logs COMMENT 'DB trigger-based audit_logs.';
ALTER TABLE audit_logs MODIFY COLUMN action_by VARCHAR(255) COMMENT 'Person/User Email ID.';

-- creating an generic AUDIT procedure
CREATE PROCEDURE generic_audit_procedure( op_name VARCHAR(10), tb_name VARCHAR(60),
  `type` VARCHAR(100), ent_id VARCHAR(36), u_id VARCHAR(36),
  before_state JSON, after_state JSON, e_id VARCHAR(255), e_md JSON)
BEGIN
  INSERT INTO audit_logs ( operation_name, table_name, log_type,
    entity_id, action_by, `before`, `after`, ext_id, ext_metadata) 
  VALUES ( op_name, tb_name, `type`, ent_id, u_id, before_state, after_state
  , e_id, e_md);
END;

