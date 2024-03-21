CALL add_columns_if_not_exists('audit_logs', 'tenant_id', 'VARCHAR(36) NOT NULL');
CALL add_columns_if_not_exists('jobs', 'tenant_id', 'VARCHAR(36) NOT NULL');
CALL add_columns_if_not_exists('mapping_logs', 'tenant_id', 'VARCHAR(36) NOT NULL');
