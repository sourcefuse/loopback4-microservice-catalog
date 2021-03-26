DROP SCHEMA IF EXISTS bpmn CASCADE;
CREATE SCHEMA bpmn;
GRANT ALL ON SCHEMA bpmn TO public;

CREATE TABLE "bpmn".workflows
(
    id                  uuid                                  NOT NULL,
    workflow_version    integer                               NOT NULL,
    external_identifier varchar,
    provider            varchar,
    created_on          timestamptz DEFAULT current_timestamp NOT NULL,
    modified_on         timestamptz DEFAULT current_timestamp NOT NULL,
    created_by          uuid,
    modified_by         uuid,
    deleted             boolean,
    params              json,
    CONSTRAINT pk_workflows_id PRIMARY KEY (id)
);

CREATE TABLE "bpmn".workflow_versions
(
    "version"            integer NOT NULL,
    workflow_id          uuid    NOT NULL,
    bpmn_diagram         xml,
    external_workflow_id varchar,
    bpmn_file_name       varchar(100),
    params               json,
    CONSTRAINT idx_workflow_versions PRIMARY KEY ("version", workflow_id)
);

ALTER TABLE "bpmn".workflow_versions
    ADD CONSTRAINT fk_workflow_versions_workflows FOREIGN KEY (workflow_id) REFERENCES "bpmn".workflows (id);
