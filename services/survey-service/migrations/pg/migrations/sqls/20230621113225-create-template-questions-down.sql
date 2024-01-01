DROP INDEX IF EXISTS idx_template_questions_question_id;

DROP INDEX IF EXISTS idx_template_questions_template_id;

DROP INDEX IF EXISTS idx_template_questions_display_order;

ALTER TABLE
    main.template_questions DROP CONSTRAINT fk_template_questions_question_templates;

ALTER TABLE
    main.template_questions DROP CONSTRAINT fk_template_questions_question;

DROP TABLE main.template_questions;