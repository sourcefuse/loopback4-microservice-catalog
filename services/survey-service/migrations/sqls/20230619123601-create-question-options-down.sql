ALTER TABLE
    questions_options DROP FOREIGN KEY fk_option_question;

ALTER TABLE
    questions_options DROP FOREIGN KEY fk_option_follow_up_question;

DROP TABLE question_options;