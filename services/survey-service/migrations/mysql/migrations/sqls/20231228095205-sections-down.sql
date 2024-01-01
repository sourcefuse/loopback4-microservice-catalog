-- dropping index
DROP INDEX idx_section_survey_id ON section;

-- dropping column
ALTER TABLE survey_questions
DROP COLUMN section_id;

-- dropping table
DROP TABLE IF EXISTS section;
