CREATE TABLE IF NOT EXISTS auth_clients ( 
  id                        INTEGER AUTO_INCREMENT PRIMARY KEY,
  client_id                 VARCHAR(50) NOT NULL,
  client_secret             VARCHAR(50) NOT NULL,
  redirect_url              VARCHAR(200),
  access_token_expiration   INTEGER DEFAULT 900 NOT NULL,
  refresh_token_expiration  INTEGER DEFAULT 86400 NOT NULL,
  auth_code_expiration      INTEGER DEFAULT 180 NOT NULL,
  secret                    VARCHAR(50) NOT NULL,
  created_by			          VARCHAR(100),
  modified_by			          VARCHAR(100),
  created_on                TIMESTAMP DEFAULT current_timestamp NOT NULL,
  modified_on               TIMESTAMP DEFAULT current_timestamp NOT NULL,
  deleted                   BOOLEAN DEFAULT false NOT NULL,
  client_type			          VARCHAR(100) DEFAULT 'public',
  deleted_on                TIMESTAMP,
  deleted_by                VARCHAR(36)
);

-- adding triggers
CREATE TRIGGER IF NOT EXISTS mdt_auth_clients
BEFORE UPDATE ON auth_clients 
FOR EACH ROW
SET NEW.modified_on = now();

CREATE TABLE IF NOT EXISTS `groups` ( 
  id                   VARCHAR(36) PRIMARY KEY,
  name                 VARCHAR(200) NOT NULL,
  description          VARCHAR(500),
  photo_url            VARCHAR(500),
  tenant_id            VARCHAR(36) NOT NULL,
  created_by           VARCHAR(36),
  modified_by          VARCHAR(36),
  created_on           TIMESTAMP DEFAULT current_timestamp,
  modified_on          TIMESTAMP DEFAULT current_timestamp,
  deleted              BOOLEAN DEFAULT false,
  deleted_on           TIMESTAMP,
  deleted_by           VARCHAR(36)
);

-- adding triggers
CREATE TRIGGER IF NOT EXISTS before_insert_trigger_groups
BEFORE INSERT ON `groups` 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TABLE IF NOT EXISTS roles ( 
  id                   VARCHAR(36) PRIMARY KEY,
  name                 VARCHAR(100) NOT NULL,
  tenant_id            VARCHAR(36) NOT NULL,
  created_on           TIMESTAMP DEFAULT current_timestamp NOT NULL,
  modified_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
  created_by           VARCHAR(36),
  modified_by          VARCHAR(36),
  deleted              BOOLEAN DEFAULT false NOT NULL,
  permissions          JSON,
  allowed_clients      JSON,
  role_type            INTEGER DEFAULT 0,
  description			     VARCHAR(500),
  deleted_by           VARCHAR(36),
  deleted_on           TIMESTAMP
);

-- adding triggers
CREATE TRIGGER IF NOT EXISTS before_insert_trigger_roles
BEFORE INSERT ON roles 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- adding triggers
CREATE TRIGGER IF NOT EXISTS mdt_roles
BEFORE UPDATE ON roles 
FOR EACH ROW
SET NEW.modified_on = now();

CREATE TABLE IF NOT EXISTS tenants ( 
  id                   VARCHAR(36) PRIMARY KEY,
  name                 VARCHAR(100) NOT NULL,
  status               INTEGER DEFAULT 0 NOT NULL,
  created_on           TIMESTAMP DEFAULT current_timestamp NOT NULL,
  modified_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
  created_by           VARCHAR(36),
  modified_by          VARCHAR(36),
  deleted              BOOLEAN DEFAULT false NOT NULL,
  `key`                VARCHAR(20) NOT NULL UNIQUE,
  address              VARCHAR(500),
  city                 VARCHAR(100),
  `state`              VARCHAR(100),
  zip                  VARCHAR(25),
  country              VARCHAR(25),
  deleted_on           TIMESTAMP,
  deleted_by           VARCHAR(36),
  website              VARCHAR(100)
);

-- adding triggers
CREATE TRIGGER IF NOT EXISTS before_insert_trigger_tenants
BEFORE INSERT ON tenants 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- adding triggers
CREATE TRIGGER IF NOT EXISTS mdt_tenants
BEFORE UPDATE ON tenants 
FOR EACH ROW
SET NEW.modified_on = now();

CREATE TABLE IF NOT EXISTS users ( 
  id                   VARCHAR(36) PRIMARY KEY,
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
  deleted              BOOLEAN DEFAULT false NOT NULL,
  last_login           TIMESTAMP,
  photo_url            VARCHAR(250),
  auth_client_ids      JSON,
  gender               CHAR(1),
  dob                  DATE,
  designation          VARCHAR(50),
  default_tenant_id    VARCHAR(36),
  deleted_by           VARCHAR(36),
  deleted_on           TIMESTAMP
);

-- adding triggers
CREATE TRIGGER IF NOT EXISTS before_insert_trigger_users
BEFORE INSERT ON users 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- adding triggers
CREATE TRIGGER IF NOT EXISTS mdt_users
BEFORE UPDATE ON users 
FOR EACH ROW
SET NEW.modified_on = now();

CREATE TABLE IF NOT EXISTS tenant_configs ( 
  id                   VARCHAR(36) PRIMARY KEY,
  config_key           VARCHAR(100) NOT NULL,
  config_value         JSON NOT NULL,
  created_on           TIMESTAMP DEFAULT current_timestamp NOT NULL,
  modified_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
  created_by           INTEGER,
  modified_by          INTEGER,
  deleted              BOOLEAN DEFAULT false NOT NULL,
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

-- adding triggers
CREATE TRIGGER IF NOT EXISTS mdt_tenant_configs
BEFORE UPDATE ON tenant_configs 
FOR EACH ROW
SET NEW.modified_on = now();

CREATE TABLE IF NOT EXISTS user_credentials ( 
  id                   VARCHAR(36) PRIMARY KEY,
  user_id              VARCHAR(36) NOT NULL UNIQUE,
  auth_provider        VARCHAR(50) DEFAULT 'internal' NOT NULL,
  auth_id              VARCHAR(100),
  secret_key 			     VARCHAR(100),
  auth_token           VARCHAR(100),
  `password`           VARCHAR(60),
  created_by			     VARCHAR(100),
  modified_by			     VARCHAR(100),
  created_on           TIMESTAMP DEFAULT current_timestamp NOT NULL,
  modified_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
  deleted              BOOLEAN DEFAULT false NOT NULL,
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

-- adding triggers
CREATE TRIGGER IF NOT EXISTS mdt_user_credentials
BEFORE UPDATE ON user_credentials 
FOR EACH ROW
SET NEW.modified_on = now();

CREATE TABLE IF NOT EXISTS user_tenants ( 
  id                   VARCHAR(36) PRIMARY KEY,
  user_id              VARCHAR(36) NOT NULL,
  tenant_id            VARCHAR(36) NOT NULL,
  role_id              VARCHAR(36) NOT NULL,
  created_by			     VARCHAR(100),
  modified_by			     VARCHAR(100),
  created_on           TIMESTAMP DEFAULT current_timestamp NOT NULL,
  modified_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
  deleted              BOOLEAN DEFAULT false NOT NULL,
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

-- adding triggers
CREATE TRIGGER IF NOT EXISTS mdt_user_tenants
BEFORE UPDATE ON user_tenants 
FOR EACH ROW
SET NEW.modified_on = now();

CREATE TABLE IF NOT EXISTS user_groups ( 
  id                   VARCHAR(36) PRIMARY KEY,
  user_tenant_id       VARCHAR(36) NOT NULL,
  group_id             VARCHAR(36) NOT NULL,
  created_on           TIMESTAMP DEFAULT current_timestamp,
  modified_on          TIMESTAMP DEFAULT current_timestamp,
  deleted              BOOLEAN DEFAULT false,
  created_by           VARCHAR(36),
  modified_by          VARCHAR(36),
  deleted_on           TIMESTAMP,
  deleted_by           VARCHAR(36),
  CONSTRAINT fk_user_tenant FOREIGN KEY (user_tenant_id) REFERENCES user_tenants(id),
  CONSTRAINT fk_groups FOREIGN KEY (group_id) REFERENCES `groups`(id)   
);

-- adding triggers
CREATE TRIGGER IF NOT EXISTS before_insert_trigger_user_groups
BEFORE INSERT ON user_groups 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TABLE IF NOT EXISTS user_invitations ( 
  id                   VARCHAR(36) PRIMARY KEY,
  created_by           VARCHAR(36),
  created_on           TIMESTAMP DEFAULT current_timestamp NOT NULL,
  deleted              BOOLEAN DEFAULT false NOT NULL,
  deleted_by           VARCHAR(36),
  deleted_on           TIMESTAMP,
  expires_on           TIMESTAMP NOT NULL,
  modified_by          VARCHAR(36),
  modified_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
  token                VARCHAR(300) NOT NULL,
  user_tenant_id       VARCHAR(36) NOT NULL,
  CONSTRAINT fk_user_invitations_user_tenants FOREIGN KEY (user_tenant_id) REFERENCES user_tenants(id)   
);

-- adding triggers
CREATE TRIGGER IF NOT EXISTS before_insert_trigger_user_invitations
BEFORE INSERT ON user_invitations 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- adding comments
ALTER TABLE user_invitations
COMMENT = 'user link expire';

CREATE TABLE IF NOT EXISTS user_permissions ( 
  id                   VARCHAR(36) PRIMARY KEY,
  user_tenant_id       VARCHAR(36) NOT NULL,
  permission           VARCHAR(50) NOT NULL,
  allowed              BOOLEAN NOT NULL,
  created_on           TIMESTAMP DEFAULT current_timestamp NOT NULL,
  modified_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
  created_by           VARCHAR(36),
  modified_by          VARCHAR(36),
  deleted              BOOLEAN DEFAULT false NOT NULL,
  deleted_on           TIMESTAMP,
  deleted_by           VARCHAR(36),
  CONSTRAINT fk_user_permissions FOREIGN KEY (user_tenant_id) REFERENCES user_tenants(id)   
);

-- adding triggers
CREATE TRIGGER IF NOT EXISTS before_insert_trigger_user_permissions
BEFORE INSERT ON user_permissions 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- adding triggers
CREATE TRIGGER IF NOT EXISTS mdt_user_permissions
BEFORE UPDATE ON user_permissions 
FOR EACH ROW
SET NEW.modified_on = now();

CREATE TABLE IF NOT EXISTS user_tenant_prefs ( 
  id                   VARCHAR(36) PRIMARY KEY,
  config_key           VARCHAR(100) NOT NULL,
  config_value         JSON NOT NULL,
  created_on           TIMESTAMP DEFAULT current_timestamp NOT NULL,
  modified_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
  created_by           VARCHAR(36),
  modified_by          VARCHAR(36),
  deleted              BOOLEAN DEFAULT false NOT NULL,
  user_tenant_id       VARCHAR(36) NOT NULL,
  deleted_by           VARCHAR(36),
  deleted_on           BOOLEAN,
  CONSTRAINT fk_user_tenant_prefs FOREIGN KEY (user_tenant_id) REFERENCES user_tenants(id)   
);

-- adding triggers
CREATE TRIGGER IF NOT EXISTS before_insert_trigger_user_tenant_prefs
BEFORE INSERT ON user_tenant_prefs 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TABLE IF NOT EXISTS audit_logs ( 
  id                   VARCHAR(36) PRIMARY KEY,
  operation_name       VARCHAR(10) NOT NULL,
  operation_time       TIMESTAMP NOT NULL,
  `table_name`         VARCHAR(60) NOT NULL,
  log_type             VARCHAR(100) DEFAULT 'APPLICATION_LOGS',
  entity_id            VARCHAR(36),
  user_id              VARCHAR(36),
  `before`             JSON,
  `after`              JSON
);

-- adding triggers
CREATE TRIGGER IF NOT EXISTS before_insert_trigger_audit_logs
BEFORE INSERT ON audit_logs 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());


-- creating an generic AUDIT procedure
CREATE PROCEDURE IF NOT EXISTS generic_audit_procedure( op_name VARCHAR(10), tb_name VARCHAR(60),
  `type` VARCHAR(100), ent_id VARCHAR(36), u_id VARCHAR(36),
  before_state JSON, after_state JSON)
BEGIN
  INSERT INTO audit_logs ( operation_name, table_name, log_type,
    entity_id, user_id, `before`, `after`) 
  VALUES ( op_name, tb_name, `type`, ent_id, u_id, before_state, after_state);
END;

-- adding INSERT audit_triggers
CREATE TRIGGER IF NOT EXISTS insert_roles_audit_trigger
AFTER INSERT ON roles
FOR EACH ROW
CALL generic_audit_procedure('INSERT','roles','ROLES_LOGS', 
  NEW.id, NEW.created_by, NULL, JSON_OBJECT(
      "id", NEW.id,
      "name", NEW.name,
      "tenant_id", NEW.tenant_id,
      "created_on", NEW.created_on,
      "modified_on", NEW.modified_on,
      "created_by", NEW.created_by,
      "modified_by", NEW.modified_by,
      "deleted", NEW.deleted,
      "permissions", NEW.permissions,
      "allowed_clients", NEW.allowed_clients,
      "role_type", NEW.role_type,
      "description", NEW.description,
      "deleted_by", NEW.deleted_by,
      "deleted_on", NEW.deleted_on
  )
);

CREATE TRIGGER IF NOT EXISTS insert_tenant_configs_audit_trigger
AFTER INSERT ON tenant_configs
FOR EACH ROW
CALL generic_audit_procedure('INSERT','tenant_configs','TENANT_CONFIG_LOGS', 
  NEW.id, NEW.created_by, NULL, JSON_OBJECT(
      "id", NEW.id,
      "config_key", NEW.config_key,
      "config_value", NEW.config_value,
      "created_on", NEW.created_on,
      "modified_on", NEW.modified_on,
      "created_by", NEW.created_by,
      "modified_by", NEW.modified_by,
      "deleted", NEW.deleted,
      "tenant_id", NEW.tenant_id,
      "deleted_by", NEW.deleted_by,
      "deleted_on", NEW.deleted_on
  )
);

CREATE TRIGGER IF NOT EXISTS insert_tenants_audit_trigger
AFTER INSERT ON tenants
FOR EACH ROW
CALL generic_audit_procedure('INSERT','tenants','TENANT_LOGS', 
  NEW.id, NEW.created_by, NULL, JSON_OBJECT(
      "id", NEW.id,
      "name", NEW.name,
      "status", NEW.status,
      "created_on", NEW.created_on,
      "modified_on", NEW.modified_on,
      "created_by", NEW.created_by,
      "modified_by", NEW.modified_by,
      "deleted", NEW.deleted,
      "key", NEW.key,
      "address", NEW.address,
      "city", NEW.city,
      "state", NEW.state,
      "zip", NEW.zip,
      "country", NEW.country,
      "deleted_on", NEW.deleted_on,
      "deleted_by", NEW.deleted_by,
      "website", NEW.website
  )
);

CREATE TRIGGER IF NOT EXISTS insert_user_permissions_audit_trigger
AFTER INSERT ON user_permissions
FOR EACH ROW
CALL generic_audit_procedure('INSERT','user_permissions','USER_PERMISSION_LOGS', 
  NEW.id, NEW.created_by, NULL, JSON_OBJECT(
      "id", NEW.id,
      "user_tenant_id", NEW.user_tenant_id,
      "permission", NEW.permission,
      "allowed", NEW.allowed,
      "created_on", NEW.created_on,
      "modified_on", NEW.modified_on,
      "created_by", NEW.created_by,
      "modified_by", NEW.modified_by,
      "deleted", NEW.deleted,
      "deleted_on", NEW.deleted_on,
      "deleted_by", NEW.deleted_by
  )
);

CREATE TRIGGER IF NOT EXISTS insert_users_audit_trigger
AFTER INSERT ON users
FOR EACH ROW
CALL generic_audit_procedure('INSERT','users','USER_LOGS', 
  NEW.id, NEW.created_by, NULL, JSON_OBJECT(
      "id", NEW.id,
      "first_name", NEW.first_name,
      "middle_name", NEW.middle_name,
      "last_name", NEW.last_name,
      "username", NEW.username,
      "email", NEW.email,
      "phone", NEW.phone,
      "created_on", NEW.created_on,
      "modified_on", NEW.modified_on,
      "created_by", NEW.created_by,
      "modified_by", NEW.modified_by,
      "deleted", NEW.deleted,
      "last_login", NEW.last_login,
      "photo_url", NEW.photo_url,
      "auth_client_ids", NEW.auth_client_ids,
      "gender", NEW.gender,
      "dob", NEW.dob,
      "designation", NEW.designation,
      "default_tenant_id", NEW.default_tenant_id,
      "deleted_by", NEW.deleted_by,
      "deleted_on", NEW.deleted_on
  )
);

-- adding UPDATE audit_triggers
CREATE TRIGGER IF NOT EXISTS update_roles_audit_trigger
AFTER UPDATE ON roles
FOR EACH ROW
CALL generic_audit_procedure('UPDATE','roles','ROLES_LOGS', 
  NEW.id, NEW.modified_by, JSON_OBJECT(
      "id", OLD.id,
      "name", OLD.name,
      "tenant_id", OLD.tenant_id,
      "created_on", OLD.created_on,
      "modified_on", OLD.modified_on,
      "created_by", OLD.created_by,
      "modified_by", OLD.modified_by,
      "deleted", OLD.deleted,
      "permissions", OLD.permissions,
      "allowed_clients", OLD.allowed_clients,
      "role_type", OLD.role_type,
      "description", OLD.description,
      "deleted_by", OLD.deleted_by,
      "deleted_on", OLD.deleted_on
  ), JSON_OBJECT(
      "id", NEW.id,
      "name", NEW.name,
      "tenant_id", NEW.tenant_id,
      "created_on", NEW.created_on,
      "modified_on", NEW.modified_on,
      "created_by", NEW.created_by,
      "modified_by", NEW.modified_by,
      "deleted", NEW.deleted,
      "permissions", NEW.permissions,
      "allowed_clients", NEW.allowed_clients,
      "role_type", NEW.role_type,
      "description", NEW.description,
      "deleted_by", NEW.deleted_by,
      "deleted_on", NEW.deleted_on
  )
);

CREATE TRIGGER IF NOT EXISTS update_tenant_configs_audit_trigger
AFTER UPDATE ON tenant_configs
FOR EACH ROW
CALL generic_audit_procedure('UPDATE','tenant_configs','TENANT_CONFIG_LOGS', 
  NEW.id, NEW.modified_by, JSON_OBJECT(
      "id", OLD.id,
      "config_key", OLD.config_key,
      "config_value", OLD.config_value,
      "created_on", OLD.created_on,
      "modified_on", OLD.modified_on,
      "created_by", OLD.created_by,
      "modified_by", OLD.modified_by,
      "deleted", OLD.deleted,
      "tenant_id", OLD.tenant_id,
      "deleted_by", OLD.deleted_by,
      "deleted_on", OLD.deleted_on
  ), JSON_OBJECT(
      "id", NEW.id,
      "config_key", NEW.config_key,
      "config_value", NEW.config_value,
      "created_on", NEW.created_on,
      "modified_on", NEW.modified_on,
      "created_by", NEW.created_by,
      "modified_by", NEW.modified_by,
      "deleted", NEW.deleted,
      "tenant_id", NEW.tenant_id,
      "deleted_by", NEW.deleted_by,
      "deleted_on", NEW.deleted_on
  )
);

CREATE TRIGGER IF NOT EXISTS update_tenants_audit_trigger
AFTER UPDATE ON tenants
FOR EACH ROW
CALL generic_audit_procedure('UPDATE','tenants','TENANT_LOGS', 
  NEW.id, NEW.modified_by, JSON_OBJECT(
      "id", OLD.id,
      "name", OLD.name,
      "status", OLD.status,
      "created_on", OLD.created_on,
      "modified_on", OLD.modified_on,
      "created_by", OLD.created_by,
      "modified_by", OLD.modified_by,
      "deleted", OLD.deleted,
      "key", OLD.key,
      "address", OLD.address,
      "city", OLD.city,
      "state", OLD.state,
      "zip", OLD.zip,
      "country", OLD.country,
      "deleted_on", OLD.deleted_on,
      "deleted_by", OLD.deleted_by,
      "website", OLD.website
  ), JSON_OBJECT(
      "id", NEW.id,
      "name", NEW.name,
      "status", NEW.status,
      "created_on", NEW.created_on,
      "modified_on", NEW.modified_on,
      "created_by", NEW.created_by,
      "modified_by", NEW.modified_by,
      "deleted", NEW.deleted,
      "key", NEW.key,
      "address", NEW.address,
      "city", NEW.city,
      "state", NEW.state,
      "zip", NEW.zip,
      "country", NEW.country,
      "deleted_on", NEW.deleted_on,
      "deleted_by", NEW.deleted_by,
      "website", NEW.website
  )
);

CREATE TRIGGER IF NOT EXISTS update_user_permissions_audit_trigger
AFTER UPDATE ON user_permissions
FOR EACH ROW
CALL generic_audit_procedure('UPDATE','user_permissions','USER_PERMISSION_LOGS', 
  NEW.id, NEW.modified_by, JSON_OBJECT(
      "id", OLD.id,
      "user_tenant_id", OLD.user_tenant_id,
      "permission", OLD.permission,
      "allowed", OLD.allowed,
      "created_on", OLD.created_on,
      "modified_on", OLD.modified_on,
      "created_by", OLD.created_by,
      "modified_by", OLD.modified_by,
      "deleted", OLD.deleted,
      "deleted_on", OLD.deleted_on,
      "deleted_by", OLD.deleted_by
  ), JSON_OBJECT(
      "id", NEW.id,
      "user_tenant_id", NEW.user_tenant_id,
      "permission", NEW.permission,
      "allowed", NEW.allowed,
      "created_on", NEW.created_on,
      "modified_on", NEW.modified_on,
      "created_by", NEW.created_by,
      "modified_by", NEW.modified_by,
      "deleted", NEW.deleted,
      "deleted_on", NEW.deleted_on,
      "deleted_by", NEW.deleted_by
  )
);

CREATE TRIGGER IF NOT EXISTS update_users_audit_trigger
AFTER UPDATE ON users
FOR EACH ROW
CALL generic_audit_procedure('UPDATE','users','USER_LOGS', 
  NEW.id, NEW.modified_by, JSON_OBJECT(
      "id", OLD.id,
      "first_name", OLD.first_name,
      "middle_name", OLD.middle_name,
      "last_name", OLD.last_name,
      "username", OLD.username,
      "email", OLD.email,
      "phone", OLD.phone,
      "created_on", OLD.created_on,
      "modified_on", OLD.modified_on,
      "created_by", OLD.created_by,
      "modified_by", OLD.modified_by,
      "deleted", OLD.deleted,
      "last_login", OLD.last_login,
      "photo_url", OLD.photo_url,
      "auth_client_ids", OLD.auth_client_ids,
      "gender", OLD.gender,
      "dob", OLD.dob,
      "designation", OLD.designation,
      "default_tenant_id", OLD.default_tenant_id,
      "deleted_by", OLD.deleted_by,
      "deleted_on", OLD.deleted_on
  ), JSON_OBJECT(
      "id", NEW.id,
      "first_name", NEW.first_name,
      "middle_name", NEW.middle_name,
      "last_name", NEW.last_name,
      "username", NEW.username,
      "email", NEW.email,
      "phone", NEW.phone,
      "created_on", NEW.created_on,
      "modified_on", NEW.modified_on,
      "created_by", NEW.created_by,
      "modified_by", NEW.modified_by,
      "deleted", NEW.deleted,
      "last_login", NEW.last_login,
      "photo_url", NEW.photo_url,
      "auth_client_ids", NEW.auth_client_ids,
      "gender", NEW.gender,
      "dob", NEW.dob,
      "designation", NEW.designation,
      "default_tenant_id", NEW.default_tenant_id,
      "deleted_by", NEW.deleted_by,
      "deleted_on", NEW.deleted_on
  )
);

-- adding DELETE audit_triggers
CREATE TRIGGER IF NOT EXISTS delete_roles_audit_trigger
AFTER DELETE ON roles
FOR EACH ROW
CALL generic_audit_procedure('DELETE','roles','ROLES_LOGS', 
  OLD.id, OLD.modified_by, JSON_OBJECT(
      "id", OLD.id,
      "name", OLD.name,
      "tenant_id", OLD.tenant_id,
      "created_on", OLD.created_on,
      "modified_on", OLD.modified_on,
      "created_by", OLD.created_by,
      "modified_by", OLD.modified_by,
      "deleted", OLD.deleted,
      "permissions", OLD.permissions,
      "allowed_clients", OLD.allowed_clients,
      "role_type", OLD.role_type,
      "description", OLD.description,
      "deleted_by", OLD.deleted_by,
      "deleted_on", OLD.deleted_on
  ), NULL
);

CREATE TRIGGER IF NOT EXISTS delete_tenant_configs_audit_trigger
AFTER DELETE ON tenant_configs
FOR EACH ROW
CALL generic_audit_procedure('DELETE','tenant_configs','TENANT_CONFIG_LOGS', 
  OLD.id, OLD.modified_by, JSON_OBJECT(
      "id", OLD.id,
      "config_key", OLD.config_key,
      "config_value", OLD.config_value,
      "created_on", OLD.created_on,
      "modified_on", OLD.modified_on,
      "created_by", OLD.created_by,
      "modified_by", OLD.modified_by,
      "deleted", OLD.deleted,
      "tenant_id", OLD.tenant_id,
      "deleted_by", OLD.deleted_by,
      "deleted_on", OLD.deleted_on
  ), NULL
);

CREATE TRIGGER IF NOT EXISTS delete_tenants_audit_trigger
AFTER DELETE ON tenants
FOR EACH ROW
CALL generic_audit_procedure('DELETE','tenants','TENANT_LOGS', 
  OLD.id, OLD.modified_by, JSON_OBJECT(
      "id", OLD.id,
      "name", OLD.name,
      "status", OLD.status,
      "created_on", OLD.created_on,
      "modified_on", OLD.modified_on,
      "created_by", OLD.created_by,
      "modified_by", OLD.modified_by,
      "deleted", OLD.deleted,
      "key", OLD.key,
      "address", OLD.address,
      "city", OLD.city,
      "state", OLD.state,
      "zip", OLD.zip,
      "country", OLD.country,
      "deleted_on", OLD.deleted_on,
      "deleted_by", OLD.deleted_by,
      "website", OLD.website
  ), NULL
);

CREATE TRIGGER IF NOT EXISTS delete_user_permissions_audit_trigger
AFTER DELETE ON user_permissions
FOR EACH ROW
CALL generic_audit_procedure('DELETE','user_permissions','USER_PERMISSION_LOGS', 
  OLD.id, OLD.modified_by, JSON_OBJECT(
      "id", OLD.id,
      "user_tenant_id", OLD.user_tenant_id,
      "permission", OLD.permission,
      "allowed", OLD.allowed,
      "created_on", OLD.created_on,
      "modified_on", OLD.modified_on,
      "created_by", OLD.created_by,
      "modified_by", OLD.modified_by,
      "deleted", OLD.deleted,
      "deleted_on", OLD.deleted_on,
      "deleted_by", OLD.deleted_by
  ), NULL
);

CREATE TRIGGER IF NOT EXISTS delete_users_audit_trigger
AFTER DELETE ON users
FOR EACH ROW
CALL generic_audit_procedure('DELETE','users','USER_LOGS', 
  OLD.id, OLD.modified_by, JSON_OBJECT(
      "id", OLD.id,
      "first_name", OLD.first_name,
      "middle_name", OLD.middle_name,
      "last_name", OLD.last_name,
      "username", OLD.username,
      "email", OLD.email,
      "phone", OLD.phone,
      "created_on", OLD.created_on,
      "modified_on", OLD.modified_on,
      "created_by", OLD.created_by,
      "modified_by", OLD.modified_by,
      "deleted", OLD.deleted,
      "last_login", OLD.last_login,
      "photo_url", OLD.photo_url,
      "auth_client_ids", OLD.auth_client_ids,
      "gender", OLD.gender,
      "dob", OLD.dob,
      "designation", OLD.designation,
      "default_tenant_id", OLD.default_tenant_id,
      "deleted_by", OLD.deleted_by,
      "deleted_on", OLD.deleted_on
  ), NULL
);

-- creating VIEW for multi tenant architecture with roles
DROP VIEW IF EXISTS v_users;
CREATE VIEW v_users AS
SELECT
    u.id,
    u.first_name,
    u.middle_name,
    u.last_name,
    u.username,
    u.email,
    u.phone,
    ut.created_on,
    ut.modified_on,
    u.created_by,
    u.modified_by,
    ut.deleted,
    ut.deleted_by,
    ut.deleted_on,
    u.last_login,
    u.photo_url,
    u.auth_client_ids,
    u.gender,
    u.dob,
    u.designation,
    u.default_tenant_id,
    ut.tenant_id,
    ut.id AS user_tenant_id,
    ut.role_id,
    ut.status,
    t.name,
    t.key,
    r.name AS rolename
FROM users u
JOIN user_tenants ut ON u.id = ut.user_id
JOIN tenants t ON t.id = ut.tenant_id
JOIN roles r ON r.id = ut.role_id;
