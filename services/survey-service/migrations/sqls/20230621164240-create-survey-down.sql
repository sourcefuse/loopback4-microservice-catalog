DROP INDEX idx_surveys_start_date ON surveys;

DROP INDEX idx_surveys_end_date ON surveys;

DROP INDEX idx_surveys_status ON surveys;

DROP INDEX idx_surveys_is_periodic_reassessment ON surveys;

DROP INDEX idx_surveys_recurrence_frequency ON surveys;

DROP INDEX idx_surveys_recurrence_end_date ON surveys;

DROP INDEX idx_surveys_recurrence_end_after_occurrences ON surveys;

DROP INDEX idx_surveys_is_enable_weights ON surveys;

DROP TABLE IF EXISTS surveys;