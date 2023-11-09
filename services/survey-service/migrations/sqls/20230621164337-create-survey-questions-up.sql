CREATE TABLE main.survey_questions (
    id uuid DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid NOT NULL,
    survey_id uuid NOT NULL,
    question_id uuid NOT NULL,
    display_order INTEGER NOT NULL,
    is_mandatory BOOLEAN DEFAULT FALSE,
    dependent_on_question_id uuid NOT NULL,
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

CREATE INDEX idx_survey_questions_survey_id ON main.survey_questions (survey_id);

CREATE INDEX idx_survey_questions_question_id ON main.survey_questions (question_id);

ALTER TABLE
    main.survey_questions
ADD
   CONSTRAINT idx_unique UNIQUE (survey_id, question_id);

ALTER TABLE
    main.survey_questions
ADD
    CONSTRAINT fk_survey_questions_survey_id FOREIGN KEY (survey_id) REFERENCES main.surveys (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD
    CONSTRAINT fk_survey_questions_question_id FOREIGN KEY (question_id) REFERENCES main.questions (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD
    CONSTRAINT fk_survey_questions_dependent_on_question_id FOREIGN KEY (dependent_on_question_id) REFERENCES main.survey_questions (id) ON DELETE NO ACTION ON UPDATE NO ACTION;