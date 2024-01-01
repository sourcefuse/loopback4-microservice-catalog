CREATE TABLE main.section (
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

CREATE TRIGGER section_before_update BEFORE UPDATE ON main.section FOR EACH ROW
EXECUTE FUNCTION moddatetime();

CREATE INDEX idx_section_survey_id ON main.section (survey_id);

ALTER TABLE
    main.survey_questions
ADD
    COLUMN section_id VARCHAR(50);