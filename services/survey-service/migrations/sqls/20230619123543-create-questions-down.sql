DROP INDEX idx_question_question_type on questions;

ALTER TABLE
    questions DROP FOREIGN KEY fk_question_root;

ALTER TABLE
    questions DROP FOREIGN KEY fk_question_parent;

DROP TABLE IF EXISTS questions;