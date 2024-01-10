CREATE TABLE main.survey_cycle_responses (
    id uuid DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid NOT NULL,
    survey_responder_id uuid NOT NULL,
    survey_cycle_id uuid NOT NULL,
    total_score DECIMAL(5, 2),
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
    main.survey_cycle_responses
ADD
    CONSTRAINT fk_survey_cycle_responses_survey_cycle FOREIGN KEY (survey_cycle_id) REFERENCES main.survey_cycles (id);

CREATE TRIGGER survey_cycle_responses_before_update BEFORE UPDATE ON main.survey_cycle_responses FOR EACH ROW
EXECUTE FUNCTION moddatetime();

CREATE INDEX idx_survey_cycle_responses_survey_responder_id ON main.survey_cycle_responses (survey_responder_id);

CREATE INDEX idx_survey_response_survey_cycle_id ON main.survey_cycle_responses (survey_cycle_id);