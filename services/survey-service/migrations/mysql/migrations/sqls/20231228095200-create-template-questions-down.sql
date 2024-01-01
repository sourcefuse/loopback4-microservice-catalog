-- dropping foreign keys
ALTER TABLE template_questions 
DROP FOREIGN KEY fk_template_questions_question_templates;

ALTER TABLE template_questions 
DROP FOREIGN KEY fk_template_questions_question;

-- dropping indicies
DROP INDEX idx_template_questions_question_id 
ON template_questions;

DROP INDEX idx_template_questions_template_id 
ON template_questions;

DROP INDEX idx_template_questions_display_order 
ON template_questions;

-- dropping tables
DROP TABLE template_questions;
