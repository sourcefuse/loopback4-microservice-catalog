CREATE TABLE main.template_questions (
    id uuid DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid NOT NULL,
    template_id uuid NOT NULL,
    question_id uuid NOT NULL,
    display_order INTEGER NOT NULL,
    is_mandatory boolean DEFAULT FALSE,
    dependent_on_question_id varchar(50),
    weight DECIMAL(5, 2) DEFAULT 0.00,
    created_on timestamp DEFAULT current_timestamp,
    modified_on timestamp DEFAULT current_timestamp,
    deleted BOOLEAN DEFAULT FALSE,
    created_by varchar(50),
    modified_by varchar(50),
    deleted_on timestamp NULL,
    deleted_by varchar(50),
    ext_id varchar(100),
    ext_metadata jsonb,
    PRIMARY KEY (id)
);

ALTER TABLE
    main.template_questions
ADD
    CONSTRAINT fk_template_questions_question FOREIGN KEY (question_id) REFERENCES main.questions (id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE
    main.template_questions
ADD
    CONSTRAINT fk_template_questions_question_templates FOREIGN KEY (template_id) REFERENCES main.question_templates (id) ON DELETE NO ACTION ON UPDATE NO ACTION;


CREATE TRIGGER template_questions_before_update BEFORE UPDATE ON main.template_questions FOR EACH ROW
EXECUTE FUNCTION moddatetime();

CREATE INDEX idx_template_questions_question_id ON main.template_questions (question_id);

CREATE INDEX idx_template_questions_template_id ON main.template_questions (template_id);

CREATE INDEX idx_template_questions_display_order ON main.template_questions (display_order);