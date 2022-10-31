SET search_path
TO main,public;

/* Inserting auth clients */
insert into auth_clients
  (client_id, client_secret, secret)
values
  ('test_client_id', 'test_client_secret', 'secret');

-- Inserting roles
insert into roles
  (name, permissions, role_type)
values
  ('Admin', '{CreateTodo,UpdateTodo,DeleteTodo}', 0);

insert into roles
  (name, permissions, role_type)
values
  ('Others', '{}', 1);

-- Inserting tenants
insert into tenants
  (name, status, key)
values
  ('Master', 1, 'master');

-- Inserting Admin User
insert into users
    (first_name, last_name, username, email, default_tenant_id)
select 'Admin', 'User', 'admin@example.com', 'admin@example.com', id
from tenants
where key = 'master';

insert into user_tenants
    (user_id, tenant_id, status, role_id)
select (select id
    from users
    where username = 'admin@example.com'), (select id
    from tenants
    where key = 'master'), 1, id
from roles
where role_type = 0;

insert into user_credentials
    (user_id, auth_provider, password)
select id, 'internal', '$2a$10$TOLMGK43MjbibS8Jap2RXeHl3.4sJcR3eFbms2dBll2LTMggSK9hG'
from users
where username = 'admin@example.com';
update users set auth_client_ids = ARRAY[(select id from auth_clients where client_id = 'test_client_id')::integer];


