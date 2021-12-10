/* Replace with your SQL commands */


insert into strategies (name,description,parameters) values 
('Tenant','tenant level strategy',
 '[{"name":"tenantId","type":"string","description":"tenant Id","required":true}]');
 
insert into strategies (name,description,parameters) values 
('User','user level strategy',
 '[{"name":"email","type":"string","description":"email or username","required":true}]'); 

 insert into strategies (name,description,parameters) values 
('Role','role level strategy',
 '[{"name":"role","type":"string","description":"role","required":true}]');


/*replace the tenantId, role and email as per your system */
insert into features (name, enabled,description,archived,strategies,type,stale,project,last_seen_at) values 
('tenant-feature',1,'tenant based feature',0,
 '[{"name":"Tenant","parameters":{"tenantId":"93616da8-94cc-675b-61e7-ca43e445d639"},"constraints":[]}]',
 'release',false,'default',now());
 
 insert into features (name, enabled,description,archived,strategies,type,stale,project,last_seen_at) values 
('user-feature',1,'user based feature',0,
 '[{"name":"User","parameters":{"email":"user@example.com"},"constraints":[]}]',
 'release',false,'default',now());
 
 insert into features (name, enabled,description,archived,strategies,type,stale,project,last_seen_at) values 
('system-feature',1,'system based feature',0,
 '[{"name":"default","parameters":{},"constraints":[]}]',
 'release',false,'default',now());

 insert into features (name, enabled,description,archived,strategies,type,stale,project,last_seen_at) values 
('role-feature',1,'role based feature',0,
 '[{"name":"Role","parameters":{"role":"0"},"constraints":[]}]',
 'release',false,'default',now());

 /*role = 0 for Admin*/