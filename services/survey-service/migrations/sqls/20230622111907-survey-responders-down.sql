ALTER TABLE
    survey_responders DROP CONSTRAINT fk_survey_responders_survey_id;

DROP INDEX IF EXISTS idx_survey_responders_survey_id;

DROP INDEX IF EXISTS idx_survey_responders_survey_cycle_id;

ALTER TABLE
    survey_responders DROP CONSTRAINT fk_survey_responders_survey_id;

DROP TABLE IF EXISTS survey_responders;