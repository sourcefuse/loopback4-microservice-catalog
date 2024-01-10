/* Replace with your SQL commands */
ALTER TABLE video_session_details ADD COLUMN IF NOT  EXISTS  deleted_by VARCHAR(36);
ALTER TABLE video_session_details ADD COLUMN IF NOT EXISTS  deleted_on TIMESTAMP DEFAULT current_timestamp NOT NULL;