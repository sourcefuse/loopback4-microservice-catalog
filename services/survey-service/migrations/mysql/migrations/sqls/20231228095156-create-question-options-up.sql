-- creating table for storing question options
CREATE TABLE IF NOT EXISTS question_options (
  id                     VARCHAR(36) PRIMARY KEY,
  name                   VARCHAR(500) NULL,
  display_order          INTEGER(100) NOT NULL,
  score                  DECIMAL(10,0),
  followup_question_id   VARCHAR(36) NOT NULL,
  question_id            VARCHAR(36) NOT NULL,
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
CREATE TRIGGER question_options_identity 
BEFORE INSERT ON question_options 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER mdt_question_options 
BEFORE UPDATE ON question_options 
FOR EACH ROW
SET NEW.modified_on = now();

-- adding foreign keys
ALTER TABLE question_options
ADD CONSTRAINT fk_option_question 
FOREIGN KEY (question_id) 
REFERENCES questions(id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE question_options
ADD CONSTRAINT fk_option_follow_up_question 
FOREIGN KEY (followup_question_id) 
REFERENCES questions(id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;
