ALTER TABLE main.audit_logs
ADD IF NOT EXISTS tenant_id uuid  NOT NULL;

ALTER TABLE main.jobs
ADD IF NOT EXISTS tenant_id uuid  NOT NULL;

ALTER TABLE main.mapping_logs
ADD IF NOT EXISTS tenant_id uuid  NOT NULL;