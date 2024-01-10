/* Replace with your SQL commands */
ALTER TABLE videochatms.video_session_details ADD COLUMN IF NOT  EXISTS  deleted_by varchar;
ALTER TABLE videochatms.video_session_details ADD COLUMN IF NOT EXISTS  deleted_on timestamptz DEFAULT current_timestamp NOT NULL;