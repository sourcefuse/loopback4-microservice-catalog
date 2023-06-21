ALTER TABLE main.roles DROP COLUMN allowed_clients text[];
ALTER TABLE main.tenants DROP COLUMN website varchar(100) ;
ALTER TABLE main.users DROP COLUMN designation varchar(50);
ALTER TABLE main.users DROP COLUMN photo_url varchar(250);