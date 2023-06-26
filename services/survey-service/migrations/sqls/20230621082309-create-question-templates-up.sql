CREATE TABLE question_templates (
    id varchar(50) NOT NULL,
    uid varchar(20) NOT NULL,
    name VARCHAR(500) NOT NULL,
    status ENUM('Draft', 'Approved') NOT NULL,
    created_on timestamp DEFAULT current_timestamp,
    modified_on timestamp DEFAULT current_timestamp,
    deleted TINYINT(1) DEFAULT FALSE,
    created_by varchar(50),
    modified_by varchar(50),
    deleted_on timestamp NULL,
    deleted_by varchar(50),
    is_enable_weight TINYINT(1) DEFAULT FALSE,
    PRIMARY KEY (id)
);

CREATE TRIGGER question_templates_before_insert BEFORE
INSERT
    ON question_templates FOR EACH ROW BEGIN
SET
    new.id = uuid();

END;

CREATE TRIGGER question_templates_before_update BEFORE
UPDATE
    ON question_templates FOR EACH ROW BEGIN
SET
    new.modified_on = UTC_TIMESTAMP();

END;

CREATE INDEX idx_question_templates_status ON question_templates (status);

CREATE INDEX idx_question_templates_is_enable_weight ON question_templates (is_enable_weight);