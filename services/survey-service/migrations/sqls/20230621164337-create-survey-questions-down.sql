DROP INDEX IF EXISTS idx_survey_questions_survey_id;

DROP INDEX IF EXISTS idx_survey_questions_question_id;

ALTER TABLE
    survey_questions drop index idx_unique;

ALTER TABLE
    survey_questions DROP CONSTRAINT fk_survey_questions_survey_id,
    DROP CONSTRAINT fk_survey_questions_question_id,
    DROP CONSTRAINT fk_survey_questions_dependent_on_question_id;

DROP TABLE IF EXISTS survey_questions;