SET search_path TO main,public;
GRANT ALL ON SCHEMA main TO public;

CREATE TABLE main.mapping_logs
(
    id uuid NOT NULL DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid,
    filter_used jsonb NOT NULL,
    file_name text COLLATE pg_catalog."default" NOT NULL,
    tenant_id				uuid NOT NULL,
    CONSTRAINT mapping_schema_pkey PRIMARY KEY (id)
)