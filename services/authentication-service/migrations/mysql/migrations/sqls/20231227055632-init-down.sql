-- Dropping foreign keys
ALTER TABLE tenant_configs 
DROP FOREIGN KEY fk_tenant_configs_tenants;

ALTER TABLE user_credentials 
DROP FOREIGN KEY fk_user_credentials_users;

ALTER TABLE user_permissions 
DROP FOREIGN KEY fk_user_permissions;

ALTER TABLE user_resources 
DROP FOREIGN KEY fk_user_resources;

ALTER TABLE user_tenants 
DROP FOREIGN KEY fk_user_tenants_users;

ALTER TABLE user_tenants 
DROP FOREIGN KEY fk_user_tenants_tenants;

ALTER TABLE user_tenants 
DROP FOREIGN KEY fk_user_tenants_roles;

-- dropping all tables
DROP TABLE IF EXISTS auth_clients;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS tenant_configs;
DROP TABLE IF EXISTS tenants;
DROP TABLE IF EXISTS user_credentials;
DROP TABLE IF EXISTS user_permissions;
DROP TABLE IF EXISTS user_resources;
DROP TABLE IF EXISTS user_tenants;
DROP TABLE IF EXISTS users;

-- dropping procedure
DROP PROCEDURE IF EXISTS add_columns_if_not_exists;
