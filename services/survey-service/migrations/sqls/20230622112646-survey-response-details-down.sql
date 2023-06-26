ALTER TABLE
    survey_cycle_responses DROP FOREIGN KEY fk_survey_cycle_responses_survey_cycle;

DROP INDEX idx_survey_cycle_responses_survey_responder_id ON survey_cycle_responses;

DROP INDEX idx_survey_response_vendor_id ON survey_cycle_responses;

DRop INDEX idx_survey_response_survey_cycle_id ON survey_cycle_responses;

DROP TABLE IF EXISTS survey_cycle_responses;