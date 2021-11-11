delete from features where name in ('system-feature','user-feature','tenant-feature');
delete from strategies where name in ('Tenant','User');