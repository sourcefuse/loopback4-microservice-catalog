/* initial migration scripts for adding features and strategies 
these can we added via the console as well*/

insert into strategies (name,description,parameters) values 
('Tenant','tenant level strategy',
 '[{"name":"tenantId","type":"string","description":"tenant Id","required":true}]');
 
insert into strategies (name,description,parameters) values 
('User','user level strategy',
 '[{"name":"email","type":"string","description":"email or username","required":true}]'); 

insert into features (name, enabled,description,archived,strategies,type,stale,project,last_seen_at) values 
('tenant-feature',1,'tenant based feature',0,
 '[{"name":"Tenant","parameters":{"tenantId":""},"constraints":[]}]',
 'release',false,'default',now());
 
 insert into features (name, enabled,description,archived,strategies,type,stale,project,last_seen_at) values 
('user-feature',1,'user based feature',0,
 '[{"name":"User","parameters":{"email":""},"constraints":[]}]',
 'release',false,'default',now());
 
 insert into features (name, enabled,description,archived,strategies,type,stale,project,last_seen_at) values 
('system-feature',1,'system based feature',0,
 '[{"name":"default","parameters":{},"constraints":[]}]',
 'release',false,'default',now());