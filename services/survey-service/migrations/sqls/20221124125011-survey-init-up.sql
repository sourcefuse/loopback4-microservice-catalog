CREATE TABLE
    question (
        id varchar(50) NOT NULL,
        uid VARCHAR(20) NOT NULL,
        name LONGTEXT NULL,
        status ENUM(
            'Draft',
            'Expired',
            'Approved'
        ) NOT NULL,
        question_type ENUM(
            'Multi Selection',
            'Single Selection',
            'Text'
        ) NOT NULL,
        is_score_enabled TINYINT(1) DEFAULT FALSE,
        is_followup_enabled TINYINT(1) DEFAULT FALSE,
        root_question_id varchar(50) NULL,
        parent_question_id varchar(50) NULL,
        validation JSON NULL,
        created_on timestamp DEFAULT current_timestamp,
        modified_on timestamp DEFAULT current_timestamp,
        deleted TINYINT(1) DEFAULT FALSE,
        created_by varchar(50),
        modified_by varchar(50),
        deleted_on timestamp NULL,
        deleted_by varchar(50),
        PRIMARY KEY (id)
    );

-- options table

CREATE TABLE
    options (
        id varchar(50) NOT NULL,
        name VARCHAR(45) NULL,
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
        PRIMARY KEY (id)
 );
 ALTER TABLE question
ADD
    CONSTRAINT fk_question_root FOREIGN KEY (root_question_id) REFERENCES question (id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE question
ADD
    CONSTRAINT fk_question_parent FOREIGN KEY (parent_question_id) REFERENCES question (id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE options
ADD
    CONSTRAINT fk_option_question FOREIGN KEY (question_id) REFERENCES question (id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE options
ADD
    CONSTRAINT fk_option_follow_up_question FOREIGN KEY (followup_question_id) REFERENCES question (id) ON DELETE NO ACTION ON UPDATE NO ACTION;

CREATE TRIGGER question_before_insert BEFORE INSERT 
ON question FOR EACH ROW BEGIN 
	SET new.id = uuid();
END; 

CREATE TRIGGER question_before_update
BEFORE UPDATE ON question FOR EACH ROW
BEGIN
    SET new.modified_on = UTC_TIMESTAMP();
END;
CREATE TRIGGER options_before_insert BEFORE INSERT 
ON options FOR EACH ROW BEGIN 
	SET new.id = uuid();
END; 

CREATE TRIGGER options_before_update
BEFORE UPDATE ON options FOR EACH ROW
BEGIN
    SET new.modified_on = UTC_TIMESTAMP();
END;
