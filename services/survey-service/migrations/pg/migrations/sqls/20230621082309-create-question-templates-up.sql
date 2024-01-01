CREATE TABLE main.question_templates (
    id uuid DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid NOT NULL,
    uid varchar(20) NOT NULL,
    name VARCHAR(500) NOT NULL,
    status varchar(50) NOT NULL,
    created_on timestamp DEFAULT current_timestamp,
    modified_on timestamp DEFAULT current_timestamp,
    deleted BOOLEAN DEFAULT FALSE,
    created_by varchar(50),
    modified_by varchar(50),
    deleted_on timestamp NULL,
    deleted_by varchar(50),
    is_enable_weight BOOLEAN DEFAULT FALSE,
    ext_id varchar(100),
    ext_metadata jsonb,
    PRIMARY KEY (id)
);

CREATE TRIGGER question_templates_before_update BEFORE UPDATE ON main.question_templates FOR EACH ROW
EXECUTE FUNCTION moddatetime();


CREATE INDEX idx_question_templates_status ON main.question_templates (status);

CREATE INDEX idx_question_templates_is_enable_weight ON main.question_templates (is_enable_weight);