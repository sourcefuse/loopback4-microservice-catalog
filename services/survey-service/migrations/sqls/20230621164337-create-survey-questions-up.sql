CREATE TABLE survey_questions (
    id varchar(50) NOT NULL,
    survey_id varchar(50) NOT NULL,
    question_id varchar(50) NOT NULL,
    display_order INTEGER(100) NOT NULL,
    is_mandatory TINYINT(1) DEFAULT FALSE,
    dependent_on_question_id varchar(50) NULL,
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

CREATE TRIGGER survey_questions_before_insert BEFORE
INSERT
    ON survey_questions FOR EACH ROW BEGIN
SET
    new.id = uuid();

END;

CREATE TRIGGER survey_questions_before_update BEFORE
UPDATE
    ON survey_questions FOR EACH ROW BEGIN
SET
    new.modified_on = now();

END;

CREATE INDEX idx_survey_questions_survey_id ON survey_questions (survey_id);

CREATE INDEX idx_survey_questions_question_id ON survey_questions (question_id);

ALTER TABLE
    survey_questions
ADD
    UNIQUE idx_unique (`survey_id`, `question_id`);

ALTER TABLE
    survey_questions
ADD
    CONSTRAINT fk_survey_questions_survey_id FOREIGN KEY (survey_id) REFERENCES surveys (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD
    CONSTRAINT fk_survey_questions_question_id FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD
    CONSTRAINT fk_survey_questions_dependent_on_question_id FOREIGN KEY (dependent_on_question_id) REFERENCES survey_questions (id) ON DELETE NO ACTION ON UPDATE NO ACTION;