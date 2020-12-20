SET search_path
TO main,public;

insert into auth_clients
  (client_id, client_secret, secret)
values
  ('temp_client', 'temp_secret', 'secret');

insert into roles
  (name, permissions, allowed_clients, role_type)
values
  ('Admin', '{}', '{temp_client}', 0);

insert into tenants
  (name, status, key)
values
  ('Temp', 1, 'temp');

/* Password - test123!@# */
insert into users
    (first_name, last_name, username, email, default_tenant_id)
select 'John', 'Doe', 'john.doe@example.com', 'john.doe@example.com', id
from tenants
where key = 'temp';
insert into user_tenants
    (user_id, tenant_id, status, role_id)
select (select id
    from users
    where username = 'john.doe@example.com'), (select id
    from tenants
    where key = 'temp'), 1, id
from roles
where role_type = 0;
insert into user_credentials
    (user_id, auth_provider, password)
select id, 'internal', '$2a$10$TOLMGK43MjbibS8Jap2RXeHl3.4sJcR3eFbms2dBll2LTMggSK9hG'
from users
where username = 'john.doe@example.com';
update users set auth_client_ids = ARRAY[(select id from auth_clients where client_id = 'temp_client')::integer];

/* Password - test123!@# */
insert into users
    (first_name, last_name, username, email, default_tenant_id)
select 'Sarah', 'Rafferty', 'sarah.rafferty@example.com', 'sarah.rafferty@example.com', id
from tenants
where key = 'temp';
insert into user_tenants
    (user_id, tenant_id, status, role_id)
select (select id
    from users
    where username = 'sarah.rafferty@example.com'), (select id
    from tenants
    where key = 'temp'), 1, id
from roles
where role_type = 0;
insert into user_credentials
    (user_id, auth_provider, password)
select id, 'internal', '$2a$10$TOLMGK43MjbibS8Jap2RXeHl3.4sJcR3eFbms2dBll2LTMggSK9hG'
from users
where username = 'sarah.rafferty@example.com';
update users set auth_client_ids = ARRAY[(select id from auth_clients where client_id = 'temp_client')::integer];
