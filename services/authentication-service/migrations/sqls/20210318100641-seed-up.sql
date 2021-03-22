/* Replace with your SQL commands */

SET search_path
TO main,public;

insert into auth_clients
  (client_id, client_secret, secret)
values
  ('pms_webapp', 'saqw21!@', 'plmnkoqazxsw');

insert into roles
  (name, permissions, allowed_clients, role_type)
values
  ('Platform Admin', '{}', '{pms_webapp}', 0);

insert into tenants
  (name, status, key)
values
  ('Rakuten', 1, 'master');

insert into tenants
  (name, status, key)
values
  ('Sourcefuse', 1, 'sourcefuse');

insert into users
  (first_name, last_name, username, email, default_tenant_id)
select 'Platform', 'Admin', 'meenu.rani@sourcefuse.com', 'meenu.rani@sourcefuse.com', id
from tenants
where key = 'master'
;
insert into user_tenants
  (user_id, tenant_id, status, role_id)
select (select id
  from users
  where username = 'meenu.rani@sourcefuse.com'), (select id
  from tenants
  where key = 'master'), 1, id
from roles
where role_type = 0;
insert into user_credentials
  (user_id, auth_provider, auth_id)
select U.id, 'keycloak', '84ad97b3-9cb9-42d7-94c6-2fdf6f3a2bf8'
from users U
where U.username = 'meenu.rani@sourcefuse.com';

update users set auth_client_ids = array_cat(auth_client_ids, ARRAY[(select id from auth_clients where client_id = 'pms_webapp')::integer]);
