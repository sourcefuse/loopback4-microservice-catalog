-- creating table for storing surveys
CREATE TABLE IF NOT EXISTS surveys (
    id                                  VARCHAR(36) PRIMARY KEY,
    uid                                 VARCHAR(20) NOT NULL,
    name                                VARCHAR(500) NOT NULL,
    start_date                          DATE,
    end_date                            DATE,
    status                              VARCHAR(50) NOT NULL,
	  is_periodic_reassessment            BOOLEAN DEFAULT false,
	  recurrence_frequency                VARCHAR(50) NOT NULL,
	  recurrence_end_date                 DATE,
	  recurrence_end_after_occurrences    INTEGER,
    is_enable_weights                   BOOLEAN DEFAULT false,
    survey_text                         LONGTEXT NULL,
    base_survey_id                      VARCHAR(50) NULL, 
    created_on                          TIMESTAMP DEFAULT current_timestamp,
    modified_on                         TIMESTAMP DEFAULT current_timestamp,
    deleted                             BOOLEAN DEFAULT false,
    created_by                          VARCHAR(50),
    modified_by                         VARCHAR(50),
    deleted_on                          TIMESTAMP NULL,
    deleted_by                          VARCHAR(50),
    ext_id                              VARCHAR(100),
    ext_metadata                        JSON
);

-- adding triggers
CREATE TRIGGER surveys_identity 
BEFORE INSERT ON surveys 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER mdt_surveys 
BEFORE UPDATE ON surveys 
FOR EACH ROW
SET NEW.modified_on = now();

-- creating indices to improve querying performance
CREATE INDEX idx_surveys_start_date 
ON surveys(start_date);

CREATE INDEX idx_surveys_end_date 
ON surveys(end_date);

CREATE INDEX idx_surveys_status 
ON surveys(status);

CREATE INDEX idx_surveys_is_periodic_reassessment 
ON surveys(is_periodic_reassessment);

CREATE INDEX idx_surveys_recurrence_frequency 
ON surveys(recurrence_frequency);

CREATE INDEX idx_surveys_recurrence_end_date 
ON surveys(recurrence_end_date);

CREATE INDEX idx_surveys_recurrence_end_after_occurrences 
ON surveys(recurrence_end_after_occurrences);

CREATE INDEX idx_surveys_is_enable_weights 
ON surveys(is_enable_weights);
