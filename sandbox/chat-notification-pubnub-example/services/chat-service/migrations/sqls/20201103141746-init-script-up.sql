DROP SCHEMA IF EXISTS main
CASCADE;
CREATE SCHEMA main;
DROP SCHEMA IF EXISTS logs
CASCADE;
CREATE SCHEMA logs;

SET search_path
TO main,public;
GRANT ALL ON SCHEMA main TO public;

CREATE TABLE logs.audit_logs
(
    id uuid DEFAULT md5(random()
    ::text || clock_timestamp
    ()::text)::uuid NOT NULL ,
	operation_name       varchar
    (10)  NOT NULL ,
	operation_time       timestamptz DEFAULT now
    () NOT NULL ,
	"table_name"         varchar
    (60)  NOT NULL ,
	log_type             varchar
    (100) DEFAULT 'APPLICATION_LOGS'::character varying  ,
	entity_id            varchar,
	user_id              varchar,
	"before"             jsonb ,
	"after"              jsonb ,
	CONSTRAINT pk_audit_logs_id PRIMARY KEY ( id )
 );


 CREATE  TABLE main.messages ( 
	id                   uuid DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid NOT NULL ,
	body                 text  NOT NULL ,
	channel_id           uuid  NOT NULL ,
	channel_type         varchar(200)  NOT NULL ,
	created_by           uuid   ,
	created_on           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL ,
	deleted              bool DEFAULT false NOT NULL ,
	deleted_by           uuid   ,
	deleted_on           timestamptz DEFAULT current_timestamp NOT NULL ,
	modified_by          uuid   ,
	modified_on          timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL ,
	status               integer DEFAULT 0 NOT NULL ,
	subject              varchar(200)   ,
	to_user_id           uuid   ,
	parent_message_id    uuid   ,
	CONSTRAINT pk_messages_id PRIMARY KEY ( id )
 );

COMMENT ON COLUMN main.messages.body IS 'The message body';

COMMENT ON COLUMN main.messages.channel_id IS 'The id of the type of channel(for now task)';

COMMENT ON COLUMN main.messages.channel_type IS 'The type of channel for example task';

COMMENT ON COLUMN main.messages.subject IS 'subject of the message';

COMMENT ON COLUMN main.messages.to_user_id IS 'For P2P message transfer, this would be the id of the user to whom message is sent';

COMMENT ON COLUMN main.messages.parent_message_id IS 'id of the message at which this reply exists';

ALTER TABLE main.messages ADD CONSTRAINT fk_messages_messages FOREIGN KEY ( parent_message_id ) REFERENCES main.messages( id );

CREATE  TABLE main.message_recipients ( 
	id                   uuid DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid NOT NULL ,
	channel_id           uuid  NOT NULL ,
	created_by           uuid   ,
	created_on           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL ,
	deleted              bool DEFAULT false NOT NULL ,
	deleted_by           uuid   ,
	deleted_on           timestamptz DEFAULT current_timestamp  ,
	forwarded_by         uuid   ,
	is_favorite          bool DEFAULT false NOT NULL ,
	is_forwarded         bool DEFAULT false NOT NULL ,
	is_read              bool DEFAULT false NOT NULL ,
	message_id           uuid  NOT NULL ,
	modified_by          uuid   ,
	modified_on          timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL ,
	recipient_id         uuid  NOT NULL ,
	CONSTRAINT pk_message_recipients_id PRIMARY KEY ( id )
 );

COMMENT ON COLUMN main.message_recipients.channel_id IS 'the id of the channel entity(task)';

COMMENT ON COLUMN main.message_recipients.forwarded_by IS 'The user id of the person who forwardes the message';

COMMENT ON COLUMN main.message_recipients.recipient_id IS 'user id of the recipient';

ALTER TABLE main.message_recipients ADD CONSTRAINT fk_message_recipients_messages FOREIGN KEY ( message_id ) REFERENCES main.messages( id );

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
  user_id,
  after
  )
VALUES (
  TG_OP,
  TG_TABLE_NAME,
  TG_ARGV[0],
  ENTITY_ID,
  USER_ID,
  to_jsonb(NEW)
  );
RETURN NEW;
ELSIF TG_OP = 'UPDATE'
THEN
USER_ID := to_json(NEW)->'modified_by';
ENTITY_ID := to_json(NEW)->'id';
 INSERT INTO logs.audit_logs (
   operation_name,
   table_name,
   log_type,
   entity_id,
   user_id,
   before,
   after
   )
VALUES (
  TG_OP,
  TG_TABLE_NAME,
  TG_ARGV[0],
  ENTITY_ID,
  USER_ID,
  to_jsonb(OLD),
  to_jsonb(NEW)
  );
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
  user_id,
  before)
VALUES (
  TG_OP,
  TG_TABLE_NAME,
  TG_ARGV[0],
  ENTITY_ID,
  USER_ID,
  to_jsonb(OLD)
);
RETURN OLD;
END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION main.moddatetime()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.modified_on = now();
    RETURN NEW;
END;
$function$
;

CREATE TRIGGER mdt_messages BEFORE UPDATE ON main.messages FOR EACH ROW EXECUTE PROCEDURE main.moddatetime('modified_on');

CREATE TRIGGER mdt_message_recipients BEFORE UPDATE ON main.message_recipients FOR EACH ROW EXECUTE PROCEDURE main.moddatetime('modified_on');

CREATE TRIGGER messages_audit_trigger AFTER INSERT OR DELETE OR UPDATE ON main.messages FOR EACH ROW EXECUTE PROCEDURE logs.audit_trigger('MESSAGES_LOGS');

CREATE TRIGGER message_recipients_audit_trigger AFTER INSERT OR DELETE OR UPDATE ON main.message_recipients FOR EACH ROW EXECUTE PROCEDURE logs.audit_trigger('MESSAGE_RECIPIENTS_LOGS');
