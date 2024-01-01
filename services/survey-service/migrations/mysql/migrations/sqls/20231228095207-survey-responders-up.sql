-- creating table for storing survey responders
CREATE TABLE IF NOT EXISTS survey_responders (
    id                VARCHAR(36) PRIMARY KEY,
    first_name        VARCHAR(50),
    last_name         VARCHAR(50),
    full_name         VARCHAR(101) GENERATED ALWAYS AS (
        TRIM(
          CONCAT(
            IFNULL(first_name, ''),
            IF(
                first_name IS NOT NULL AND last_name IS NOT NULL,
                ' ',
                ''
            ),
            IFNULL(last_name, '')
          )
        )
    ) STORED,
    email             VARCHAR(150) NOT NULL,
    user_id           VARCHAR(50) NULL,
    survey_id         VARCHAR(36) NOT NULL,
    survey_cycle_id   VARCHAR(50) NULL,
    created_on        TIMESTAMP DEFAULT current_timestamp,
    modified_on       TIMESTAMP DEFAULT current_timestamp,
    deleted           BOOLEAN DEFAULT false,
    created_by        VARCHAR(50),
    modified_by       VARCHAR(50),
    deleted_on        TIMESTAMP NULL,
    deleted_by        VARCHAR(50),
    ext_id            VARCHAR(100),
    ext_metadata      JSON
);

-- adding triggers
CREATE TRIGGER survey_responders_identity 
BEFORE INSERT ON survey_responders 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER mdt_survey_responders
BEFORE UPDATE ON survey_responders 
FOR EACH ROW
SET NEW.modified_on = now();

-- adding foreign keys
ALTER TABLE survey_responders
ADD CONSTRAINT fk_survey_responders_survey_id 
FOREIGN KEY (survey_id) 
REFERENCES surveys(id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;

-- creating indices for improving querying performance
CREATE INDEX idx_survey_responders_survey_id 
ON survey_responders(survey_id);

CREATE INDEX idx_survey_responders_survey_cycle_id 
ON survey_responders(survey_cycle_id);
