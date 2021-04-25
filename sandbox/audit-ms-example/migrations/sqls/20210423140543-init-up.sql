DROP SCHEMA IF EXISTS main CASCADE;
CREATE SCHEMA main;

SET search_path TO main,public;
GRANT ALL ON SCHEMA main TO public;

CREATE TABLE main.audit_logs (
	id                      uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL ,
	"action"                text NOT NULL,
	acted_at                timestamptz NOT NULL,
	acted_on                text NULL,
	action_key              text NOT NULL,
	entity_id               text NOT NULL,
	actor                   text NOT NULL,
	"before"                text NULL,
	"after"                 text NULL,
	action_group            text NULL,
	CONSTRAINT              audit_logs_pkey PRIMARY KEY (id)
);

CREATE TABLE main.todo (
	id                      uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL ,
	title                   text NOT NULL,
	description             text NOT NULL,
	items                   text NULL,
	CONSTRAINT              todo_pkey PRIMARY KEY (id)
);
