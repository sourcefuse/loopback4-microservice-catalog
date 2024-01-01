-- dropping foreign keys
ALTER TABLE questions
DROP FOREIGN KEY fk_question_root;

ALTER TABLE questions
DROP FOREIGN KEY fk_question_parent;

-- dropping index
DROP INDEX idx_question_question_type ON questions;

-- dropping table
DROP TABLE IF EXISTS questions;

