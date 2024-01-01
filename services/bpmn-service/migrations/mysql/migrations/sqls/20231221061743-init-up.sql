-- creating Workflows table
CREATE TABLE workflows (
    id                    VARCHAR(36) NOT NULL PRIMARY KEY,
    workflow_version      INTEGER NOT NULL,
    name                  VARCHAR(255),
    description           VARCHAR(255),
    external_identifier   VARCHAR(255),
    provider              VARCHAR(255),
    created_on            TIMESTAMP DEFAULT current_timestamp NOT NULL,
    modified_on           TIMESTAMP DEFAULT current_timestamp NOT NULL,
    deleted_on            TIMESTAMP,
    created_by            VARCHAR(36),
    modified_by           VARCHAR(36),
    deleted_by            VARCHAR(36),
    deleted               BOOLEAN,
    inputschema           JSON
);

-- adding triggers
CREATE TRIGGER before_insert_trigger_workflows
BEFORE INSERT ON workflows
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- creating Workflow Versions table
CREATE TABLE workflow_versions (
    id                   VARCHAR(36) NOT NULL,
    `version`              INT NOT NULL,
    workflow_id          VARCHAR(36) NOT NULL,
    bpmn_diagram         TEXT,
    external_workflow_id VARCHAR(255),
    bpmn_file_name       VARCHAR(100),
    inputschema          JSON,
    PRIMARY KEY (`version`, workflow_id)
);

-- adding triggers
CREATE TRIGGER before_insert_trigger_workflow_versions
BEFORE INSERT ON workflow_versions
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- adding foreign keys
ALTER TABLE workflow_versions
ADD CONSTRAINT fk_workflow_versions_workflows 
FOREIGN KEY (workflow_id) 
REFERENCES workflows (id);
