CREATE TABLE survey_responders (
    id uuid DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid NOT NULL,
    first_name varchar(50),
    last_name varchar(50),
    full_name varchar(101) GENERATED ALWAYS AS (
        TRIM(
            CONCAT(
                COALESCE(first_name, ''),
                CASE
                    WHEN first_name IS NOT NULL AND last_name IS NOT NULL THEN ' '
                    ELSE ''
                END,
                COALESCE(last_name, '')
            )
        )
    ) STORED,
    email varchar(150) NOT NULL,
    user_id varchar(50) NULL,
    survey_id varchar(50) NOT NULL,
    survey_cycle_id varchar(50) NULL,
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
$function$CREATE TABLE survey_responders (
    id uuid DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid NOT NULL,
    first_name varchar(50),
    last_name varchar(50),
    full_name varchar(101) GENERATED ALWAYS AS (
    COALESCE(first_name, '') ||
    CASE
        WHEN first_name IS NOT NULL AND last_name IS NOT NULL THEN ' '
        ELSE ''
    END ||
    COALESCE(last_name, '')
    ) STORED,
    email varchar(150) NOT NULL,
    user_id varchar(50) NULL,
    survey_id uuid DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid NOT NULL,
    survey_cycle_id varchar(50) NULL,
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
CREATE TRIGGER survey_responders_before_update BEFORE UPDATE ON survey_responders FOR EACH ROW
EXECUTE FUNCTION moddatetime();

CREATE INDEX idx_survey_responders_survey_id ON survey_responders (survey_id);

CREATE INDEX idx_survey_responders_survey_cycle_id ON survey_responders (survey_cycle_id);

ALTER TABLE
    survey_responders
ADD
    CONSTRAINT fk_survey_responders_survey_id FOREIGN KEY (survey_id) REFERENCES surveys (id) ON DELETE NO ACTION ON UPDATE NO ACTION;
;
CREATE TRIGGER survey_responders_before_update BEFORE UPDATE ON survey_responders FOR EACH ROW
EXECUTE FUNCTION moddatetime();

CREATE INDEX idx_survey_responders_survey_id ON survey_responders (survey_id);

CREATE INDEX idx_survey_responders_survey_cycle_id ON survey_responders (survey_cycle_id);

ALTER TABLE
    survey_responders
ADD
    CONSTRAINT fk_survey_responders_survey_id FOREIGN KEY (survey_id) REFERENCES surveys (id) ON DELETE NO ACTION ON UPDATE NO ACTION;