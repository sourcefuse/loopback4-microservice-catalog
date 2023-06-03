ALTER TABLE main.auth_clients
ADD COLUMN grant_types varchar(50)[],
ADD COLUMN response_types varchar(50)[];