CREATE OR REPLACE VIEW main.v_users
 AS
 SELECT u.id,
    u.first_name,
    u.middle_name,
    u.last_name,
    concat_ws(' '::text, u.first_name,
        CASE
            WHEN u.middle_name::text = ''::text THEN NULL::character varying
            ELSE u.middle_name
        END,
        CASE
            WHEN u.last_name::text = ''::text THEN NULL::character varying
            ELSE u.last_name
        END) AS full_name,
    u.username,
    u.email,
    u.phone,
    ut.created_on,
    ut.modified_on,
    u.created_by,
    u.modified_by,
    ut.deleted,
    ut.deleted_by,
    ut.deleted_on,
    u.last_login,
    u.photo_url,
    u.auth_client_ids,
    u.gender,
    u.dob,
    u.designation,
    u.default_tenant_id,
    ut.tenant_id,
    ut.id AS user_tenant_id,
    ut.role_id,
    ut.status,
    t.name,
    t.key,
    r.name AS rolename,
    r.role_type AS roletype,
    r.permissions as permissions
    FROM main.users u
     JOIN main.user_tenants ut ON u.id = ut.user_id AND u.deleted = false
     JOIN main.tenants t ON t.id = ut.tenant_id
     JOIN main.roles r ON r.id = ut.role_id;