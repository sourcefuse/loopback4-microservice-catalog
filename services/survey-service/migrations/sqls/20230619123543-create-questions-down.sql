DROP INDEX IF EXISTS idx_question_question_type;

ALTER TABLE
    questions DROP CONSTRAINT fk_question_root;

ALTER TABLE
    questions DROP CONSTRAINT fk_question_parent;

DROP TABLE IF EXISTS questions;