-- creating recent_search table
CREATE TABLE recent_search (
	id                      VARCHAR(36) NOT NULL PRIMARY KEY,
	user_id                 VARCHAR(36) NOT NULL,
	created_on              TIMESTAMP DEFAULT current_timestamp NOT NULL,
	modified_on             TIMESTAMP DEFAULT current_timestamp NOT NULL,
	created_by              VARCHAR(36),
	modified_by             VARCHAR(36),
	deleted                 BOOL DEFAULT false NOT NULL,
	deleted_on           	  TIMESTAMP,
	deleted_by           	  VARCHAR(36)
);

-- adding triggers
CREATE TRIGGER before_insert_trigger_recent_search
BEFORE INSERT ON recent_search
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- creating search_query table
CREATE TABLE search_query (
	id                      VARCHAR(36) NOT NULL PRIMARY KEY,
  `match`                   text NOT NULL,
  `limit`                 integer NULL,
  `order`                 varchar(100) NULL,
  limit_by_type           boolean NULL,
  `offset`                integer NULL,
  sources                 json NULL,
	recent_search_id		    VARCHAR(36),
	created_on              TIMESTAMP DEFAULT current_timestamp NOT NULL,
	modified_on             TIMESTAMP DEFAULT current_timestamp NOT NULL,
	created_by              VARCHAR(36),
	modified_by             VARCHAR(36),
	deleted                 BOOL DEFAULT false NOT NULL,
	deleted_on           	  TIMESTAMP,
	deleted_by           	  VARCHAR(36)
);

-- adding triggers
CREATE TRIGGER before_insert_trigger_search_query
BEFORE INSERT ON search_query
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- adding foriegn key
ALTER TABLE search_query 
ADD CONSTRAINT fk_recent_search_in_query 
FOREIGN KEY (recent_search_id)
REFERENCES recent_search(id);

-- Adding functionality for adding column if not exists 
CREATE PROCEDURE IF NOT EXISTS add_columns_if_not_exists(tableName VARCHAR(100), columnName VARCHAR(100), columnType VARCHAR(100))
BEGIN
    DECLARE columnExists INT;

    SELECT COUNT(*)
    INTO columnExists
    FROM information_schema.COLUMNS
    WHERE TABLE_NAME = tableName AND COLUMN_NAME = columnName;

    IF columnExists = 0 THEN
        SET @alterQuery = CONCAT('ALTER TABLE ', tableName, ' ADD COLUMN ', columnName, ' ', columnType);
        PREPARE alterStmt FROM @alterQuery;
        EXECUTE alterStmt;
        DEALLOCATE PREPARE alterStmt;
    END IF;
END;