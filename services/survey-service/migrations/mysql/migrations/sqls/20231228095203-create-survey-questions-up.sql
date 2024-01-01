CREATE TABLE IF NOT EXISTS survey_questions (
    id                        VARCHAR(36) PRIMARY KEY,
    survey_id                 VARCHAR(36) NOT NULL,
    question_id               VARCHAR(36) NOT NULL,
    display_order             INTEGER(100) NOT NULL,
    is_mandatory              BOOLEAN DEFAULT false,
    dependent_on_question_id  VARCHAR(36) NOT NULL,
    `weight`                  DECIMAL(5, 2) DEFAULT 0.00,
    created_on                TIMESTAMP DEFAULT current_timestamp,
    modified_on               TIMESTAMP DEFAULT current_timestamp,
    deleted                   BOOLEAN DEFAULT false,
    created_by                VARCHAR(50),
    modified_by               VARCHAR(50),
    deleted_on                TIMESTAMP NULL,
    deleted_by                VARCHAR(50),
    ext_id                    VARCHAR(100),
    ext_metadata              JSON
);

-- adding triggers
CREATE TRIGGER survey_questions_identity
BEFORE INSERT ON survey_questions
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- adding constraint
ALTER TABLE survey_questions
ADD CONSTRAINT idx_unique UNIQUE (`survey_id`, `question_id`);

-- adding foreign keys
ALTER TABLE survey_questions
ADD CONSTRAINT fk_survey_questions_survey_id 
FOREIGN KEY (survey_id) 
REFERENCES surveys(id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE survey_questions
ADD CONSTRAINT fk_survey_questions_question_id 
FOREIGN KEY (question_id) 
REFERENCES questions(id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE survey_questions
ADD CONSTRAINT fk_survey_questions_dependent_on_question_id 
FOREIGN KEY (dependent_on_question_id) 
REFERENCES survey_questions(id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;

-- creating indices to improve querying performance
CREATE INDEX idx_survey_questions_survey_id 
ON survey_questions(survey_id);

CREATE INDEX idx_survey_questions_question_id 
ON survey_questions(question_id);
