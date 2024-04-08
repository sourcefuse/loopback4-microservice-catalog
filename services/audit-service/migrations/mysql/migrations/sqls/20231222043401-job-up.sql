-- creating jobs table
CREATE TABLE jobs (
    id           VARCHAR(36) NOT NULL PRIMARY KEY,
    filter_used  json,
    status       text COLLATE utf8mb4_general_ci NOT NULL,
    operation   text COLLATE utf8mb4_general_ci,
    result       text COLLATE utf8mb4_general_ci
);

-- adding triggers
CREATE TRIGGER before_insert_trigger_jobs
BEFORE INSERT ON jobs
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());
