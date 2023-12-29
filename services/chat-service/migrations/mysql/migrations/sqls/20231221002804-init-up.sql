-- Audit logs table
CREATE TABLE audit_logs (
  id                   VARCHAR(36)  NOT NULL PRIMARY KEY,
	operation_name       VARCHAR (10)  NOT NULL,
	operation_time       TIMESTAMP NOT NULL,
	`table_name`         VARCHAR (60)  NOT NULL,
	log_type             VARCHAR (100) DEFAULT 'APPLICATION_LOGS',
	entity_id            VARCHAR(36),
	user_id              VARCHAR(36),
	`before`             JSON,
	`after`              JSON
);

-- Adding triggers
CREATE TRIGGER before_insert_trigger_audit_logs_operation_time
BEFORE INSERT ON audit_logs
FOR EACH ROW
SET NEW.operation_time = IFNULL(NEW.operation_time, now());

CREATE TRIGGER before_insert_trigger_audit_logs
BEFORE INSERT ON audit_logs
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- Messages table
CREATE TABLE messages ( 
  id                   VARCHAR(36) NOT NULL PRIMARY KEY,
  body                 TEXT  NOT NULL,
  channel_id           VARCHAR(36) NOT NULL,
  channel_type         VARCHAR(200) NOT NULL,
  created_by           VARCHAR(36),
  created_on           TIMESTAMP DEFAULT current_timestamp NOT NULL,
  deleted              BOOL DEFAULT false NOT NULL,
  deleted_by           VARCHAR(36),
  deleted_on           TIMESTAMP DEFAULT current_timestamp NOT NULL,
  modified_by          VARCHAR(36),
  modified_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
  status               INTEGER DEFAULT 0 NOT NULL,
  subject              VARCHAR(200),
  to_user_id           VARCHAR(36),
  parent_message_id    VARCHAR(36)
);

-- Adding triggers
CREATE TRIGGER before_insert_trigger_messages
BEFORE INSERT ON messages 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER mdt_messages
BEFORE UPDATE ON messages 
FOR EACH ROW
SET NEW.modified_on = now();

-- Adding comments 
ALTER TABLE messages MODIFY COLUMN body TEXT COMMENT 'The message body';
ALTER TABLE messages MODIFY COLUMN channel_id VARCHAR(36) COMMENT 'The id of the type of channel (for now task)';
ALTER TABLE messages MODIFY COLUMN channel_type VARCHAR(50) COMMENT 'The type of channel, for example, task';
ALTER TABLE messages MODIFY COLUMN subject VARCHAR(255) COMMENT 'Subject of the message';
ALTER TABLE messages MODIFY COLUMN to_user_id VARCHAR(36) COMMENT 'For P2P message transfer, this would be the id of the user to whom the message is sent';
ALTER TABLE messages MODIFY COLUMN parent_message_id VARCHAR(36) COMMENT 'Id of the message at which this reply exists';

-- Adding foreign keys
ALTER TABLE messages 
ADD CONSTRAINT fk_messages_messages 
FOREIGN KEY (parent_message_id) 
REFERENCES messages(id);

-- Message Recipients table
CREATE  TABLE message_recipients ( 
	id                   VARCHAR(36) NOT NULL,
	channel_id           VARCHAR(36) NOT NULL,
	created_by           VARCHAR(36),
	created_on           TIMESTAMP DEFAULT current_timestamp NOT NULL,
	deleted              BOOL DEFAULT false NOT NULL,
	deleted_by           VARCHAR(36),
	deleted_on           TIMESTAMP DEFAULT current_timestamp,
	forwarded_by         VARCHAR(36),
	is_favorite          BOOL DEFAULT false NOT NULL,
	is_forwarded         BOOL DEFAULT false NOT NULL,
	is_read              BOOL DEFAULT false NOT NULL,
	message_id           VARCHAR(36) NOT NULL,
	modified_by          VARCHAR(36),
	modified_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
	recipient_id         VARCHAR(36) NOT NULL
);

-- Adding triggers 
CREATE TRIGGER before_insert_trigger_messages_recipients
BEFORE INSERT ON message_recipients
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER mdt_message_recipients
BEFORE UPDATE ON message_recipients 
FOR EACH ROW
SET NEW.modified_on = now();

-- Adding comments 
ALTER TABLE message_recipients MODIFY COLUMN channel_id VARCHAR(36) COMMENT 'The id of the channel entity (task)';
ALTER TABLE message_recipients MODIFY COLUMN forwarded_by VARCHAR(36) COMMENT 'The user id of the person who forwards the message';
ALTER TABLE message_recipients MODIFY COLUMN recipient_id VARCHAR(36) COMMENT 'User id of the recipient';

-- Adding foreign keys
ALTER TABLE message_recipients
ADD CONSTRAINT fk_message_recipients_messages
FOREIGN KEY (message_id)
REFERENCES messages(id);

-- INSERT audit triggers in messages and message_recipients table
CREATE TRIGGER after_insert_messages_audit_trigger
AFTER INSERT ON messages
FOR EACH ROW
BEGIN
  INSERT INTO audit_logs(operation_name, `table_name`,
      log_type, entity_id, user_id, after) 
  VALUES ( 'INSERT', 'messages', 'MESSAGES_LOGS', 
	  NEW.id, 
	  NEW.created_by,
    JSON_OBJECT(
      "id", NEW.id,
      "body", NEW.body,
      "channel_id", NEW.channel_id,
      "channel_type", NEW.channel_type,
      "created_by", NEW.created_by,
      "created_on", NEW.created_on,
      "deleted", NEW.deleted,
      "deleted_by", NEW.deleted_by,
      "deleted_on", NEW.deleted_on,
      "modified_by", NEW.modified_by,
      "modified_on", NEW.modified_on,
      "status", NEW.status,
      "subject", NEW.subject,
      "to_user_id", NEW.to_user_id,
      "parent_message_id", NEW.parent_message_id
    )
);
END; 

CREATE TRIGGER after_insert_message_recipients_audit_trigger
AFTER INSERT ON message_recipients
FOR EACH ROW
BEGIN
  INSERT INTO audit_logs(operation_name, `table_name`,
      log_type, entity_id, user_id, after) 
  VALUES ( 'INSERT', 'message_recipients', 'MESSAGE_RECIPIENTS_LOGS', 
	  NEW.id, 
	  NEW.created_by, 
    JSON_OBJECT(
      "id", NEW.id,
      "channel_id", NEW.channel_id,
      "created_by", NEW.created_by,
      "created_on", NEW.created_on,
      "deleted", NEW.deleted,
      "deleted_by", NEW.deleted_by,
      "deleted_on", NEW.deleted_on,
      "forwarded_by", NEW.forwarded_by,
      "is_favorite", NEW.is_favorite,
      "is_forwarded", NEW.is_forwarded,
      "is_read", NEW.is_read,
      "message_id", NEW.message_id,
      "modified_by", NEW.modified_by,
      "modified_on", NEW.modified_on,
      "recipient_id", NEW.recipient_id
    )
);
END;


-- UPDATE audit triggers in messages and message_recipients table
CREATE TRIGGER after_update_messages_audit_trigger
AFTER UPDATE ON messages
FOR EACH ROW
BEGIN
  INSERT INTO audit_logs(operation_name, `table_name`,
      log_type, entity_id, user_id, `before`, after) 
  VALUES ( 'UPDATE', 'messages', 'MESSAGES_LOGS', 
	  NEW.id, 
	  NEW.modified_by,
    JSON_OBJECT(
      "id", OLD.id,
      "body", OLD.body,
      "channel_id", OLD.channel_id,
      "channel_type", OLD.channel_type,
      "created_by", OLD.created_by,
      "created_on", OLD.created_on,
      "deleted", OLD.deleted,
      "deleted_by", OLD.deleted_by,
      "deleted_on", OLD.deleted_on,
      "modified_by", OLD.modified_by,
      "modified_on", OLD.modified_on,
      "status", OLD.status,
      "subject", OLD.subject,
      "to_user_id", OLD.to_user_id,
      "parent_message_id", OLD.parent_message_id
    ),
    JSON_OBJECT(
      "id", NEW.id,
      "body", NEW.body,
      "channel_id", NEW.channel_id,
      "channel_type", NEW.channel_type,
      "created_by", NEW.created_by,
      "created_on", NEW.created_on,
      "deleted", NEW.deleted,
      "deleted_by", NEW.deleted_by,
      "deleted_on", NEW.deleted_on,
      "modified_by", NEW.modified_by,
      "modified_on", NEW.modified_on,
      "status", NEW.status,
      "subject", NEW.subject,
      "to_user_id", NEW.to_user_id,
      "parent_message_id", NEW.parent_message_id
    )
);
END; 

CREATE TRIGGER after_update_message_recipients_audit_trigger
AFTER UPDATE ON message_recipients
FOR EACH ROW
BEGIN
  INSERT INTO audit_logs(operation_name, `table_name`,
      log_type, entity_id, user_id, `before`, after) 
  VALUES ( 'UPDATE', 'message_recipients', 'MESSAGE_RECIPIENTS_LOGS', 
	  NEW.id, 
	  NEW.modified_by, 
    JSON_OBJECT(
      "id", OLD.id,
      "channel_id", OLD.channel_id,
      "created_by", OLD.created_by,
      "created_on", OLD.created_on,
      "deleted", OLD.deleted,
      "deleted_by", OLD.deleted_by,
      "deleted_on", OLD.deleted_on,
      "forwarded_by", OLD.forwarded_by,
      "is_favorite", OLD.is_favorite,
      "is_forwarded", OLD.is_forwarded,
      "is_read", OLD.is_read,
      "message_id", OLD.message_id,
      "modified_by", OLD.modified_by,
      "modified_on", OLD.modified_on,
      "recipient_id", OLD.recipient_id
    ),
    JSON_OBJECT(
      "id", NEW.id,
      "channel_id", NEW.channel_id,
      "created_by", NEW.created_by,
      "created_on", NEW.created_on,
      "deleted", NEW.deleted,
      "deleted_by", NEW.deleted_by,
      "deleted_on", NEW.deleted_on,
      "forwarded_by", NEW.forwarded_by,
      "is_favorite", NEW.is_favorite,
      "is_forwarded", NEW.is_forwarded,
      "is_read", NEW.is_read,
      "message_id", NEW.message_id,
      "modified_by", NEW.modified_by,
      "modified_on", NEW.modified_on,
      "recipient_id", NEW.recipient_id
    )
);
END;

-- DELETE audit triggers in messages and message_recipients table
CREATE TRIGGER after_delete_messages_audit_trigger
AFTER DELETE ON messages
FOR EACH ROW
BEGIN
  INSERT INTO audit_logs(operation_name, `table_name`,
      log_type, entity_id, user_id, `before`) 
  VALUES ( 'DELETE', 'messages', 'MESSAGES_LOGS', 
	  OLD.id, 
	  OLD.modified_by,
    JSON_OBJECT(
      "id", OLD.id,
      "body", OLD.body,
      "channel_id", OLD.channel_id,
      "channel_type", OLD.channel_type,
      "created_by", OLD.created_by,
      "created_on", OLD.created_on,
      "deleted", OLD.deleted,
      "deleted_by", OLD.deleted_by,
      "deleted_on", OLD.deleted_on,
      "modified_by", OLD.modified_by,
      "modified_on", OLD.modified_on,
      "status", OLD.status,
      "subject", OLD.subject,
      "to_user_id", OLD.to_user_id,
      "parent_message_id", OLD.parent_message_id
    )
);
END; 

CREATE TRIGGER after_delete_message_recipients_audit_trigger
AFTER DELETE ON message_recipients
FOR EACH ROW
BEGIN
  INSERT INTO audit_logs(operation_name, `table_name`,
      log_type, entity_id, user_id, `before`) 
  VALUES ( 'DELETE', 'message_recipients', 'MESSAGE_RECIPIENTS_LOGS', 
	  OLD.id, 
	  OLD.modified_by, 
    JSON_OBJECT(
      "id", OLD.id,
      "channel_id", OLD.channel_id,
      "created_by", OLD.created_by,
      "created_on", OLD.created_on,
      "deleted", OLD.deleted,
      "deleted_by", OLD.deleted_by,
      "deleted_on", OLD.deleted_on,
      "forwarded_by", OLD.forwarded_by,
      "is_favorite", OLD.is_favorite,
      "is_forwarded", OLD.is_forwarded,
      "is_read", OLD.is_read,
      "message_id", OLD.message_id,
      "modified_by", OLD.modified_by,
      "modified_on", OLD.modified_on,
      "recipient_id", OLD.recipient_id
    )
);
END;
