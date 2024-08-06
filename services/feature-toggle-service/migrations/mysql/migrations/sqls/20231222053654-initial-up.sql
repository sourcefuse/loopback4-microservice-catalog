-- creating features table
CREATE TABLE features (
	id                   TEXT NOT NULL PRIMARY KEY,
  name                 TEXT NOT NULL,
  `key`                TEXT NOT NULL,
  description          TEXT,
  default_value        TEXT NOT NULL,
  type                 TEXT NOT NULL,
  metadata             TEXT,  
  created_by           VARCHAR(100),
  modified_by          VARCHAR(100),
  created_on           TIMESTAMP DEFAULT current_timestamp NOT NULL,
  modified_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
  deleted              BOOL DEFAULT false NOT NULL,
  deleted_on           TIMESTAMP,
  deleted_by           VARCHAR(100)
);

-- adding triggers
CREATE TRIGGER before_insert_trigger_features
BEFORE INSERT ON features
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- creating strategies table
CREATE TABLE strategies (
	id                   VARCHAR(36) NOT NULL PRIMARY KEY,
	name                 TEXT NOT NULL,
	`key`                TEXT NOT NULL,
	priority             INTEGER,
  created_by           VARCHAR(100),
  modified_by          VARCHAR(100),
  created_on           TIMESTAMP DEFAULT current_timestamp NOT NULL,
  modified_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
  deleted              BOOL DEFAULT false NOT NULL,
  deleted_on           TIMESTAMP,
  deleted_by           VARCHAR(100)
);

-- adding triggers
CREATE TRIGGER before_insert_trigger_strategies
BEFORE INSERT ON strategies
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- creating feature_values table
CREATE TABLE feature_values (
	id                   VARCHAR(36) NOT NULL PRIMARY KEY,
	feature_key          TEXT NOT NULL,
	strategy_key         TEXT NOT NULL,
  strategy_entity_id   VARCHAR(36),
	status               BOOL DEFAULT true NOT NULL,
  values               TEXT,
  created_by           VARCHAR(100),
  modified_by          VARCHAR(100),
  created_on           TIMESTAMP DEFAULT current_timestamp NOT NULL,
  modified_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
  deleted              BOOL DEFAULT false NOT NULL,
  deleted_on           TIMESTAMP,
  deleted_by           VARCHAR(100)
);

-- adding triggers
CREATE TRIGGER before_insert_trigger_feature_values
BEFORE INSERT ON feature_values
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- inserting  data in tables
INSERT INTO strategies(name, `key`, priority) 
VALUES ('System', 'System', '1');

INSERT INTO strategies(name, `key`, priority) 
VALUES ('Tenant', 'Tenant', '2');

INSERT INTO strategies(name, `key`, priority) 
VALUES ('User', 'User', '3');

