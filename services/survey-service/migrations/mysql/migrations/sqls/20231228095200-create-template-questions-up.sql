CREATE TABLE IF NOT EXISTS template_questions (
    id                         VARCHAR(36) PRIMARY KEY,
    template_id                VARCHAR(36) NOT NULL,
    question_id                VARCHAR(36) NOT NULL,
    display_order              INTEGER(100) NOT NULL,
    is_mandatory               BOOLEAN DEFAULT false,
    dependent_on_question_id   VARCHAR(50),
    `weight`                   DECIMAL(5, 2) DEFAULT 0.00,
    created_on                 TIMESTAMP DEFAULT current_timestamp,
    modified_on                TIMESTAMP DEFAULT current_timestamp,
    deleted                    BOOLEAN DEFAULT false,
    created_by                 VARCHAR(50),
    modified_by                VARCHAR(50),
    deleted_on                 TIMESTAMP NULL,
    deleted_by                 VARCHAR(50),
    ext_id                     VARCHAR(100),
    ext_metadata               JSON
);

-- adding triggers
CREATE TRIGGER template_questions_identity
BEFORE INSERT ON template_questions 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER mdt_template_questions 
BEFORE UPDATE ON template_questions 
FOR EACH ROW
SET NEW.modified_on = now();

-- adding foreign keys
ALTER TABLE template_questions 
ADD CONSTRAINT fk_template_questions_question 
FOREIGN KEY (question_id) 
REFERENCES questions (id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE template_questions
ADD CONSTRAINT fk_template_questions_question_templates 
FOREIGN KEY (template_id) 
REFERENCES question_templates (id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;

-- adding indicies to improve query performance
CREATE INDEX idx_template_questions_question_id 
ON template_questions(question_id);

CREATE INDEX idx_template_questions_template_id 
ON template_questions(template_id);

CREATE INDEX idx_template_questions_display_order 
ON template_questions(display_order);
