-- dropping foreign keys
ALTER TABLE survey_response_details
DROP FOREIGN KEY fk_survey_response_details_survey_response;

ALTER TABLE survey_response_details
DROP FOREIGN KEY fk_survey_response_details_question;

-- dropping indices 
DROP INDEX idx_survey_response_details_survey_response_id 
ON survey_response_details;

DROP INDEX idx_survey_response_details_question_id 
ON survey_response_details;

-- dropping table
DROP TABLE IF EXISTS survey_response_details;
