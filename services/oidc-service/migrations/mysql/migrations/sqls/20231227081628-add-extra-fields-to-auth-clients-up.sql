ALTER TABLE auth_clients
ADD COLUMN grant_types JSON, -- insert like grant_types = JSON_MERGE_PRESERVE(grant_types, '["ViewAnyContract"]')
ADD COLUMN response_types JSON;
