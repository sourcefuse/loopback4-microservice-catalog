-- Notification Users Table
CREATE  TABLE notification_users ( 
	id                   VARCHAR(36) NOT NULL PRIMARY KEY,
	notification_id      VARCHAR(36) NOT NULL,
	user_id              VARCHAR(36) NOT NULL,
	is_read              BOOLEAN DEFAULT false,
	action_meta          TEXT,
	deleted              BOOLEAN DEFAULT false,
	deleted_on           TIMESTAMP,
	deleted_by           VARCHAR(36),
	created_on           TIMESTAMP DEFAULT current_timestamp NOT NULL,
	modified_on          TIMESTAMP DEFAULT current_timestamp NOT NULL
 );
 
CREATE TRIGGER before_insert_trigger_notification_users
BEFORE INSERT ON notification_users
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- Notifications Table
CREATE TABLE notifications ( 
	id                   VARCHAR(36) NOT NULL PRIMARY KEY,
	subject              VARCHAR(100),
	body                 VARCHAR(250) NOT NULL,
	receiver             JSON NOT NULL,
 `type`                INT NOT NULL,
	sent                 TIMESTAMP DEFAULT current_timestamp,
  `options`            TEXT
 );


CREATE TRIGGER before_insert_trigger_notifications
BEFORE INSERT ON notifications
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

