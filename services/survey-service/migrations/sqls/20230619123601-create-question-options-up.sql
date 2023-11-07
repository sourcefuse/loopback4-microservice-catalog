CREATE TABLE question_options (
    id uuid DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid NOT NULL,
    name VARCHAR(500) NULL,
    display_order INTEGER NOT NULL,
    score DECIMAL(10,0),
    followup_question_id uuid DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid NOT NULL,
    question_id uuid DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid NOT NULL,
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
    question_options
ADD
    CONSTRAINT fk_option_question FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE
    question_options
ADD
    CONSTRAINT fk_option_follow_up_question FOREIGN KEY (followup_question_id) REFERENCES questions (id) ON DELETE NO ACTION ON UPDATE NO ACTION;


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
CREATE TRIGGER options_before_update BEFORE UPDATE ON question_options FOR EACH ROW
EXECUTE FUNCTION moddatetime();