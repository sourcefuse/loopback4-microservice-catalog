ALTER TABLE main.auth_clients
ADD created_by varchar(100),
ADD modified_by varchar(100);

ALTER TABLE main.user_credentials
ADD created_by varchar(100),
ADD modified_by varchar(100);

ALTER TABLE main.user_tenants
ADD created_by varchar(100),
ADD modified_by varchar(100);