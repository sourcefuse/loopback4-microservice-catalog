-- creating table for storing survey response details
CREATE TABLE IF NOT EXISTS survey_response_details (
    id                     VARCHAR(36) PRIMARY KEY,
    survey_response_id     VARCHAR(36) NOT NULL,
    question_id            VARCHAR(36) NOT NULL,
    score                  DECIMAL(5, 2),
    option_id              VARCHAR(50) NULL DEFAULT NULL,
    text_answer            TEXT NULL,
    response_type          ENUM('Drop Down', 'Multi Selection', 'Scale', 'Single Selection', 'Text'),
    created_on             TIMESTAMP DEFAULT current_timestamp,
    modified_on            TIMESTAMP DEFAULT current_timestamp,
    deleted                BOOLEAN DEFAULT false,
    created_by             VARCHAR(50),
    modified_by            VARCHAR(50),
    deleted_on             TIMESTAMP NULL,
    deleted_by             VARCHAR(50),
    ext_id                 VARCHAR(100),
    ext_metadata           JSON
);

-- adding triggers
CREATE TRIGGER survey_response_details_identity 
BEFORE INSERT ON survey_response_details 
FOR EACH ROW 
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER mdt_survey_response_details
BEFORE UPDATE ON survey_response_details 
FOR EACH ROW 
SET NEW.modified_on = now();

-- adding foreign keys
ALTER TABLE survey_response_details
ADD CONSTRAINT fk_survey_response_details_survey_response 
FOREIGN KEY (survey_response_id) 
REFERENCES survey_cycle_responses(id);

ALTER TABLE survey_response_details
ADD CONSTRAINT fk_survey_response_details_question 
FOREIGN KEY (question_id) 
REFERENCES questions(id);

-- creating indices to improve querying performance
CREATE INDEX idx_survey_response_details_survey_response_id 
ON survey_response_details(survey_response_id);

CREATE INDEX idx_survey_response_details_question_id 
ON survey_response_details(question_id);

