CALL add_columns_if_not_exists('auth_clients', 'created_by', 'VARCHAR(100)');
CALL add_columns_if_not_exists('auth_clients', 'modified_by', 'VARCHAR(100)');

CALL add_columns_if_not_exists('user_credentials', 'created_by', 'VARCHAR(100)');
CALL add_columns_if_not_exists('user_credentials', 'modified_by', 'VARCHAR(100)');

CALL add_columns_if_not_exists('user_tenants', 'created_by', 'VARCHAR(100)');
CALL add_columns_if_not_exists('user_tenants', 'modified_by', 'VARCHAR(100)');
