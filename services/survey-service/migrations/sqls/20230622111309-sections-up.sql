CREATE TABLE section (
    id varchar(50) NOT NULL,
    name VARCHAR(500) NOT NULL,
    display_order INTEGER(100) NOT NULL,
    survey_id varchar(50) NOT NULL,
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

CREATE TRIGGER section_before_insert BEFORE
INSERT
    ON section FOR EACH ROW BEGIN
SET
    new.id = uuid();

END;

CREATE TRIGGER section_before_update BEFORE
UPDATE
    ON section FOR EACH ROW BEGIN
SET
    new.modified_on = UTC_TIMESTAMP();

END;

CREATE INDEX idx_section_survey_id ON section (survey_id);

ALTER TABLE
    survey_questions
ADD
    COLUMN section_id VARCHAR(50);