CREATE TABLE questions (
    id varchar(50) NOT NULL,
    uid VARCHAR(20) NOT NULL,
    name LONGTEXT NULL,
    status ENUM(
        'Draft',
        'Expired',
        'Approved'
    ) NOT NULL,
    question_type ENUM(
        'Drop Down',
        'Multi Selection',
        'Scale',
        'Single Selection',
        'Text'
    ) NOT NULL,
    is_score_enabled TINYINT(1) DEFAULT FALSE,
    is_followup_enabled TINYINT(1) DEFAULT FALSE,
    root_question_id varchar(50) NULL,
    parent_question_id varchar(50) NULL,
    validation JSON NULL,
    created_on timestamp DEFAULT current_timestamp,
    modified_on timestamp DEFAULT current_timestamp,
    deleted TINYINT(1) DEFAULT FALSE,
    created_by varchar(50),
    modified_by varchar(50),
    deleted_on timestamp NULL,
    deleted_by varchar(50),
    PRIMARY KEY (id)
);

ALTER TABLE
    questions
ADD
    CONSTRAINT fk_question_root FOREIGN KEY (root_question_id) REFERENCES questions (id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE
    questions
ADD
    CONSTRAINT fk_question_parent FOREIGN KEY (parent_question_id) REFERENCES questions (id) ON DELETE NO ACTION ON UPDATE NO ACTION;

CREATE TRIGGER questions_before_insert BEFORE
INSERT
    ON questions FOR EACH ROW BEGIN
SET
    new.id = uuid();

END;

CREATE TRIGGER questions_before_update BEFORE
UPDATE
    ON questions FOR EACH ROW BEGIN
SET
    new.modified_on = UTC_TIMESTAMP();

END;

CREATE INDEX idx_question_question_type ON questions (question_type);