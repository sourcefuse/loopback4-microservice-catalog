CREATE SCHEMA IF NOT EXISTS main;

SET search_path TO main,public;
GRANT ALL ON SCHEMA main TO public;

CREATE TABLE main.recent_search (
	id                      uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL ,
	user_id                 uuid NOT NULL,
	created_on              timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL ,
	modified_on             timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL ,
	created_by              uuid   ,
	modified_by             uuid   ,
	deleted                 bool DEFAULT false NOT NULL ,
	deleted_on           	timestamptz   ,
	deleted_by           	uuid   ,
	CONSTRAINT              recent_search_pkey PRIMARY KEY (id)
);

CREATE TABLE main.search_query (
	id                      uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL ,
    match                   text NOT NULL,
    "limit"                 integer NULL,
    "order"                 varchar(100) NULL,
    limit_by_type             boolean NULL,
    "offset"                integer NULL,
    sources                 json NULL,
	recent_search_id		uuid,
	CONSTRAINT              search_query_pk PRIMARY KEY (id)
);
alter table main.search_query add column created_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL ;
alter table main.search_query add column modified_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL ;
alter table main.search_query add column created_by uuid;
alter table main.search_query add column modified_by uuid;
alter table main.search_query add column deleted_on timestamptz;
alter table main.search_query add column deleted bool DEFAULT false NOT NULL ;
alter table main.search_query add column deleted_by uuid;

CREATE TABLE main.todo (
	id                      uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL ,
	name                   	text NOT NULL,
	description             text NOT NULL,
	CONSTRAINT              todo_pkey PRIMARY KEY (id)
);

CREATE TABLE main.user (
	id                      uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL ,
	username                text NOT NULL,
	about             		text NOT NULL,
	CONSTRAINT              user_pkey PRIMARY KEY (id)
);

ALTER TABLE main.search_query ADD CONSTRAINT fk_recent_search_in_query FOREIGN KEY ( recent_search_id ) REFERENCES main.recent_search( id );

CREATE OR REPLACE FUNCTION main.f_concat_ws(text, VARIADIC text[])
  RETURNS text LANGUAGE sql IMMUTABLE AS 'SELECT array_to_string($2, $1)';
