-- creating table for storing sections
CREATE TABLE IF NOT EXISTS section (
    id               VARCHAR(36) PRIMARY KEY,
    name             VARCHAR(500) NOT NULL,
    display_order    INTEGER NOT NULL,
    survey_id        VARCHAR(50) NOT NULL,
    created_on       TIMESTAMP DEFAULT current_timestamp,
    modified_on      TIMESTAMP DEFAULT current_timestamp,
    deleted          BOOLEAN DEFAULT false,
    created_by       VARCHAR(50),
    modified_by      VARCHAR(50),
    deleted_on       TIMESTAMP NULL,
    deleted_by       VARCHAR(50),
    ext_id           VARCHAR(100),
    ext_metadata     JSON
);

-- adding triggers
CREATE TRIGGER section_identity
BEFORE INSERT ON section 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER section_before_update 
BEFORE UPDATE ON section 
FOR EACH ROW
SET NEW.modified_on = now();

-- adding index
CREATE INDEX idx_section_survey_id 
ON section(survey_id);

-- adding a column named section_id
ALTER TABLE survey_questions
ADD COLUMN section_id VARCHAR(50);
