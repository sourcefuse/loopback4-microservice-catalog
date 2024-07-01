/* Replace with your SQL commands */

ALTER TABLE main.roles
ADD IF NOT EXISTS tenant_id uuid  NOT NULL,
ADD IF NOT EXISTS allowed_clients text[],
ADD IF NOT EXISTS description varchar(500);

ALTER TABLE main.tenants
ADD IF NOT EXISTS website varchar(100);

ALTER TABLE main.users
ADD IF NOT EXISTS photo_url varchar(250),
ADD IF NOT EXISTS designation  varchar(50);


