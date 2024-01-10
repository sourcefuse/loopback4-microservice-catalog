-- dropping foreign keys
ALTER TABLE survey_responders 
DROP FOREIGN KEY fk_survey_responders_survey_id;

-- dropping indices
DROP INDEX idx_survey_responders_survey_id 
ON survey_responders;

DROP INDEX idx_survey_responders_survey_cycle_id
ON survey_responders;

-- dropping table
DROP TABLE IF EXISTS survey_responders;
