ALTER TABLE
    main.survey_cycle_responses DROP CONSTRAINT fk_survey_cycle_responses_survey_cycle;

DROP INDEX IF EXISTS idx_survey_cycle_responses_survey_responder_id;

DROP INDEX IF EXISTS idx_survey_response_vendor_id;

DRop INDEX IF EXISTS idx_survey_response_survey_cycle_id;

DROP TABLE IF EXISTS main.survey_cycle_responses;