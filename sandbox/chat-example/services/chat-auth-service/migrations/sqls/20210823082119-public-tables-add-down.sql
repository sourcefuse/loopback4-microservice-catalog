DROP SCHEMA IF EXISTS public CASCADE;

SET search_path TO public,public;

DELETE FROM user_credentials;
DELETE FROM user_tenants;
DELETE FROM users;
DELETE FROM tenants;
DELETE FROM roles;
DELETE FROM auth_clients;

update public.roles set permissions=array_remove(permissions,'TodoCreator') where role_type IN (0,2);

DROP SCHEMA IF EXISTS public
CASCADE;
DROP SCHEMA IF EXISTS logs
CASCADE;
