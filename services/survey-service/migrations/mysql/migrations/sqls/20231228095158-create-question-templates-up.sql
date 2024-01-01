-- creating table for storing question templates
CREATE TABLE IF NOT EXISTS question_templates (
    id                 VARCHAR(36) PRIMARY KEY,
    uid                VARCHAR(20) NOT NULL,
    name               VARCHAR(500) NOT NULL,
    status             VARCHAR(50) NOT NULL,
    created_on         TIMESTAMP DEFAULT current_timestamp,
    modified_on        TIMESTAMP DEFAULT current_timestamp,
    deleted            BOOLEAN DEFAULT false,
    created_by         VARCHAR(50),
    modified_by        VARCHAR(50),
    deleted_on         TIMESTAMP NULL,
    deleted_by         VARCHAR(50),
    is_enable_weight   BOOLEAN DEFAULT false,
    ext_id             VARCHAR(100),
    ext_metadata       JSON
);

-- adding triggers
CREATE TRIGGER question_templates_identity
BEFORE INSERT ON question_templates
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER mdt_questions_templates
BEFORE UPDATE ON question_templates
FOR EACH ROW
SET NEW.modified_on = now();

-- creating indicies to improve performance
CREATE INDEX idx_question_templates_status 
ON question_templates(status);

CREATE INDEX idx_question_templates_is_enable_weight 
ON question_templates(is_enable_weight);
