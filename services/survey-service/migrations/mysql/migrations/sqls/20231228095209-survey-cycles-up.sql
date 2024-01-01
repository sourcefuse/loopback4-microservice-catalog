-- creating table for storing survey cycles
CREATE TABLE IF NOT EXISTS survey_cycles (
    id                VARCHAR(36) PRIMARY KEY,
    survey_id         VARCHAR(36) NOT NULL,
    start_date        DATE NOT NULL,
    end_date          DATE NOT NULL,
    is_activated      BOOLEAN DEFAULT false,
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
CREATE TRIGGER survey_cycles_identity
BEFORE INSERT ON survey_cycles 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER mdt_survey_cycles
BEFORE UPDATE ON survey_cycles 
FOR EACH ROW
SET NEW.modified_on = now();

-- adding foreign keys
ALTER TABLE survey_cycles
ADD CONSTRAINT fk_survey_cycles_survey_id 
FOREIGN KEY (survey_id) 
REFERENCES surveys (id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;

-- adding indicies to improve querying performance
CREATE INDEX idx_survey_cycles_survey_id 
ON survey_cycles(survey_id);

CREATE INDEX idx_survey_cycles_start_date 
ON survey_cycles(start_date);

CREATE INDEX idx_survey_cycles_end_date 
ON survey_cycles(end_date);
