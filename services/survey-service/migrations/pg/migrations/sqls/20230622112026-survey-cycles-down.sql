DROP INDEX IF EXISTS idx_survey_cycles_survey_id;

DROP INDEX IF EXISTS idx_survey_cycles_start_date;

DROP INDEX IF EXISTS idx_survey_cycles_end_date;

ALTER TABLE
    main.survey_cycles DROP CONSTRAINT fk_survey_cycles_survey_id;

DROP TABLE IF EXISTS survey_cycles;