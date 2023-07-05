CREATE TABLE question_options (
    id varchar(50) NOT NULL,
    name VARCHAR(500) NULL,
    display_order INTEGER(100) NOT NULL,
    score DECIMAL NULL,
    followup_question_id varchar(50) NULL,
    question_id varchar(100) NOT NULL,
    created_on timestamp DEFAULT current_timestamp,
    modified_on timestamp DEFAULT current_timestamp,
    deleted TINYINT(1) DEFAULT FALSE,
    created_by varchar(50),
    modified_by varchar(50),
    deleted_on timestamp NULL,
    deleted_by varchar(50),
    ext_id varchar(100),
    ext_metadata json,
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

CREATE TRIGGER options_before_insert BEFORE
INSERT
    ON question_options FOR EACH ROW BEGIN
SET
    new.id = uuid();

END;

CREATE TRIGGER options_before_update BEFORE
UPDATE
    ON question_options FOR EACH ROW BEGIN
SET
    new.modified_on = UTC_TIMESTAMP();

END;