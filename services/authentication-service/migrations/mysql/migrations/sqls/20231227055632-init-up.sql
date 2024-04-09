-- creating table for storing Auth clients
CREATE TABLE IF NOT EXISTS auth_clients (
  id                         INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  client_id                  VARCHAR(50) NOT NULL,
  client_secret              text NOT NULL,
  redirect_url               VARCHAR(200),
  access_token_expiration    INTEGER DEFAULT 900 NOT NULL,
  refresh_token_expiration   INTEGER DEFAULT 86400 NOT NULL,
  auth_code_expiration       INTEGER DEFAULT 180 NOT NULL,
  secret                     text NOT NULL,
  created_on                 TIMESTAMP DEFAULT current_timestamp NOT NULL,
  modified_on                TIMESTAMP DEFAULT current_timestamp NOT NULL,
  deleted                    BOOL DEFAULT false NOT NULL,
  deleted_on                 TIMESTAMP,
  deleted_by                 VARCHAR(36)
);

CREATE TRIGGER IF NOT EXISTS mdt_auth_clients
BEFORE UPDATE ON auth_clients 
FOR EACH ROW
SET NEW.modified_on = now();

-- creating table for storing Roles
CREATE TABLE IF NOT EXISTS roles (
  id                   VARCHAR(36) NOT NULL PRIMARY KEY,
  name                 VARCHAR(100) NOT NULL,
  created_on           TIMESTAMP DEFAULT current_timestamp NOT NULL,
  modified_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
  created_by           VARCHAR(36),
  modified_by          VARCHAR(36),
  deleted              BOOL DEFAULT false NOT NULL,
  permissions          JSON,
  role_type            INTEGER DEFAULT 0 NOT NULL,
  deleted_by           VARCHAR(36),
  deleted_on           TIMESTAMP
);

-- adding triggers
CREATE TRIGGER IF NOT EXISTS before_insert_trigger_roles
BEFORE INSERT ON roles 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER IF NOT EXISTS mdt_roles
BEFORE UPDATE ON roles 
FOR EACH ROW
SET NEW.modified_on = now();

-- creating table for storing for users
CREATE TABLE IF NOT EXISTS users (
  id                   VARCHAR(36) NOT NULL PRIMARY KEY,
  first_name           VARCHAR(50) NOT NULL,
  middle_name          VARCHAR(50),
  last_name            VARCHAR(50),
  username             VARCHAR(150) NOT NULL,
  email                VARCHAR(150),
  phone                VARCHAR(15),
  created_on           TIMESTAMP DEFAULT current_timestamp NOT NULL,
  modified_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
  created_by           VARCHAR(36),
  modified_by          VARCHAR(36),
  deleted              BOOL DEFAULT false NOT NULL,
  last_login           TIMESTAMP,
  auth_client_ids      JSON,
  gender               CHAR(1),
  dob                  DATE,
  default_tenant_id    VARCHAR(36),
  deleted_by           VARCHAR(36),
  deleted_on           TIMESTAMP
);

-- adding triggers
CREATE TRIGGER IF NOT EXISTS before_insert_trigger_users
BEFORE INSERT ON users 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER IF NOT EXISTS mdt_users
BEFORE UPDATE ON users 
FOR EACH ROW
SET NEW.modified_on = now();

-- creating table for storing Tenants
CREATE TABLE IF NOT EXISTS tenants (
  id                   VARCHAR(36) NOT NULL PRIMARY KEY,
  name                 VARCHAR(100) NOT NULL,
  status               INTEGER DEFAULT 0 NOT NULL,
  created_on           TIMESTAMP DEFAULT current_timestamp NOT NULL,
  modified_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
  created_by           VARCHAR(36),
  modified_by          VARCHAR(36),
  deleted              BOOL DEFAULT false NOT NULL ,
  `key`                VARCHAR(20) NOT NULL UNIQUE,
  address              VARCHAR(500),
  city                 VARCHAR(100),
  `state`              VARCHAR(100),
  zip                  VARCHAR(25),
  country              VARCHAR(25),
  deleted_on           TIMESTAMP,
  deleted_by           VARCHAR(36)
);

-- adding triggers
CREATE TRIGGER IF NOT EXISTS before_insert_trigger_tenants
BEFORE INSERT ON tenants 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER IF NOT EXISTS mdt_tenants
BEFORE UPDATE ON tenants 
FOR EACH ROW
SET NEW.modified_on = now();

-- creating table for storing Tenant configs
CREATE TABLE IF NOT EXISTS tenant_configs (
  id                   VARCHAR(36) NOT NULL PRIMARY KEY,
  config_key           VARCHAR(100) NOT NULL,
  config_value         JSON NOT NULL,
  created_on           TIMESTAMP DEFAULT current_timestamp NOT NULL,
  modified_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
  created_by           INTEGER,
  modified_by          INTEGER,
  deleted              BOOL DEFAULT false NOT NULL,
  tenant_id            VARCHAR(36) NOT NULL,
  deleted_by           VARCHAR(36),
  deleted_on           TIMESTAMP,
  CONSTRAINT fk_tenant_configs_tenants FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- adding triggers
CREATE TRIGGER IF NOT EXISTS before_insert_trigger_tenant_configs
BEFORE INSERT ON tenant_configs 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER IF NOT EXISTS mdt_tenant_configs
BEFORE UPDATE ON tenant_configs 
FOR EACH ROW
SET NEW.modified_on = now();

-- creating table for storing for tenants of user
CREATE TABLE IF NOT EXISTS user_tenants (
  id                   VARCHAR(36) NOT NULL PRIMARY KEY,
  user_id              VARCHAR(36) NOT NULL,
  tenant_id            VARCHAR(36) NOT NULL,
  role_id              VARCHAR(36) NOT NULL,
  created_on           TIMESTAMP DEFAULT current_timestamp NOT NULL,
  modified_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
  deleted              BOOL DEFAULT false NOT NULL,
  status               INTEGER DEFAULT 0 NOT NULL,
  locale               VARCHAR(5),
  deleted_by           VARCHAR(36),
  deleted_on           TIMESTAMP,
  CONSTRAINT fk_user_tenants_users FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_user_tenants_tenants FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_user_tenants_roles FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- adding triggers
CREATE TRIGGER IF NOT EXISTS before_insert_trigger_user_tenants
BEFORE INSERT ON user_tenants 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER IF NOT EXISTS mdt_user_tenants
BEFORE UPDATE ON user_tenants 
FOR EACH ROW
SET NEW.modified_on = now();


-- creating table for storing for credentials of users
CREATE TABLE IF NOT EXISTS user_credentials (
  id                   VARCHAR(36) NOT NULL PRIMARY KEY,
  user_id              VARCHAR(36) NOT NULL UNIQUE,
  auth_provider        VARCHAR(50) DEFAULT 'internal' NOT NULL,
  auth_id              VARCHAR(100),
  auth_token           VARCHAR(100),
  `password`           VARCHAR(60),
  created_on           TIMESTAMP DEFAULT current_timestamp NOT NULL,
  modified_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
  deleted              BOOL DEFAULT false NOT NULL,
  deleted_on           TIMESTAMP,
  deleted_by           VARCHAR(36),
  CONSTRAINT idx_user_credentials_uniq UNIQUE (auth_provider, auth_id, auth_token, `password`),
  CONSTRAINT fk_user_credentials_users FOREIGN KEY (user_id) REFERENCES users(id)
);

-- adding triggers
CREATE TRIGGER IF NOT EXISTS before_insert_trigger_user_credentials
BEFORE INSERT ON user_credentials 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER IF NOT EXISTS mdt_user_credentials
BEFORE UPDATE ON user_credentials 
FOR EACH ROW
SET NEW.modified_on = now();


-- creating table for storing for permissions of user
CREATE TABLE IF NOT EXISTS user_permissions (
  id                   VARCHAR(36) NOT NULL PRIMARY KEY,
  user_tenant_id       VARCHAR(36) NOT NULL,
  permission           text NOT NULL,
  allowed              BOOL NOT NULL,
  created_on           TIMESTAMP DEFAULT current_timestamp NOT NULL,
  modified_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
  created_by           VARCHAR(36),
  modified_by          VARCHAR(36),
  deleted              BOOL DEFAULT false NOT NULL,
  deleted_on           TIMESTAMP,
  deleted_by           VARCHAR(36),
  CONSTRAINT fk_user_permissions FOREIGN KEY (user_tenant_id) REFERENCES user_tenants(id)
);

-- adding triggers
CREATE TRIGGER IF NOT EXISTS before_insert_trigger_user_permissions
BEFORE INSERT ON user_permissions 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER IF NOT EXISTS mdt_user_permissions
BEFORE UPDATE ON user_permissions 
FOR EACH ROW
SET NEW.modified_on = now();

-- creating table for storing for resources of user
CREATE TABLE IF NOT EXISTS user_resources ( 
  id                   VARCHAR(36) NOT NULL PRIMARY KEY,
  deleted              BOOL DEFAULT false NOT NULL,
  deleted_on           TIMESTAMP,
  deleted_by           VARCHAR(36),
  created_on           TIMESTAMP DEFAULT current_timestamp NOT NULL,
  modified_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
  created_by           VARCHAR(36),
  modified_by          VARCHAR(36),
  user_tenant_id       VARCHAR(36),
  resource_name        VARCHAR(50),
  resource_value       VARCHAR(100),
  allowed              BOOL DEFAULT true NOT NULL,
  CONSTRAINT fk_user_resources FOREIGN KEY (user_tenant_id) REFERENCES user_tenants(id)
);

-- adding triggers
CREATE TRIGGER IF NOT EXISTS before_insert_trigger_user_resources
BEFORE INSERT ON user_resources 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER IF NOT EXISTS mdt_user_resources
BEFORE UPDATE ON user_resources 
FOR EACH ROW
SET NEW.modified_on = now();

-- Adding functionality for adding column if not exists 
CREATE PROCEDURE IF NOT EXISTS add_columns_if_not_exists(tableName VARCHAR(100), columnName VARCHAR(100), columnType VARCHAR(100))
BEGIN
    DECLARE columnExists INT;

    SELECT COUNT(*)
    INTO columnExists
    FROM information_schema.COLUMNS
    WHERE TABLE_NAME = tableName AND COLUMN_NAME = columnName;

    IF columnExists = 0 THEN
        SET @alterQuery = CONCAT('ALTER TABLE ', tableName, ' ADD COLUMN ', columnName, ' ', columnType);
        PREPARE alterStmt FROM @alterQuery;
        EXECUTE alterStmt;
        DEALLOCATE PREPARE alterStmt;
    END IF;
END;

