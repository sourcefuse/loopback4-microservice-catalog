-- creating table for storing Auth clients
CREATE TABLE auth_clients (
  id                         INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  client_id                  VARCHAR(50) NOT NULL,
  client_secret              VARCHAR(50) NOT NULL,
  redirect_url               VARCHAR(200),
  access_token_expiration    INTEGER DEFAULT 900 NOT NULL,
  refresh_token_expiration   INTEGER DEFAULT 86400 NOT NULL,
  auth_code_expiration       INTEGER DEFAULT 180 NOT NULL,
  secret                     VARCHAR(50) NOT NULL,
  created_on                 TIMESTAMP DEFAULT current_timestamp NOT NULL,
  modified_on                TIMESTAMP DEFAULT current_timestamp NOT NULL,
  deleted                    BOOL DEFAULT false NOT NULL,
  deleted_on                 TIMESTAMP,
  deleted_by                 VARCHAR(36)
);

CREATE TRIGGER mdt_auth_clients
BEFORE UPDATE ON auth_clients 
FOR EACH ROW
SET NEW.modified_on = now();

-- creating table for storing Roles
CREATE TABLE roles (
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
CREATE TRIGGER before_insert_trigger_roles
BEFORE INSERT ON roles 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER mdt_roles
BEFORE UPDATE ON roles 
FOR EACH ROW
SET NEW.modified_on = now();

-- creating table for storing Tenant configs
CREATE TABLE tenant_configs (
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
  deleted_on           TIMESTAMP
);

-- adding triggers
CREATE TRIGGER before_insert_trigger_tenant_configs
BEFORE INSERT ON tenant_configs 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER mdt_tenant_configs
BEFORE UPDATE ON tenant_configs 
FOR EACH ROW
SET NEW.modified_on = now();


-- creating table for storing Tenants
CREATE TABLE tenants (
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
CREATE TRIGGER before_insert_trigger_tenants
BEFORE INSERT ON tenants 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER mdt_tenants
BEFORE UPDATE ON tenants 
FOR EACH ROW
SET NEW.modified_on = now();

-- creating table for storing for credentials of users
CREATE TABLE user_credentials (
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
  deleted_by           VARCHAR(36)
);

-- adding triggers
CREATE TRIGGER before_insert_trigger_user_credentials
BEFORE INSERT ON user_credentials 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER mdt_user_credentials
BEFORE UPDATE ON user_credentials 
FOR EACH ROW
SET NEW.modified_on = now();


-- creating table for storing for permissions of user
CREATE TABLE user_permissions (
  id                   VARCHAR(36) NOT NULL PRIMARY KEY,
  user_tenant_id       VARCHAR(36) NOT NULL,
  permission           VARCHAR(50) NOT NULL,
  allowed              BOOL NOT NULL,
  created_on           TIMESTAMP DEFAULT current_timestamp NOT NULL,
  modified_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
  created_by           VARCHAR(36),
  modified_by          VARCHAR(36),
  deleted              BOOL DEFAULT false NOT NULL,
  deleted_on           TIMESTAMP,
  deleted_by           VARCHAR(36)
);

-- adding triggers
CREATE TRIGGER before_insert_trigger_user_permissions
BEFORE INSERT ON user_permissions 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER mdt_user_permissions
BEFORE UPDATE ON user_permissions 
FOR EACH ROW
SET NEW.modified_on = now();

-- creating table for storing for resources of user
CREATE TABLE user_resources ( 
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
  allowed              BOOL DEFAULT true NOT NULL
);

-- adding triggers
CREATE TRIGGER before_insert_trigger_user_resources
BEFORE INSERT ON user_resources 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER mdt_user_resources
BEFORE UPDATE ON user_resources 
FOR EACH ROW
SET NEW.modified_on = now();


-- creating table for storing for tenants of user
CREATE TABLE user_tenants (
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
  deleted_on           TIMESTAMP
);

-- adding triggers
CREATE TRIGGER before_insert_trigger_user_tenants
BEFORE INSERT ON user_tenants 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER mdt_user_tenants
BEFORE UPDATE ON user_tenants 
FOR EACH ROW
SET NEW.modified_on = now();


-- creating table for storing for users
CREATE TABLE users (
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
CREATE TRIGGER before_insert_trigger_users
BEFORE INSERT ON users 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER mdt_users
BEFORE UPDATE ON users 
FOR EACH ROW
SET NEW.modified_on = now();

-- adding all foreign keys for referential integrity between tables
-- adding foreign keys for tenant config and tenant
ALTER TABLE tenant_configs 
ADD CONSTRAINT fk_tenant_configs_tenants 
FOREIGN KEY (tenant_id) 
REFERENCES tenants(id);

-- adding foreign keys for credentials and user
ALTER TABLE user_credentials 
ADD CONSTRAINT fk_user_credentials_users 
FOREIGN KEY (user_id) 
REFERENCES users(id);

-- adding foreign keys for permissions and user
ALTER TABLE user_permissions 
ADD CONSTRAINT fk_user_permissions 
FOREIGN KEY (user_tenant_id) 
REFERENCES user_tenants(id);

-- adding foreign keys for resources and user
ALTER TABLE user_resources 
ADD CONSTRAINT fk_user_resources 
FOREIGN KEY (user_tenant_id) 
REFERENCES user_tenants(id);

-- adding foreign keys multi-tenanancy
ALTER TABLE user_tenants 
ADD CONSTRAINT fk_user_tenants_users 
FOREIGN KEY (user_id) 
REFERENCES users(id);

ALTER TABLE user_tenants 
ADD CONSTRAINT fk_user_tenants_tenants 
FOREIGN KEY (tenant_id) 
REFERENCES tenants(id);

ALTER TABLE user_tenants 
ADD CONSTRAINT fk_user_tenants_roles 
FOREIGN KEY (role_id) 
REFERENCES roles(id);
