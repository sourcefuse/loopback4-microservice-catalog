SET search_path
TO main,public;
insert into auth_clients
  (client_id, client_secret, secret)
values
  ('temp_client', 'temp_secret', 'secret');

insert into auth_clients
  (client_id, client_secret, secret,client_type)
values
  ('temp_client_private', 'temp_secret_private', 'secret_private','private');



insert into tenants
  (name, status, key)
values
  ('Tenant 1', 1, 't1');
insert into tenants
  (name, status, key)
values
  ('Tenant 2', 1, 't2');



insert into roles
  (name, permissions, allowed_clients, role_type,tenant_id)
select 'Admin', '{}', '{temp_client}', 0, id from tenants where key='t1';
insert into roles
  (name, permissions, allowed_clients, role_type,tenant_id)
select 'Admin_t2_private', '{}', '{temp_client_private}', 1, id from tenants where key='t2';



/* Password - test123!@# */
insert into users
    (first_name, last_name, username, email, default_tenant_id)
select 'John', 'Doe', 'john.doe@example.com', 'john.doe@example.com', id
from tenants
where key = 't1';



insert into user_tenants
    (user_id, tenant_id, status, role_id)
select (select id
    from users
    where username = 'john.doe@example.com'), (select id
    from tenants
    where key = 't1'), 1, id
from roles
where role_type = 0;

insert into user_credentials
    (user_id, auth_provider, password)
select id, 'internal', '$2a$10$TOLMGK43MjbibS8Jap2RXeHl3.4sJcR3eFbms2dBll2LTMggSK9hG'
from users
where username = 'john.doe@example.com';
update users set auth_client_ids = ARRAY[(select id from auth_clients where client_id = 'temp_client')::integer]
where username = 'john.doe@example.com';
/* Password - test123!@# */


insert into users
    (first_name, last_name, username, email, default_tenant_id)
select 'Sarah', 'Rafferty', 'sarah.rafferty@example.com', 'sarah.rafferty@example.com', id
from tenants
where key = 't2';

insert into user_tenants
    (user_id, tenant_id, status, role_id)
select (select id
    from users
    where username = 'sarah.rafferty@example.com'), (select id
    from tenants
    where key = 't2'), 1, id
from roles
where role_type = 1;

insert into user_credentials
    (user_id, auth_provider, password)
select id, 'internal', '$2a$10$TOLMGK43MjbibS8Jap2RXeHl3.4sJcR3eFbms2dBll2LTMggSK9hG'
from users
where username = 'sarah.rafferty@example.com';
update users set auth_client_ids = ARRAY[(select id from auth_clients where client_id = 'temp_client_private')::integer]
where username = 'sarah.rafferty@example.com';

