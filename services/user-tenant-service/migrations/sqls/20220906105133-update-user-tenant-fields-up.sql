ALTER TABLE main.roles ADD allowed_clients text[];
ALTER TABLE main.tenants ADD website varchar(100);
ALTER TABLE main.users ADD designation varchar(50);
ALTER TABLE main.users ADD photo_url varchar(250);
