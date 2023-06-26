CREATE TABLE survey_response_details (
    id varchar(50) NOT NULL,
    survey_response_id varchar(50) NOT NULL,
    question_id varchar(50) NOT NULL,
    score DECIMAL(5, 2),
    option_id varchar(50) NULL DEFAULT NULL,
    text_answer TEXT NULL,
    response_type enum(
        'Drop Down',
        'Multi Selection',
        'Scale',
        'Single Selection',
        'Text'
    ),
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
    survey_response_details
ADD
    CONSTRAINT fk_survey_response_details_survey_response FOREIGN KEY (survey_response_id) REFERENCES survey_cycle_responses (id);

ALTER TABLE
    survey_response_details
ADD
    CONSTRAINT fk_survey_response_details_question FOREIGN KEY (question_id) REFERENCES questions (id);

CREATE TRIGGER survey_response_details_before_insert BEFORE
INSERT
    ON survey_response_details FOR EACH ROW BEGIN
SET
    new.id = uuid();

END;

CREATE TRIGGER survey_response_details_before_update BEFORE
UPDATE
    ON survey_response_details FOR EACH ROW BEGIN
SET
    new.modified_on = UTC_TIMESTAMP();

END;

CREATE INDEX idx_survey_response_details_survey_response_id ON survey_response_details (survey_response_id);

CREATE INDEX idx_survey_response_details_question_id ON survey_response_details (question_id);