CREATE SCHEMA IF NOT EXISTS main;

SET search_path TO main,public;
GRANT ALL ON SCHEMA main TO public;

CREATE TYPE question_type_enum AS ENUM ('Drop Down','Multi Selection','Scale','Single Selection','Text');

CREATE TABLE main.questions (
    id uuid DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid NOT NULL,
    uid VARCHAR(20) NOT NULL,
    name TEXT NULL,
    status varchar(50) NOT NULL,
    survey_id VARCHAR(50) NULL,
    question_type question_type_enum NOT NULL,
    is_score_enabled BOOLEAN DEFAULT FALSE,
    is_followup_enabled BOOLEAN DEFAULT FALSE,
    root_question_id uuid NOT NULL,
    parent_question_id uuid NOT NULL,
    validation JSON NULL,
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
    main.questions
ADD
    CONSTRAINT fk_question_root FOREIGN KEY (root_question_id) REFERENCES main.questions (id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE
    main.questions
ADD
    CONSTRAINT fk_question_parent FOREIGN KEY (parent_question_id) REFERENCES main.questions (id) ON DELETE NO ACTION ON UPDATE NO ACTION;


CREATE OR REPLACE FUNCTION moddatetime()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.modified_on = now();
    RETURN NEW;
END;
$function$
;

CREATE TRIGGER questions_before_update BEFORE UPDATE ON main.questions FOR EACH ROW EXECUTE FUNCTION moddatetime();

CREATE INDEX idx_question_question_type ON main.questions (question_type);