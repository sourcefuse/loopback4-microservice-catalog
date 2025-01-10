SET search_path TO main, public;

ALTER TABLE main.roles
ADD IF NOT EXISTS tenant_id uuid  NOT NULL,
ADD IF NOT EXISTS allowed_clients text[],
ADD IF NOT EXISTS description varchar(500);

ALTER TABLE main.tenants
ADD IF NOT EXISTS website varchar(100);

ALTER TABLE main.users
ADD IF NOT EXISTS photo_url varchar(250),
ADD IF NOT EXISTS designation  varchar(50);

INSERT INTO main.auth_clients(id, client_id, client_secret, redirect_url, access_token_expiration, refresh_token_expiration, auth_code_expiration, secret)
    VALUES ('1', 'test_client_id', 'test_client_secret', '', '900', '3600', '300', 'dGVsZXNjb3BlLWhlYWx0aA==');

INSERT INTO main.tenants(name, status, key)
    VALUES ('demo', 0, 'demo');

INSERT INTO main.roles(name, permissions, role_type, tenant_id)
    VALUES ('SuperAdmin', '{CreateTenant,ViewTenant,UpdateTenant,DeleteTenant,CreateTenantUser,10200,10201,10202,10203,10204,10216,10205,10206,10207,10208,10209,10210,10211,10212,10213,10214,10215,2,7008,8000,8001,8002,8003,7001,7002,7003,7004,7005,7006,7007,7008,7009,7010,7011,7012,7013,7014,7015,7016,7017,7018,7019,7020,7021,7022,7023,7024,7025,7026,7027,7028}', 0,(
            SELECT
                id
            FROM
                main.tenants
            WHERE
                key = 'demo'));

INSERT INTO main.users(first_name, last_name, username, email, auth_client_ids, default_tenant_id)
SELECT 'name',
'',
'admin@example.com', 
'admin@example.com',
'{1}',
 id
FROM
    main.tenants
WHERE
    key = 'demo';


insert into user_tenants
    (user_id, tenant_id, status, role_id)
select (select id
    from users
    where username = 'admin@example.com'), (select id
    from tenants
    where key = 'demo'), 1, id
from roles
where name = 'SuperAdmin';    


insert into user_credentials
    (user_id, auth_provider, password)
select id, 'internal', '$2a$10$TOLMGK43MjbibS8Jap2RXeHl3.4sJcR3eFbms2dBll2LTMggSK9hG'
from users
where username = 'admin@example.com';
update users set auth_client_ids = ARRAY[(select id from auth_clients where client_id = 'test_client_id')::integer];

