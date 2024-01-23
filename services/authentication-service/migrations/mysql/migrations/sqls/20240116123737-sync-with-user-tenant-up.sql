CALL add_columns_if_not_exists('roles', 'tenant_id', 'VARCHAR(36) NOT NULL');
CALL add_columns_if_not_exists('roles', 'allowed_clients', 'JSON');
CALL add_columns_if_not_exists('roles', 'description', 'VARCHAR(500)');

-- ALTER TABLE for tenants
CALL add_columns_if_not_exists('tenants', 'website', 'VARCHAR(100)');

-- ALTER TABLE for users
CALL add_columns_if_not_exists('users', 'photo_url', 'VARCHAR(250)');
CALL add_columns_if_not_exists('users', 'designation', 'VARCHAR(50)');
