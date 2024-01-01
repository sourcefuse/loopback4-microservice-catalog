ALTER TABLE auth_clients
ADD created_by VARCHAR(100),
ADD modified_by VARCHAR(100);

ALTER TABLE user_credentials
ADD created_by VARCHAR(100),
ADD modified_by VARCHAR(100);

ALTER TABLE user_tenants
ADD created_by VARCHAR(100),
ADD modified_by VARCHAR(100);
