/* Replace with your SQL commands */
delete from features where name in ('system-feature','user-feature','tenant-feature','role-feature');
delete from strategies where name in ('Tenant','User','Role');