
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

CALL add_columns_if_not_exists('search_query', 'where_', 'json');

DROP PROCEDURE IF EXISTS add_columns_if_not_exists;