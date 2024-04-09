-- creating table for storing Login activities
CREATE TABLE IF NOT EXISTS login_activity (
		id 						VARCHAR(36) NOT NULL PRIMARY KEY,
        actor                   TEXT NOT NULL,
        tenant_id				TEXT,
		login_time				TIMESTAMP DEFAULT current_timestamp NOT NULL,
		token_payload			TEXT NOT NULL,
		login_type				TEXT NOT NULL,
		device_info				TEXT,
		ip_address				TEXT
);

-- Adding triggers
CREATE TRIGGER IF NOT EXISTS before_insert_trigger_login_activity
BEFORE INSERT ON login_activity 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());
