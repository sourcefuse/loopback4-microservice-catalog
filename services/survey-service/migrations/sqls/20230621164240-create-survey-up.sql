CREATE TABLE surveys (
    id uuid DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid NOT NULL,
    uid varchar(20) NOT NULL,
    name VARCHAR(500) NOT NULL,
    start_date DATE,
    end_date DATE,
    status varchar(50) NOT NULL,
	is_periodic_reassessment BOOLEAN DEFAULT false,
	recurrence_frequency varchar(50) NOT NULL,
	recurrence_end_date DATE,
	recurrence_end_after_occurrences INTEGER,
    is_enable_weights BOOLEAN DEFAULT FALSE,
    survey_text TEXT NULL,
    base_survey_id varchar(50) NULL, 
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
CREATE TRIGGER surveys_before_update BEFORE UPDATE ON surveys FOR EACH ROW
EXECUTE FUNCTION moddatetime();

CREATE INDEX idx_surveys_start_date ON surveys (start_date);

CREATE INDEX idx_surveys_end_date ON surveys (end_date);

CREATE INDEX idx_surveys_status ON surveys (status);

CREATE INDEX idx_surveys_is_periodic_reassessment ON surveys (is_periodic_reassessment);

CREATE INDEX idx_surveys_recurrence_frequency ON surveys (recurrence_frequency);

CREATE INDEX idx_surveys_recurrence_end_date ON surveys (recurrence_end_date);

CREATE INDEX idx_surveys_recurrence_end_after_occurrences ON surveys (recurrence_end_after_occurrences);

CREATE INDEX idx_surveys_is_enable_weights ON surveys (is_enable_weights);