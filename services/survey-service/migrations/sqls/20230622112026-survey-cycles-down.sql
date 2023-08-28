DROP INDEX idx_survey_cycles_survey_id ON survey_cycles;

DROP INDEX idx_survey_cycles_start_date ON survey_cycles;

DROP INDEX idx_survey_cycles_end_date ON survey_cycles;

ALTER TABLE
    survey_cycles DROP FOREIGN KEY fk_survey_cycles_survey_id;

DROP TABLE IF EXISTS survey_cycles;