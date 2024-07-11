ALTER TABLE core.data_sets
ADD COLUMN IF NOT EXISTS data_set_query_sql text;