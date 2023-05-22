ALTER TABLE main.auth_clients
DROP COLUMN grant_types,
DROP COLUMN redirect_uris,
DROP COLUMN response_types;