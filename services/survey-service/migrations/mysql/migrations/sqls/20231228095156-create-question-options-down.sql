-- dropping foreign keys
ALTER TABLE question_options
DROP FOREIGN KEY fk_option_question;

ALTER TABLE question_options
DROP FOREIGN KEY fk_option_follow_up_question;

-- dropping table
DROP TABLE IF EXISTS question_options;
