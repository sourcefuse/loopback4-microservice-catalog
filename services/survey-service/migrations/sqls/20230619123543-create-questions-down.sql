DROP INDEX IF EXISTS idx_question_question_type;

ALTER TABLE
    main.questions DROP CONSTRAINT fk_question_root;

ALTER TABLE
    main.questions DROP CONSTRAINT fk_question_parent;

DROP TABLE IF EXISTS main.questions;