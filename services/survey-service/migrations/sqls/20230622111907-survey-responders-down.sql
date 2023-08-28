ALTER TABLE
    survey_responders DROP FOREIGN KEY fk_survey_responders_survey_id;

DROP INDEX idx_survey_responders_survey_id ON survey_responders;

DROP INDEX idx_survey_responders_survey_cycle_id ON survey_responders;

ALTER TABLE
    survey_responders DROP FOREIGN KEY fk_survey_responders_survey_id;

DROP TABLE IF EXISTS survey_responders;