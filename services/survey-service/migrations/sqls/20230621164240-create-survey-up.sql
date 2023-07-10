CREATE TABLE surveys (
    id varchar(50) NOT NULL,
    uid varchar(20) NOT NULL,
    name VARCHAR(500) NOT NULL,
    start_date DATE,
    end_date DATE,
    status varchar(50) NOT NULL,
    is_enable_weights TINYINT(1) DEFAULT FALSE,
    survey_text LONGTEXT NULL,
    base_survey_id varchar(50) NULL created_on timestamp DEFAULT current_timestamp,
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

CREATE TRIGGER surveys_before_insert BEFORE
INSERT
    ON surveys FOR EACH ROW BEGIN
SET
    new.id = uuid();

END;

CREATE TRIGGER surveys_before_update BEFORE
UPDATE
    ON surveys FOR EACH ROW BEGIN
SET
    new.modified_on = now();

END;

CREATE INDEX idx_surveys_start_date ON surveys (start_date);

CREATE INDEX idx_surveys_end_date ON surveys (end_date);

CREATE INDEX idx_surveys_status ON surveys (status);

CREATE INDEX idx_surveys_is_periodic_reassessment ON surveys (is_periodic_reassessment);

CREATE INDEX idx_surveys_recurrence_frequency ON surveys (recurrence_frequency);

CREATE INDEX idx_surveys_recurrence_end_date ON surveys (recurrence_end_date);

CREATE INDEX idx_surveys_recurrence_end_after_occurrences ON surveys (recurrence_end_after_occurrences);

CREATE INDEX idx_surveys_is_enable_weights ON surveys (is_enable_weights);