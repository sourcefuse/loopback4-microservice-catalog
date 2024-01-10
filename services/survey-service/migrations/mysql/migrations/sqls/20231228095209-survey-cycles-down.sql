-- dropping foreign keys
ALTER TABLE survey_cycles
DROP FOREIGN KEY fk_survey_cycles_survey_id;

-- dropping indicies to improve querying performance
DROP INDEX idx_survey_cycles_survey_id ON survey_cycles;
DROP INDEX idx_survey_cycles_start_date ON survey_cycles;
DROP INDEX idx_survey_cycles_end_date ON survey_cycles;

-- dropping table
DROP TABLE IF EXISTS survey_cycles;
