DROP SCHEMA IF EXISTS main CASCADE;
CREATE SCHEMA main;

SET search_path TO main,public;
GRANT ALL ON SCHEMA main TO public;

CREATE TABLE main.workflows
(
    id                  uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL,
    workflow_version    integer                               NOT NULL,
    name                varchar,
    description         varchar,
    external_identifier varchar,
    provider            varchar,
    created_on          timestamptz DEFAULT current_timestamp NOT NULL,
    modified_on         timestamptz DEFAULT current_timestamp NOT NULL,
    deleted_on          timestamptz,
    created_by          uuid,
    modified_by         uuid,
    deleted_by          uuid,
    deleted             boolean,
    inputschema              json,
    CONSTRAINT pk_workflows_id PRIMARY KEY (id)
);

CREATE TABLE main.workflow_versions
(
    id                   uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL,
    "version"            integer NOT NULL,
    workflow_id          uuid    NOT NULL,
    bpmn_diagram         xml,
    external_workflow_id varchar,
    bpmn_file_name       varchar(100),
    inputschema               json,
    CONSTRAINT idx_workflow_versions PRIMARY KEY ("version", workflow_id)
);

ALTER TABLE main.workflow_versions
    ADD CONSTRAINT fk_workflow_versions_workflows FOREIGN KEY (workflow_id) REFERENCES main.workflows (id);