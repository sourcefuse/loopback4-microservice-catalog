ALTER TABLE main.auth_clients
ADD IF NOT EXISTS created_by varchar(100),
ADD IF NOT EXISTS modified_by varchar(100);

ALTER TABLE main.user_credentials
ADD IF NOT EXISTS created_by varchar(100),
ADD IF NOT EXISTS modified_by varchar(100);

ALTER TABLE main.user_tenants
ADD IF NOT EXISTS created_by varchar(100),
ADD IF NOT EXISTS modified_by varchar(100);