ALTER TABLE main.tenants DROP COLUMN primary_contact_email TYPE varchar(100);
ALTER TABLE main.tenants DROP COLUMN allowed_domain varchar(100) ;
ALTER TABLE main.tenants DROP COLUMN tenant_type varchar(100); 