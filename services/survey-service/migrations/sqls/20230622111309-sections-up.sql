CREATE TABLE section (
    id uuid DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid NOT NULL,
    name VARCHAR(500) NOT NULL,
    display_order INTEGER NOT NULL,
    survey_id varchar(50) NOT NULL,
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
CREATE TRIGGER section_before_update BEFORE UPDATE ON section FOR EACH ROW
EXECUTE FUNCTION moddatetime();

CREATE INDEX idx_section_survey_id ON section (survey_id);

ALTER TABLE
    survey_questions
ADD
    COLUMN section_id VARCHAR(50);