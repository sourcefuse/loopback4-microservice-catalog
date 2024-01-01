CREATE TABLE video_session_details (
  id                INTEGER NOT NULL AUTO_INCREMENT,
  session_id 				VARCHAR(255) NOT NULL UNIQUE,
  meeting_link 			VARCHAR(255) UNIQUE,
  is_scheduled 			BOOL DEFAULT false NOT NULL,
  schedule_time 		TIMESTAMP,
  is_archived 			BOOL DEFAULT false NOT NULL,
  archive_id 				VARCHAR(255),
  upload_target			VARCHAR(255),
  start_time				TIMESTAMP,
  end_time					TIMESTAMP,
  created_on 				TIMESTAMP DEFAULT current_timestamp NOT NULL,
  modified_on 			TIMESTAMP,
  deleted 				  BOOL DEFAULT false NOT NULL,
  created_by 				VARCHAR(255),
  modified_by 			VARCHAR(255),
  ext_id            VARCHAR(255),
  ext_metadata      JSON,
  PRIMARY KEY (id)

);

CREATE TABLE session_attendees (
  id 						    INTEGER NOT NULL AUTO_INCREMENT,
  session_id	 			VARCHAR(255) NOT NULL,
  attendee 					VARCHAR(255) NOT NULL,
  created_on 				TIMESTAMP DEFAULT current_timestamp NOT NULL,
  modified_on 			TIMESTAMP,
  is_deleted 				BOOL DEFAULT false NOT NULL,
  ext_id            VARCHAR(255),
  ext_metadata      JSON,
  PRIMARY KEY (id)
);

CREATE TABLE audit_logs (
    id             		INTEGER NOT NULL AUTO_INCREMENT,
    `action` 				  VARCHAR(255) NOT NULL,
    action_type       VARCHAR(255) NOT NULL,
    actor       			VARCHAR(255),
    acted_at  				TIMESTAMP DEFAULT current_timestamp,
    acted_entity     	VARCHAR(255),
	  `before` 				  JSON,
	  `after` 				  JSON,
    reference        	VARCHAR(255),
    ext_id            VARCHAR(255),
    ext_metadata      JSON,
    PRIMARY KEY (id)
);
