ALTER TABLE main.auth_clients
DROP COLUMN  created_by,
DROP COLUMN  modified_by;

ALTER TABLE main.user_credentials
DROP COLUMN  created_by,
DROP COLUMN  modified_by;

ALTER TABLE main.user_tenants
DROP COLUMN  created_by,
DROP COLUMN  modified_by;
