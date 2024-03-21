-- creating audit_logs table
CREATE TABLE audit_logs (
	id                      VARCHAR(36) NOT NULL PRIMARY KEY,
	`action`                TEXT NOT NULL,
	acted_at                TIMESTAMP NOT NULL,
	acted_on                TEXT NULL,
	action_key              TEXT NOT NULL,
	entity_id               TEXT NOT NULL,
	actor                   TEXT NOT NULL,
	`before`                TEXT NULL,
	`after`                 TEXT NULL,
	action_group            TEXT NULL
);

-- adding triggers
CREATE TRIGGER before_insert_trigger_audit_logs
BEFORE INSERT ON audit_logs
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());


-- creating todo table
CREATE TABLE todo (
	id                      VARCHAR(36) NOT NULL PRIMARY KEY,
  title                   TEXT NOT NULL,
	description             TEXT NOT NULL,
	items                   TEXT NULL
);

-- adding triggers
CREATE TRIGGER before_insert_trigger_todo
BEFORE INSERT ON todo
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

