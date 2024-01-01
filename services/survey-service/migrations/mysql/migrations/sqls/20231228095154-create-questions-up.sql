-- creating table for storing questions
CREATE TABLE IF NOT EXISTS questions (
  id                      VARCHAR(36) PRIMARY KEY,
  uid                     VARCHAR(20) NOT NULL,
  name                    LONGTEXT NULL,
  status                  VARCHAR(50) NOT NULL,
  survey_id               VARCHAR(50) NULL,
  question_type           ENUM('Drop Down', 'Multi Selection', 'Scale', 'Single Selection', 'Text') NOT NULL,
  is_score_enabled        BOOLEAN DEFAULT false,
  is_followup_enabled     BOOLEAN DEFAULT false,
  root_question_id        VARCHAR(36) NOT NULL,
  parent_question_id      VARCHAR(36) NOT NULL,
  validation              JSON NULL,
  created_on              TIMESTAMP DEFAULT current_timestamp,
  modified_on             TIMESTAMP DEFAULT current_timestamp,
  deleted                 BOOLEAN DEFAULT false,
  created_by              VARCHAR(50),
  modified_by             VARCHAR(50),
  deleted_on              TIMESTAMP NULL,
  deleted_by              VARCHAR(50),
  ext_id                  VARCHAR(100),
  ext_metadata            JSON
);

-- adding triggers
CREATE TRIGGER questions_identity
BEFORE INSERT ON questions
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER mdt_questions
BEFORE UPDATE ON questions
FOR EACH ROW
SET NEW.modified_on = now();

-- adding foreign keys
ALTER TABLE questions
ADD CONSTRAINT fk_question_root 
FOREIGN KEY (root_question_id) 
REFERENCES questions(id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE questions
ADD CONSTRAINT fk_question_parent 
FOREIGN KEY (parent_question_id) 
REFERENCES questions(id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;

-- adding index to improve performance
CREATE INDEX idx_question_question_type ON questions(question_type);
