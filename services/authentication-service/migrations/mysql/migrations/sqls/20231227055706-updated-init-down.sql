ALTER TABLE auth_clients
DROP COLUMN created_by,
DROP COLUMN modified_by;

ALTER TABLE user_credentials
DROP COLUMN created_by,
DROP COLUMN modified_by;

ALTER TABLE user_tenants
DROP COLUMN created_by,
DROP COLUMN modified_by;

