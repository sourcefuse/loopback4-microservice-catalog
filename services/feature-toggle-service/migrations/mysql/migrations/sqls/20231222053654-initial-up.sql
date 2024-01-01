-- creating features table
CREATE TABLE features (
	id                   VARCHAR(36) NOT NULL PRIMARY KEY,
  name                 VARCHAR(50) NOT NULL,
  `key`                VARCHAR(50) NOT NULL,
  description          VARCHAR(50),
  default_value        BOOL DEFAULT true NOT NULL,
  metadata             TEXT,  
  created_by           VARCHAR(100),
  modified_by          VARCHAR(100),
  created_on           TIMESTAMP DEFAULT current_timestamp NOT NULL,
  modified_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
  deleted              BOOL DEFAULT false NOT NULL,
  deleted_on           TIMESTAMP,
  deleted_by           VARCHAR(36)
);

-- adding triggers
CREATE TRIGGER before_insert_trigger_features
BEFORE INSERT ON features
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- creating strategies table
CREATE TABLE strategies (
	id                   VARCHAR(36) NOT NULL PRIMARY KEY,
	name                 VARCHAR(50) NOT NULL,
	`key`                VARCHAR(50) NOT NULL,
	priority             INTEGER,
  created_by           VARCHAR(100),
  modified_by          VARCHAR(100),
  created_on           TIMESTAMP DEFAULT current_timestamp NOT NULL,
  modified_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
  deleted              BOOL DEFAULT false NOT NULL,
  deleted_on           TIMESTAMP,
  deleted_by           VARCHAR(36)
);

-- adding triggers
CREATE TRIGGER before_insert_trigger_strategies
BEFORE INSERT ON strategies
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- creating feature_toggles table
CREATE TABLE feature_toggles (
	id                   VARCHAR(36) NOT NULL PRIMARY KEY,
	feature_key          VARCHAR(50) NOT NULL,
	strategy_key         VARCHAR(50) NOT NULL,
  strategy_entity_id   VARCHAR(36),
	status               BOOL DEFAULT true NOT NULL,
  created_by           VARCHAR(100),
  modified_by          VARCHAR(100),
  created_on           TIMESTAMP DEFAULT current_timestamp NOT NULL,
  modified_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
  deleted              BOOL DEFAULT false NOT NULL,
  deleted_on           TIMESTAMP,
  deleted_by           VARCHAR(36)
);

-- adding triggers
CREATE TRIGGER before_insert_trigger_feature_toggles
BEFORE INSERT ON feature_toggles
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- inserting  data in tables
INSERT INTO strategies(name, `key`, priority) 
VALUES ('System', 'System', '1');

INSERT INTO strategies(name, `key`, priority) 
VALUES ('Tenant', 'Tenant', '2');

INSERT INTO strategies(name, `key`, priority) 
VALUES ('User', 'User', '3');

