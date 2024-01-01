-- creating table for storing survey cycle responses
CREATE TABLE IF NOT EXISTS survey_cycle_responses (
    id                       VARCHAR(36) PRIMARY KEY,
    survey_responder_id      VARCHAR(36) NOT NULL,
    survey_cycle_id          VARCHAR(36) NOT NULL,
    total_score              DECIMAL(5, 2),
    created_on               TIMESTAMP DEFAULT current_timestamp,
    modified_on              TIMESTAMP DEFAULT current_timestamp,
    deleted                  BOOLEAN DEFAULT false,
    created_by               VARCHAR(50),
    modified_by              VARCHAR(50),
    deleted_on               TIMESTAMP NULL,
    deleted_by               VARCHAR(50),
    ext_id                   VARCHAR(100),
    ext_metadata             JSON
);

-- adding triggers
CREATE TRIGGER survey_cycle_responses_identity 
BEFORE INSERT ON survey_cycle_responses 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER mdt_survey_cycle_responses
BEFORE UPDATE ON survey_cycle_responses 
FOR EACH ROW
SET NEW.modified_on = now();

-- adding foreign key
ALTER TABLE survey_cycle_responses
ADD CONSTRAINT fk_survey_cycle_responses_survey_cycle 
FOREIGN KEY (survey_cycle_id) 
REFERENCES survey_cycles(id);

-- adding indicies for improving performance of querying data
CREATE INDEX idx_survey_cycle_responses_survey_responder_id 
ON survey_cycle_responses(survey_responder_id);

CREATE INDEX idx_survey_response_survey_cycle_id 
ON survey_cycle_responses(survey_cycle_id);
