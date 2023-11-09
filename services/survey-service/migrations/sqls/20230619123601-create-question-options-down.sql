ALTER TABLE
    main.questions_options DROP CONSTRAINT fk_option_question;

ALTER TABLE
    main.questions_options DROP CONSTRAINT fk_option_follow_up_question;

DROP TABLE main.question_options;