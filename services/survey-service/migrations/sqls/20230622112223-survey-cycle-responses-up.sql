CREATE TABLE survey_cycle_responses (
    id varchar(50) NOT NULL,
    survey_responder_id varchar(50) NOT NULL,
    survey_cycle_id varchar(50) NOT NULL,
    total_score DECIMAL(5, 2),
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
    survey_cycle_responses
ADD
    CONSTRAINT fk_survey_cycle_responses_survey_cycle FOREIGN KEY (survey_cycle_id) REFERENCES survey_cycle_responses (id);

CREATE TRIGGER survey_cycle_responses_before_insert BEFORE
INSERT
    ON survey_cycle_responses FOR EACH ROW BEGIN
SET
    new.id = uuid();

END;

CREATE TRIGGER survey_cycle_responses_before_update BEFORE
UPDATE
    ON survey_cycle_responses FOR EACH ROW BEGIN
SET
    new.modified_on = UTC_TIMESTAMP();

END;

CREATE INDEX idx_survey_cycle_responses_survey_responder_id ON survey_cycle_responses (survey_responder_id);

CREATE INDEX idx_survey_response_survey_cycle_id ON survey_cycle_responses (survey_cycle_id);