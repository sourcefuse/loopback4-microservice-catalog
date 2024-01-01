-- removing foreign keys
ALTER TABLE search_query
DROP FOREIGN KEY fk_recent_search_in_query;

-- deleting tables
DROP TABLE recent_search;
DROP TABLE search_query;
