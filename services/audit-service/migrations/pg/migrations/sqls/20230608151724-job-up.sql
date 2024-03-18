SET search_path TO main,public;
GRANT ALL ON SCHEMA main TO public;

CREATE TABLE main.jobs
(
    id uuid NOT NULL DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid,
    filter_used jsonb,
    status text COLLATE pg_catalog."default" NOT NULL,
    result text COLLATE pg_catalog."default",
    tenant_id				uuid NOT NULL,
    operation text COLLATE pg_catalog."default",
    CONSTRAINT jobs_pkey PRIMARY KEY (id)
)