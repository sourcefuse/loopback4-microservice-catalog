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
