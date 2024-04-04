ALTER TABLE main.search_query
ADD IF NOT EXISTS where_ json NOT NULL DEFAULT '{}';