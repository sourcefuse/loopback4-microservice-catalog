-- Drop the tenant_id column from main.audit_logs table
ALTER TABLE main.audit_logs
DROP COLUMN IF EXISTS tenant_id;

-- Drop the tenant_id column from main.jobs table
ALTER TABLE main.jobs
DROP COLUMN IF EXISTS tenant_id;

-- Drop the tenant_id column from main.mapping_logs table
ALTER TABLE main.mapping_logs
DROP COLUMN IF EXISTS tenant_id;