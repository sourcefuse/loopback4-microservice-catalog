-- creating table for storing threads
CREATE TABLE IF NOT EXISTS thread (
  id                VARCHAR(36) PRIMARY KEY,
  subject           TEXT NOT NULL,
  message_counts    INT NULL DEFAULT 1,
  deleted           BOOLEAN,
  deleted_on        TIMESTAMP,
  deleted_by        VARCHAR(36),
  ext_id            VARCHAR(255),
  ext_metadata      JSON,
  created_by        VARCHAR(255),
  modified_by       VARCHAR(255),
  created_on        TIMESTAMP DEFAULT current_timestamp,
  modified_on       TIMESTAMP
);

-- adding triggers
CREATE TRIGGER thread_identity
BEFORE INSERT ON thread
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- creating table for storing messages
CREATE TABLE IF NOT EXISTS message (
  id             VARCHAR(36) PRIMARY KEY,
  sender         TEXT NOT NULL,
  subject        TEXT NOT NULL,
  body           TEXT NOT NULL,
  status         ENUM('draft', 'send', 'inbox', 'trash' ) DEFAULT 'draft',
  thread_id      VARCHAR(36) NOT NULL REFERENCES thread(id),
  deleted        BOOLEAN,
  deleted_on     TIMESTAMP,
  deleted_by     VARCHAR(36),
  ext_id         VARCHAR(255),
  ext_metadata   JSON,
  created_by     VARCHAR(255),
  modified_by    VARCHAR(255),
  created_on     TIMESTAMP DEFAULT current_timestamp,
  modified_on    TIMESTAMP
);

-- adding triggers
CREATE TRIGGER message_identity
BEFORE INSERT ON message
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- creating table for storing attachments
CREATE TABLE IF NOT EXISTS attachment (
  id             VARCHAR(36) PRIMARY KEY,
  `name`         TEXT NOT NULL,
  `path`         TEXT NOT NULL,
  thumbnail      TEXT NOT NULL,
  mime           TEXT NOT NULL,
  message_id     VARCHAR(36) NOT NULL REFERENCES message(id),
  deleted        BOOLEAN,
  deleted_on     TIMESTAMP,
  deleted_by     VARCHAR(36),
  ext_id         VARCHAR(255),
  ext_metadata   JSON,
  created_by     VARCHAR(255),
  modified_by    VARCHAR(255),
  created_on     TIMESTAMP DEFAULT current_timestamp,
  modified_on    TIMESTAMP
);

-- adding triggers
CREATE TRIGGER attachment_identity
BEFORE INSERT ON attachment
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- creating table for storing groups
CREATE TABLE IF NOT EXISTS `group` (
  id             VARCHAR(36) PRIMARY KEY,
  party          VARCHAR(255) NOT NULL,
  `type`         ENUM('from', 'to', 'cc', 'bcc'),
  `storage`      ENUM('draft', 'send', 'inbox', 'trash') DEFAULT 'draft',
  visibility     ENUM('read', 'new', 'unread') DEFAULT 'new',
  message_id     VARCHAR(36) NOT NULL REFERENCES message(id),
  thread_id      VARCHAR(36) NOT NULL REFERENCES thread(id),
  is_important   BOOLEAN,
  deleted        BOOLEAN,
  deleted_on     TIMESTAMP,
  deleted_by     VARCHAR(36),
  ext_id         VARCHAR(255),
  ext_metadata   JSON,
  created_by     VARCHAR(255),
  modified_by    VARCHAR(255),
  created_on     TIMESTAMP DEFAULT current_timestamp,
  modified_on    TIMESTAMP
);

-- adding triggers
CREATE TRIGGER group_identity
BEFORE INSERT ON `group`
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- creating table for storing meta
CREATE TABLE IF NOT EXISTS meta (
  id             VARCHAR(36) PRIMARY KEY,
  `key`          TEXT NOT NULL,
  value          TEXT NULL,
  message_id     VARCHAR(36) NOT NULL REFERENCES message(id),
  deleted        BOOLEAN,
  deleted_on     TIMESTAMP,
  deleted_by     VARCHAR(36),
  ext_id         VARCHAR(255),
  ext_metadata   JSON,
  created_by     VARCHAR(255),
  modified_by    VARCHAR(255),
  created_on     TIMESTAMP DEFAULT current_timestamp,
  modified_on    TIMESTAMP
);

-- adding triggers
CREATE TRIGGER meta_identity
BEFORE INSERT ON meta
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- creating table for storing audits
CREATE TABLE IF NOT EXISTS audit_logs (
  id             VARCHAR(36) PRIMARY KEY,
  action_by      VARCHAR(255),
  `after`        JSON,
  `before`       JSON,
  entity_id      VARCHAR(255),
  log_type       VARCHAR(100) DEFAULT 'APPLICATION_LOGS',
  operation_name VARCHAR(10) NOT NULL,
  operation_time TIMESTAMP DEFAULT current_timestamp NOT NULL,
  `table_name`   VARCHAR(60) NOT NULL,
  ext_id         VARCHAR(255),
  ext_metadata   JSON
);

-- adding comments
ALTER TABLE audit_logs
COMMENT 'DB trigger based audit_logs';

ALTER TABLE audit_logs
MODIFY COLUMN action_by VARCHAR(255) COMMENT 'Person/User Email ID.';

-- adding triggers
CREATE TRIGGER audit_logs_identity
BEFORE INSERT ON audit_logs
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- creating an generic AUDIT procedure
CREATE PROCEDURE generic_audit_procedure( op_name VARCHAR(10), tb_name VARCHAR(60),
  `type` VARCHAR(100), ent_id VARCHAR(36), u_id VARCHAR(36),
  before_state JSON, after_state JSON, e_id VARCHAR(255), e_md JSON)
BEGIN
  INSERT INTO audit_logs ( operation_name, table_name, log_type,
    entity_id, action_by, `before`, `after`, ext_id, ext_metadata) 
  VALUES ( op_name, tb_name, `type`, ent_id, u_id, before_state, after_state
  , e_id, e_md);
END;

-- adding INSERT audit_triggers
CREATE TRIGGER insert_attatchment_audit_trigger
AFTER INSERT ON attachment
FOR EACH ROW
CALL generic_audit_procedure('INSERT','attachment','attachment', 
NEW.id, NEW.created_by, NULL, JSON_OBJECT(
    "id", NEW.id,
    "name", NEW.name,
    "path", NEW.path,
    "thumbnail", NEW.thumbnail,
    "mime", NEW.mime,
    "message_id", NEW.message_id,
    "deleted", NEW.deleted,
    "deleted_on", NEW.deleted_on,
    "deleted_by", NEW.deleted_by,
    "ext_id", NEW.ext_id,
    "ext_metadata", NEW.ext_metadata,
    "created_by", NEW.created_by,
    "modified_by", NEW.modified_by,
    "created_on", NEW.created_on,
    "modified_on", NEW.modified_on
  ), NEW.ext_id, NEW.ext_metadata
);

CREATE TRIGGER insert_message_audit_trigger
AFTER INSERT ON message
FOR EACH ROW
CALL generic_audit_procedure('INSERT','message','message', 
NEW.id, NEW.created_by, NULL, JSON_OBJECT(
  "id", NEW.id,
  "sender", NEW.sender,
  "subject", NEW.subject,
  "body", NEW.body,
  "status", NEW.status,
  "thread_id", NEW.thread_id,
  "deleted", NEW.deleted,
  "deleted_on", NEW.deleted_on,
  "deleted_by", NEW.deleted_by,
  "ext_id", NEW.ext_id,
  "ext_metadata", NEW.ext_metadata,
  "created_by", NEW.created_by,
  "modified_by", NEW.modified_by,
  "created_on", NEW.created_on,
  "modified_on", NEW.modified_on
  ), NEW.ext_id, NEW.ext_metadata
);


CREATE TRIGGER insert_meta_audit_trigger
AFTER INSERT ON meta
FOR EACH ROW
CALL generic_audit_procedure('INSERT','meta','meta', 
NEW.id, NEW.created_by, NULL, JSON_OBJECT(
    "id", NEW.id,
    "key", NEW.key,
    "value", NEW.value,
    "message_id", NEW.message_id,
    "deleted", NEW.deleted,
    "deleted_on", NEW.deleted_on,
    "deleted_by", NEW.deleted_by,
    "ext_id", NEW.ext_id,
    "ext_metadata", NEW.ext_metadata,
    "created_by", NEW.created_by,
    "modified_by", NEW.modified_by,
    "created_on", NEW.created_on,
    "modified_on", NEW.modified_on
  ), NEW.ext_id, NEW.ext_metadata
);

CREATE TRIGGER insert_group_audit_trigger
AFTER INSERT ON `group`
FOR EACH ROW
CALL generic_audit_procedure('INSERT','group','group', 
NEW.id, NEW.created_by, NULL, JSON_OBJECT(
    "id", NEW.id,
    "party", NEW.party,
    "type", NEW.type,
    "storage", NEW.storage,
    "visibility", NEW.visibility,
    "message_id", NEW.message_id,
    "thread_id", NEW.thread_id,
    "is_important", NEW.is_important,
    "deleted", NEW.deleted,
    "deleted_on", NEW.deleted_on,
    "deleted_by", NEW.deleted_by,
    "ext_id", NEW.ext_id,
    "ext_metadata", NEW.ext_metadata,
    "created_by", NEW.created_by,
    "modified_by", NEW.modified_by,
    "created_on", NEW.created_on,
    "modified_on", NEW.modified_on
  ), NEW.ext_id, NEW.ext_metadata
);

CREATE TRIGGER insert_thread_audit_trigger
AFTER INSERT ON thread
FOR EACH ROW
CALL generic_audit_procedure('INSERT','thread','thread', 
NEW.id, NEW.created_by, NULL, JSON_OBJECT(
    "id", NEW.id,
    "subject", NEW.subject,
    "message_counts", NEW.message_counts,
    "deleted", NEW.deleted,
    "deleted_on", NEW.deleted_on,
    "deleted_by", NEW.deleted_by,
    "ext_id", NEW.ext_id,
    "ext_metadata", NEW.ext_metadata,
    "created_by", NEW.created_by,
    "modified_by", NEW.modified_by,
    "created_on", NEW.created_on,
    "modified_on", NEW.modified_on
  ), NEW.ext_id, NEW.ext_metadata
);

-- adding UPDATE triggers
CREATE TRIGGER update_attatchment_audit_trigger
AFTER UPDATE ON attachment
FOR EACH ROW
CALL generic_audit_procedure('UPDATE','attachment','attachment', 
NEW.id, NEW.modified_by, JSON_OBJECT(
    "id", OLD.id,
    "name", OLD.name,
    "path", OLD.path,
    "thumbnail", OLD.thumbnail,
    "mime", OLD.mime,
    "message_id", OLD.message_id,
    "deleted", OLD.deleted,
    "deleted_on", OLD.deleted_on,
    "deleted_by", OLD.deleted_by,
    "ext_id", OLD.ext_id,
    "ext_metadata", OLD.ext_metadata,
    "created_by", OLD.created_by,
    "modified_by", OLD.modified_by,
    "created_on", OLD.created_on,
    "modified_on", OLD.modified_on
  ), JSON_OBJECT(
    "id", NEW.id,
    "name", NEW.name,
    "path", NEW.path,
    "thumbnail", NEW.thumbnail,
    "mime", NEW.mime,
    "message_id", NEW.message_id,
    "deleted", NEW.deleted,
    "deleted_on", NEW.deleted_on,
    "deleted_by", NEW.deleted_by,
    "ext_id", NEW.ext_id,
    "ext_metadata", NEW.ext_metadata,
    "created_by", NEW.created_by,
    "modified_by", NEW.modified_by,
    "created_on", NEW.created_on,
    "modified_on", NEW.modified_on
  ), NEW.ext_id, NEW.ext_metadata
);

CREATE TRIGGER update_message_audit_trigger
AFTER UPDATE ON message
FOR EACH ROW
CALL generic_audit_procedure('UPDATE','message','message', 
NEW.id, NEW.modified_by, JSON_OBJECT(
  "id", OLD.id,
  "sender", OLD.sender,
  "subject", OLD.subject,
  "body", OLD.body,
  "status", OLD.status,
  "thread_id", OLD.thread_id,
  "deleted", OLD.deleted,
  "deleted_on", OLD.deleted_on,
  "deleted_by", OLD.deleted_by,
  "ext_id", OLD.ext_id,
  "ext_metadata", OLD.ext_metadata,
  "created_by", OLD.created_by,
  "modified_by", OLD.modified_by,
  "created_on", OLD.created_on,
  "modified_on", OLD.modified_on
  ), JSON_OBJECT(
  "id", NEW.id,
  "sender", NEW.sender,
  "subject", NEW.subject,
  "body", NEW.body,
  "status", NEW.status,
  "thread_id", NEW.thread_id,
  "deleted", NEW.deleted,
  "deleted_on", NEW.deleted_on,
  "deleted_by", NEW.deleted_by,
  "ext_id", NEW.ext_id,
  "ext_metadata", NEW.ext_metadata,
  "created_by", NEW.created_by,
  "modified_by", NEW.modified_by,
  "created_on", NEW.created_on,
  "modified_on", NEW.modified_on
  ), NEW.ext_id, NEW.ext_metadata
);


CREATE TRIGGER update_meta_audit_trigger
AFTER UPDATE ON meta
FOR EACH ROW
CALL generic_audit_procedure('UPDATE','meta','meta', 
NEW.id, NEW.modified_by, JSON_OBJECT(
    "id", OLD.id,
    "key", OLD.key,
    "value", OLD.value,
    "message_id", OLD.message_id,
    "deleted", OLD.deleted,
    "deleted_on", OLD.deleted_on,
    "deleted_by", OLD.deleted_by,
    "ext_id", OLD.ext_id,
    "ext_metadata", OLD.ext_metadata,
    "created_by", OLD.created_by,
    "modified_by", OLD.modified_by,
    "created_on", OLD.created_on,
    "modified_on", OLD.modified_on
  ), JSON_OBJECT(
    "id", NEW.id,
    "key", NEW.key,
    "value", NEW.value,
    "message_id", NEW.message_id,
    "deleted", NEW.deleted,
    "deleted_on", NEW.deleted_on,
    "deleted_by", NEW.deleted_by,
    "ext_id", NEW.ext_id,
    "ext_metadata", NEW.ext_metadata,
    "created_by", NEW.created_by,
    "modified_by", NEW.modified_by,
    "created_on", NEW.created_on,
    "modified_on", NEW.modified_on
  ), NEW.ext_id, NEW.ext_metadata
);

CREATE TRIGGER update_group_audit_trigger
AFTER UPDATE ON `group`
FOR EACH ROW
CALL generic_audit_procedure('UPDATE','group','group', 
NEW.id, NEW.modified_by, JSON_OBJECT(
    "id", OLD.id,
    "party", OLD.party,
    "type", OLD.type,
    "storage", OLD.storage,
    "visibility", OLD.visibility,
    "message_id", OLD.message_id,
    "thread_id", OLD.thread_id,
    "is_important", OLD.is_important,
    "deleted", OLD.deleted,
    "deleted_on", OLD.deleted_on,
    "deleted_by", OLD.deleted_by,
    "ext_id", OLD.ext_id,
    "ext_metadata", OLD.ext_metadata,
    "created_by", OLD.created_by,
    "modified_by", OLD.modified_by,
    "created_on", OLD.created_on,
    "modified_on", OLD.modified_on
  ), JSON_OBJECT(
    "id", NEW.id,
    "party", NEW.party,
    "type", NEW.type,
    "storage", NEW.storage,
    "visibility", NEW.visibility,
    "message_id", NEW.message_id,
    "thread_id", NEW.thread_id,
    "is_important", NEW.is_important,
    "deleted", NEW.deleted,
    "deleted_on", NEW.deleted_on,
    "deleted_by", NEW.deleted_by,
    "ext_id", NEW.ext_id,
    "ext_metadata", NEW.ext_metadata,
    "created_by", NEW.created_by,
    "modified_by", NEW.modified_by,
    "created_on", NEW.created_on,
    "modified_on", NEW.modified_on
  ), NEW.ext_id, NEW.ext_metadata
);

CREATE TRIGGER update_thread_audit_trigger
AFTER UPDATE ON thread
FOR EACH ROW
CALL generic_audit_procedure('UPDATE','thread','thread', 
NEW.id, NEW.modified_by, JSON_OBJECT(
    "id", OLD.id,
    "subject", OLD.subject,
    "message_counts", OLD.message_counts,
    "deleted", OLD.deleted,
    "deleted_on", OLD.deleted_on,
    "deleted_by", OLD.deleted_by,
    "ext_id", OLD.ext_id,
    "ext_metadata", OLD.ext_metadata,
    "created_by", OLD.created_by,
    "modified_by", OLD.modified_by,
    "created_on", OLD.created_on,
    "modified_on", OLD.modified_on
  ), JSON_OBJECT(
    "id", NEW.id,
    "subject", NEW.subject,
    "message_counts", NEW.message_counts,
    "deleted", NEW.deleted,
    "deleted_on", NEW.deleted_on,
    "deleted_by", NEW.deleted_by,
    "ext_id", NEW.ext_id,
    "ext_metadata", NEW.ext_metadata,
    "created_by", NEW.created_by,
    "modified_by", NEW.modified_by,
    "created_on", NEW.created_on,
    "modified_on", NEW.modified_on
  ), NEW.ext_id, NEW.ext_metadata
);

-- adding DELETE audit_triggers
CREATE TRIGGER delete_attatchment_audit_trigger
AFTER DELETE ON attachment
FOR EACH ROW
CALL generic_audit_procedure('DELETE','attachment','attachment', 
OLD.id, OLD.modified_by, JSON_OBJECT(
    "id", OLD.id,
    "name", OLD.name,
    "path", OLD.path,
    "thumbnail", OLD.thumbnail,
    "mime", OLD.mime,
    "message_id", OLD.message_id,
    "deleted", OLD.deleted,
    "deleted_on", OLD.deleted_on,
    "deleted_by", OLD.deleted_by,
    "ext_id", OLD.ext_id,
    "ext_metadata", OLD.ext_metadata,
    "created_by", OLD.created_by,
    "modified_by", OLD.modified_by,
    "created_on", OLD.created_on,
    "modified_on", OLD.modified_on
  ), NULL, OLD.ext_id, OLD.ext_metadata
);

CREATE TRIGGER delete_message_audit_trigger
AFTER DELETE ON message
FOR EACH ROW
CALL generic_audit_procedure('DELETE','message','message', 
OLD.id, OLD.modified_by, JSON_OBJECT(
  "id", OLD.id,
  "sender", OLD.sender,
  "subject", OLD.subject,
  "body", OLD.body,
  "status", OLD.status,
  "thread_id", OLD.thread_id,
  "deleted", OLD.deleted,
  "deleted_on", OLD.deleted_on,
  "deleted_by", OLD.deleted_by,
  "ext_id", OLD.ext_id,
  "ext_metadata", OLD.ext_metadata,
  "created_by", OLD.created_by,
  "modified_by", OLD.modified_by,
  "created_on", OLD.created_on,
  "modified_on", OLD.modified_on
  ), NULL, OLD.ext_id, OLD.ext_metadata
);


CREATE TRIGGER delete_meta_audit_trigger
AFTER DELETE ON meta
FOR EACH ROW
CALL generic_audit_procedure('DELETE','meta','meta', 
OLD.id, OLD.modified_by, JSON_OBJECT(
    "id", OLD.id,
    "key", OLD.key,
    "value", OLD.value,
    "message_id", OLD.message_id,
    "deleted", OLD.deleted,
    "deleted_on", OLD.deleted_on,
    "deleted_by", OLD.deleted_by,
    "ext_id", OLD.ext_id,
    "ext_metadata", OLD.ext_metadata,
    "created_by", OLD.created_by,
    "modified_by", OLD.modified_by,
    "created_on", OLD.created_on,
    "modified_on", OLD.modified_on
  ), NULL, OLD.ext_id, OLD.ext_metadata
);

CREATE TRIGGER delete_group_audit_trigger
AFTER DELETE ON `group`
FOR EACH ROW
CALL generic_audit_procedure('DELETE','group','group', 
OLD.id, OLD.modified_by, JSON_OBJECT(
    "id", OLD.id,
    "party", OLD.party,
    "type", OLD.type,
    "storage", OLD.storage,
    "visibility", OLD.visibility,
    "message_id", OLD.message_id,
    "thread_id", OLD.thread_id,
    "is_important", OLD.is_important,
    "deleted", OLD.deleted,
    "deleted_on", OLD.deleted_on,
    "deleted_by", OLD.deleted_by,
    "ext_id", OLD.ext_id,
    "ext_metadata", OLD.ext_metadata,
    "created_by", OLD.created_by,
    "modified_by", OLD.modified_by,
    "created_on", OLD.created_on,
    "modified_on", OLD.modified_on
  ), NULL, OLD.ext_id, OLD.ext_metadata
);

CREATE TRIGGER delete_thread_audit_trigger
AFTER DELETE ON thread
FOR EACH ROW
CALL generic_audit_procedure('DELETE','thread','thread', 
OLD.id, OLD.modified_by, JSON_OBJECT(
    "id", OLD.id,
    "subject", OLD.subject,
    "message_counts", OLD.message_counts,
    "deleted", OLD.deleted,
    "deleted_on", OLD.deleted_on,
    "deleted_by", OLD.deleted_by,
    "ext_id", OLD.ext_id,
    "ext_metadata", OLD.ext_metadata,
    "created_by", OLD.created_by,
    "modified_by", OLD.modified_by,
    "created_on", OLD.created_on,
    "modified_on", OLD.modified_on
  ), NULL, OLD.ext_id, OLD.ext_metadata
);
