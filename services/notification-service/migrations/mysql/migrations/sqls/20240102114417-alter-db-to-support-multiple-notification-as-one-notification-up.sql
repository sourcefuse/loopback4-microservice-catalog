/* Replace with your SQL commands */

ALTER TABLE main.notifications
ADD COLUMN IF NOT EXISTS  is_draft BOOLEAN default FALSE;

ALTER TABLE main.notifications
ADD COLUMN IF NOT EXISTS is_critical BOOLEAN default FALSE;

ALTER TABLE main.notifications
ADD COLUMN IF NOT EXISTS group_key VARCHAR(256);


ALTER TABLE main.notification_users
ADD COLUMN IF NOT EXISTS is_read BOOLEAN default FALSE;

ALTER TABLE main.notification_users
ADD COLUMN IF NOT EXISTS is_sent BOOLEAN default FALSE;


-- Table: main.user_notification_settings
CREATE TABLE IF NOT EXISTS main.user_notification_settings
(
	id                    uuid VARCHAR(36) NOT NULL PRIMARY KEY,
    notification_type     integer NOT NULL,
    user_id               VARCHAR (250) NOT NULL,
    sleep_start_time      TIMESTAMP DEFAULT current_timestamp NOT NULL,
    sleep_end_time        TIMESTAMP DEFAULT current_timestamp NOT NULL,
    deleted               BOOLEAN DEFAULT false,
    deleted_on            TIMESTAMP ,
    deleted_by            VARCHAR(36),
    created_on            TIMESTAMP DEFAULT current_timestamp NOT NULL,
    modified_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
);
CREATE TRIGGER before_insert_trigger_notification_users
BEFORE INSERT ON notification_users
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());