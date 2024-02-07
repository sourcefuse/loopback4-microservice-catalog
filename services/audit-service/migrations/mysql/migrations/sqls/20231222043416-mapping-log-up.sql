-- creating mapping_logs table
CREATE TABLE mapping_logs (
    id              VARCHAR(36) NOT NULL PRIMARY KEY,
    filter_used     JSON NOT NULL,
    file_name       TEXT COLLATE utf8mb4_general_ci NOT NULL,
	tenant_id				VARCHAR(36) NOT NULL,
);

-- adding triggers
CREATE TRIGGER before_insert_trigger_mapping_logs
BEFORE INSERT ON mapping_logs
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());
