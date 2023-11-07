CREATE TABLE survey_cycles (
    id uuid DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid NOT NULL,
    survey_id uuid DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_activated BOOLEAN DEFAULT FALSE,
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
CREATE TRIGGER survey_cycles_before_update BEFORE UPDATE ON survey_cycles FOR EACH ROW
EXECUTE FUNCTION moddatetime();

CREATE INDEX idx_survey_cycles_survey_id ON survey_cycles (survey_id);

CREATE INDEX idx_survey_cycles_start_date ON survey_cycles (start_date);

CREATE INDEX idx_survey_cycles_end_date ON survey_cycles (end_date);

ALTER TABLE
    survey_cycles
ADD
    CONSTRAINT fk_survey_cycles_survey_id FOREIGN KEY (survey_id) REFERENCES surveys (id) ON DELETE NO ACTION ON UPDATE NO ACTION;