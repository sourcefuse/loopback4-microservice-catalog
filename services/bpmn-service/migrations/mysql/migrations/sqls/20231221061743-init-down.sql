ALTER TABLE workflow_versions
DROP FOREIGN KEY fk_workflow_versions_workflows;

DROP TABLE workflows;
DROP TABLE workflow_versions;
