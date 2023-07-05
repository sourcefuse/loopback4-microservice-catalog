CREATE TABLE template_questions (
    id varchar(50) NOT NULL,
    template_id varchar(50) NOT NULL,
    question_id varchar(50) NOT NULL,
    display_order INTEGER(100) NOT NULL,
    is_mandatory boolean DEFAULT 0,
    dependent_on_question_id varchar(50),
    `weight` DECIMAL(5, 2) DEFAULT 0.00,
    created_on timestamp DEFAULT current_timestamp,
    modified_on timestamp DEFAULT current_timestamp,
    deleted TINYINT(1) DEFAULT FALSE,
    created_by varchar(50),
    modified_by varchar(50),
    deleted_on timestamp NULL,
    deleted_by varchar(50),
    ext_id varchar(100),
    ext_metadata json,
    PRIMARY KEY (id)
);

ALTER TABLE
    template_questions
ADD
    CONSTRAINT fk_template_questions_question FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE
    template_questions
ADD
    CONSTRAINT fk_template_questions_question_templates FOREIGN KEY (template_id) REFERENCES question_templates (id) ON DELETE NO ACTION ON UPDATE NO ACTION;

CREATE TRIGGER template_questions_before_insert BEFORE
INSERT
    ON template_questions FOR EACH ROW BEGIN
SET
    new.id = uuid();

END;

CREATE TRIGGER template_questions_before_update BEFORE
UPDATE
    ON template_questions FOR EACH ROW BEGIN
SET
    new.modified_on = UTC_TIMESTAMP();

END;

CREATE INDEX idx_template_questions_question_id ON template_questions (question_id);

CREATE INDEX idx_template_questions_template_id ON template_questions (template_id);

CREATE INDEX idx_template_questions_display_order ON template_questions (display_order);