-- dropping foreign keys
ALTER TABLE survey_questions
DROP FOREIGN KEY fk_survey_questions_survey_id;

ALTER TABLE survey_questions
DROP FOREIGN KEY fk_survey_questions_question_id;

ALTER TABLE survey_questions
DROP FOREIGN KEY fk_survey_questions_dependent_on_question_id;

-- dropping indices
DROP INDEX idx_survey_questions_survey_id 
ON survey_questions;

DROP INDEX idx_survey_questions_question_id 
ON survey_questions;

-- dropping table
DROP TABLE IF EXISTS survey_questions;
