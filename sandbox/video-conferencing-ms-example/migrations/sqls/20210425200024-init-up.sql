DROP SCHEMA IF EXISTS main CASCADE;
CREATE SCHEMA main;

SET search_path TO main,public;
GRANT ALL ON SCHEMA main TO public;

CREATE SEQUENCE main.audit_logs_id_seq START WITH 1;

CREATE SEQUENCE main.session_attendees_id_seq START WITH 1;

CREATE SEQUENCE main.video_session_details_id_seq START WITH 1;

CREATE  TABLE main.audit_logs ( 
	id                   integer DEFAULT nextval('main.audit_logs_id_seq'::regclass) NOT NULL ,
	"action"             text  NOT NULL ,
	action_type          text  NOT NULL ,
	actor                text   ,
	acted_at             timestamptz   ,
	acted_entity         text   ,
	"before"             text   ,
	"after"              text   ,
	reference            text   ,
	ext_id               text   ,
	ext_metadata         text   ,
	CONSTRAINT audit_logs_pkey PRIMARY KEY ( id )
 ) ;

CREATE  TABLE main.session_attendees ( 
	id                   integer DEFAULT nextval('main.session_attendees_id_seq'::regclass) NOT NULL ,
	session_id           text  NOT NULL ,
	attendee             text  NOT NULL ,
	created_on           timestamptz  NOT NULL ,
	modified_on          timestamptz   ,
	is_deleted           boolean  NOT NULL ,
	ext_id               text   ,
	ext_metadata         text   ,
	CONSTRAINT session_attendees_pkey PRIMARY KEY ( id )
 ) ;

CREATE  TABLE main.video_session_details ( 
	deleted              boolean DEFAULT false  ,
	deleted_on           timestamptz   ,
	deleted_by           text   ,
	created_on           timestamptz   ,
	modified_on          timestamptz   ,
	created_by           text   ,
	modified_by          text   ,
	id                   integer DEFAULT nextval('main.video_session_details_id_seq'::regclass) NOT NULL ,
	session_id           text  NOT NULL ,
	meeting_link         text  NOT NULL ,
	is_scheduled         boolean DEFAULT false NOT NULL ,
	schedule_time        timestamptz   ,
	is_archived          boolean DEFAULT false NOT NULL ,
	archive_id           text   ,
	upload_target        text   ,
	start_time           timestamptz   ,
	end_time             timestamptz   ,
	ext_id               text   ,
	ext_metadata         text   ,
	CONSTRAINT video_session_details_pkey PRIMARY KEY ( id )
 ) ;