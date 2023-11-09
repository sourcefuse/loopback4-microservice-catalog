CREATE TYPE response_type_enum AS ENUM ('Drop Down','Multi Selection','Scale','Single Selection','Text');

CREATE TABLE main.survey_response_details (
    id uuid DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid NOT NULL,
    survey_response_id uuid NOT NULL,
    question_id uuid NOT NULL,
    score DECIMAL(5, 2),
    option_id varchar(50) NULL DEFAULT NULL,
    text_answer TEXT NULL,
    response_type response_type_enum,
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
    main.survey_response_details
ADD
    CONSTRAINT fk_survey_response_details_survey_response FOREIGN KEY (survey_response_id) REFERENCES main.survey_cycle_responses (id);

ALTER TABLE
    main.survey_response_details
ADD
    CONSTRAINT fk_survey_response_details_question FOREIGN KEY (question_id) REFERENCES main.questions (id);


CREATE TRIGGER survey_response_details_before_update BEFORE UPDATE ON main.survey_response_details FOR EACH ROW EXECUTE FUNCTION moddatetime();

CREATE INDEX idx_survey_response_details_survey_response_id ON main.survey_response_details (survey_response_id);

CREATE INDEX idx_survey_response_details_question_id ON main.survey_response_details (question_id);