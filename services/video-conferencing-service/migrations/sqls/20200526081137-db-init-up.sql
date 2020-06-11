DROP SCHEMA IF EXISTS videochatms CASCADE;
CREATE SCHEMA videochatms;
GRANT ALL ON SCHEMA videochatms TO public;

CREATE TABLE videochatms.video_session_details
(
  id                integer NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  session_id 				varchar NOT NULL ,
  meeting_link 			varchar ,
  is_scheduled 			bool DEFAULT false NOT NULL ,
  schedule_time 		timestamptz ,
  is_archived 			bool DEFAULT false NOT NULL ,
  archive_id 				varchar ,
  upload_target			varchar,
  start_time				timestamptz,
  end_time					timestamptz,
  created_on 				timestamptz DEFAULT current_timestamp NOT NULL ,
  modified_on 			timestamptz ,
  is_deleted 				bool DEFAULT false NOT NULL ,
  created_by 				integer,
  modified_by 			integer,
  ext_id            varchar,
  ext_metadata      json
  CONSTRAINT "pk_video_session_details_id" PRIMARY KEY ( id )

);

CREATE TABLE videochatms.session_attendees
(
  id 						integer NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  session_id	 			varchar NOT NULL ,
  attendee 					varchar NOT NULL,
  created_on 				timestamptz DEFAULT current_timestamp NOT NULL ,
  modified_on 			timestamptz,
  is_deleted 				bool DEFAULT false NOT NULL,
  ext_id            varchar,
  ext_metadata      json
  CONSTRAINT pk_session_attendees_id PRIMARY KEY ( id )
);

CREATE TABLE videochatms.audit_logs
(
    id             		integer NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    "action" 				varchar NOT NULL,
    action_type       varchar	NOT NULL,
    actor       			varchar,
    acted_at  				timestamptz DEFAULT current_timestamp,
    acted_entity     	varchar	NOT NULL,
	  "before" 				  json,
	  "after" 				  json,
    reference        	varchar,
    ext_id            varchar,
    ext_metadata      json
    CONSTRAINT pk_audit_logs_id PRIMARY KEY (id)
);
