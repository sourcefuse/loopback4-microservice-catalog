DROP INDEX idx_survey_questions_survey_id ON survey_questions;

DROP INDEX idx_survey_questions_question_id ON survey_questions;

ALTER TABLE
    survey_questions drop index idx_unique;

ALTER TABLE
    survey_questions DROP FOREIGN KEY fk_survey_questions_survey_id,
    DROP FOREIGN KEY fk_survey_questions_question_id,
    DROP FOREIGN KEY fk_survey_questions_dependent_on_question_id;

DROP TABLE IF EXISTS survey_questions;