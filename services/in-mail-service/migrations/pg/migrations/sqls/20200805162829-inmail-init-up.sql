CREATE SCHEMA main;
SET search_path
TO main, public, logs;

CREATE extension IF NOT EXISTS "uuid-ossp";

CREATE TYPE visibility_type AS enum
('read', 'new','unread');

CREATE TYPE party_type_marker as enum
('from', 'to', 'cc', 'bcc');

CREATE TYPE storage_marker as enum
('draft', 'send', 'inbox', 'trash');

CREATE TABLE main.thread
(
id uuid NOT NULL DEFAULT uuid_generate_v1(),
subject text NOT NULL,
message_counts int4 NULL DEFAULT 1,
deleted boolean,
ext_id varchar,
ext_metadata jsonb,
created_by varchar,
modified_by varchar,
created_on timestamptz DEFAULT NOW(),
modified_on timestamptz,
CONSTRAINT thread_pkey PRIMARY KEY(id)
);

CREATE TABLE main.message
(
id uuid NOT NULL DEFAULT uuid_generate_v1(),
sender text NOT NULL,
subject text NOT NULL,
body text NOT NULL,
status storage_marker NOT NULL DEFAULT 'draft'::storage_marker,
thread_id uuid NOT NULL REFERENCES thread(id),
deleted boolean,
ext_id varchar,
ext_metadata jsonb,
created_by varchar,
modified_by varchar,
created_on timestamptz DEFAULT NOW(),
modified_on timestamptz,
CONSTRAINT message_pkey PRIMARY KEY(id)
);

CREATE TABLE main.attachment
(
id uuid NOT NULL DEFAULT uuid_generate_v1(),
"name" text NOT NULL,
"path" text NOT NULL,
thumbnail text NOT NULL,
mime text NOT NULL,
message_id uuid NOT NULL REFERENCES message(id),
deleted boolean,
ext_id varchar,
ext_metadata jsonb,
created_by varchar,
modified_by varchar,
created_on timestamptz DEFAULT NOW(),
modified_on timestamptz,
CONSTRAINT attachment_pkey PRIMARY KEY (id)
);

CREATE TABLE main.group
(
id uuid NOT NULL DEFAULT uuid_generate_v1(),
party varchar NOT NULL,
"type" party_type_marker,
"storage" storage_marker DEFAULT 'inbox'::storage_marker,
visibility visibility_type DEFAULT 'new'::visibility_type,
message_id uuid NOT NULL REFERENCES message(id),
thread_id uuid NOT NULL REFERENCES thread(id),
is_important boolean,
deleted boolean,
ext_id varchar,
ext_metadata jsonb,
created_by varchar,
modified_by varchar,
created_on timestamptz DEFAULT NOW(),
modified_on timestamptz,
CONSTRAINT group_pkey PRIMARY KEY(id)
);

CREATE TABLE main.meta
(
id uuid NOT NULL DEFAULT uuid_generate_v1(),
"key" text NOT NULL,
value text NULL,
message_id uuid NOT NULL REFERENCES message(id),
deleted boolean,
ext_id varchar,
ext_metadata jsonb,
created_by varchar,
modified_by varchar,
created_on timestamptz DEFAULT NOW(),
modified_on timestamptz
);

create schema logs;


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

CREATE TRIGGER attachment_audit_trigger
AFTER UPDATE OR INSERT OR DELETE
ON main.attachment
FOR EACH ROW
EXECUTE PROCEDURE logs.audit_trigger('attachment');

CREATE TRIGGER message_audit_trigger
AFTER UPDATE OR INSERT OR DELETE
ON main.message
FOR EACH ROW
EXECUTE PROCEDURE logs.audit_trigger('message');

CREATE TRIGGER meta_audit_trigger
AFTER UPDATE OR INSERT OR DELETE
ON main.meta
FOR EACH ROW
EXECUTE PROCEDURE logs.audit_trigger('meta');

CREATE TRIGGER group_audit_trigger
AFTER UPDATE OR INSERT OR DELETE
ON main.group
FOR EACH ROW
EXECUTE PROCEDURE logs.audit_trigger('group');

CREATE TRIGGER thread_audit_trigger
AFTER UPDATE OR INSERT OR DELETE
ON main.thread
FOR EACH ROW
EXECUTE PROCEDURE logs.audit_trigger('thread');
