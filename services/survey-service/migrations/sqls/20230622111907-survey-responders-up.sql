CREATE TABLE survey_responders (
    id varchar(50) NOT NULL,
    first_name varchar(50),
    last_name varchar(50),
    full_name varchar(101) GENERATED ALWAYS AS (
        TRIM(
            CONCAT(
                IFNULL(first_name, ''),
                IF(
                    first_name IS NOT NULL
                    AND last_name IS NOT NULL,
                    ' ',
                    ''
                ),
                IFNULL(last_name, '')
            )
        )
    ) STORED,
    email varchar(150) NOT NULL,
    user_id varchar(50) NULL,
    survey_id varchar(50) NOT NULL,
    survey_cycle_id varchar(50) NULL,
    created_on timestamp DEFAULT current_timestamp,
    modified_on timestamp DEFAULT current_timestamp,
    deleted TINYINT(1) DEFAULT FALSE,
    created_by varchar(50),
    modified_by varchar(50),
    deleted_on timestamp NULL,
    deleted_by varchar(50),
    PRIMARY KEY (id)
);

CREATE TRIGGER survey_responders_before_insert BEFORE
INSERT
    ON survey_responders FOR EACH ROW BEGIN
SET
    new.id = uuid();

END;

CREATE TRIGGER survey_responders_before_update BEFORE
UPDATE
    ON survey_responders FOR EACH ROW BEGIN
SET
    new.modified_on = now();

END;

CREATE INDEX idx_survey_responders_survey_id ON survey_responders (survey_id);

CREATE INDEX idx_survey_responders_survey_cycle_id ON survey_responders (survey_cycle_id);

ALTER TABLE
    survey_responders
ADD
    CONSTRAINT fk_survey_responders_survey_id FOREIGN KEY (survey_id) REFERENCES surveys (id) ON DELETE NO ACTION ON UPDATE NO ACTION;