-- dropping all foreign keys
ALTER TABLE tenant_configs 
DROP FOREIGN KEY fk_tenant_configs_tenants;

ALTER TABLE user_credentials 
DROP FOREIGN KEY fk_user_credentials_users;

ALTER TABLE user_tenants 
DROP FOREIGN KEY fk_user_tenants_users;

ALTER TABLE user_tenants 
DROP FOREIGN KEY fk_user_tenants_tenants;

ALTER TABLE user_tenants 
DROP FOREIGN KEY fk_user_tenants_roles;

ALTER TABLE user_groups 
DROP FOREIGN KEY fk_user_tenant;

ALTER TABLE user_groups 
DROP FOREIGN KEY fk_groups;

ALTER TABLE user_invitations 
DROP FOREIGN KEY fk_user_invitations_user_tenants;

ALTER TABLE user_permissions 
DROP FOREIGN KEY fk_user_permissions;

ALTER TABLE user_tenant_prefs 
DROP FOREIGN KEY fk_user_tenant_prefs;

-- dropping procedure
DROP PROCEDURE IF EXISTS generic_audit_procedure;

-- dropping all tables along with views
DROP VIEW IF EXISTS v_users;
DROP TABLE IF EXISTS auth_clients;
DROP TABLE IF EXISTS `groups`;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS tenants;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS tenant_configs;
DROP TABLE IF EXISTS user_credentials;
DROP TABLE IF EXISTS user_tenants;
DROP TABLE IF EXISTS user_groups;
DROP TABLE IF EXISTS user_invitations;
DROP TABLE IF EXISTS user_permissions;
DROP TABLE IF EXISTS user_tenant_prefs;
DROP TABLE IF EXISTS audit_logs;
