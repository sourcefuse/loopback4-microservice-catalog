DROP SCHEMA IF EXISTS main CASCADE;
CREATE SCHEMA main;

SET search_path TO main,public;
GRANT ALL ON SCHEMA main TO public;

CREATE TABLE main.auth_clients (
    deleted boolean DEFAULT false,
    deleted_on timestamp with time zone,
    deleted_by text,
    created_on timestamp with time zone,
    modified_on timestamp with time zone,
    id integer NOT NULL,
    client_id text NOT NULL,
    client_secret text NOT NULL,
    secret text NOT NULL,
    redirect_url text,
    access_token_expiration integer NOT NULL,
    refresh_token_expiration integer NOT NULL,
    auth_code_expiration integer NOT NULL
);

CREATE TABLE main.roles (
    deleted boolean DEFAULT false,
    deleted_on timestamp with time zone,
    deleted_by text,
    created_on timestamp with time zone,
    modified_on timestamp with time zone,
    created_by text,
    modified_by text,
    id text NOT NULL,
    name text NOT NULL,
    role_type integer NOT NULL,
    permissions text
);

CREATE TABLE main.tenants (
    deleted boolean DEFAULT false,
    deleted_on timestamp with time zone,
    deleted_by text,
    created_on timestamp with time zone,
    modified_on timestamp with time zone,
    created_by text,
    modified_by text,
    id text NOT NULL,
    name text NOT NULL,
    key text NOT NULL,
    address text,
    city text,
    state text,
    zip text,
    country text,
    status integer NOT NULL
);

CREATE TABLE main.tenant_configs (
    deleted boolean DEFAULT false,
    deleted_on timestamp with time zone,
    deleted_by text,
    created_on timestamp with time zone,
    modified_on timestamp with time zone,
    created_by text,
    modified_by text,
    id text NOT NULL,
    config_key text NOT NULL,
    config_value text,
    tenant_id text NOT NULL
);

CREATE TABLE main.user_credentials (
    deleted boolean DEFAULT false,
    deleted_on timestamp with time zone,
    deleted_by text,
    created_on timestamp with time zone,
    modified_on timestamp with time zone,
    id text NOT NULL,
    user_id text NOT NULL,
    auth_provider text NOT NULL,
    auth_id text,
    auth_token text,
    password text
);

CREATE TABLE main.user_permissions (
    deleted boolean DEFAULT false,
    deleted_on timestamp with time zone,
    deleted_by text,
    created_on timestamp with time zone,
    modified_on timestamp with time zone,
    created_by text,
    modified_by text,
    id text NOT NULL,
    user_tenant_id text NOT NULL,
    permission text NOT NULL,
    allowed boolean DEFAULT true NOT NULL
);


CREATE TABLE main.user_resources (
    deleted boolean DEFAULT false,
    deleted_on timestamp with time zone,
    deleted_by text,
    created_on timestamp with time zone,
    modified_on timestamp with time zone,
    created_by text,
    modified_by text,
    id text NOT NULL,
    user_tenant_id text NOT NULL,
    resource_name text NOT NULL,
    resource_value text NOT NULL,
    allowed boolean DEFAULT true NOT NULL
);

CREATE TABLE main.user_tenants (
    deleted boolean DEFAULT false,
    deleted_on timestamp with time zone,
    deleted_by text,
    created_on timestamp with time zone,
    modified_on timestamp with time zone,
    id text NOT NULL,
    status integer,
    locale text,
    tenant_id text NOT NULL,
    user_id text NOT NULL,
    role_id text NOT NULL
);

CREATE TABLE main.users (
    deleted boolean DEFAULT false,
    deleted_on timestamp with time zone,
    deleted_by text,
    created_on timestamp with time zone,
    modified_on timestamp with time zone,
    created_by text,
    modified_by text,
    id text NOT NULL,
    first_name text NOT NULL,
    last_name text,
    middle_name text,
    username text NOT NULL,
    email text,
    phone text,
    auth_client_ids text,
    last_login timestamp with time zone,
    dob timestamp with time zone,
    gender text,
    default_tenant_id text
);

ALTER TABLE ONLY main.auth_clients
    ADD CONSTRAINT auth_clients_pkey PRIMARY KEY (id);

ALTER TABLE ONLY main.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);

ALTER TABLE ONLY main.tenant_configs
    ADD CONSTRAINT tenant_configs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY main.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);

ALTER TABLE ONLY main.user_credentials
    ADD CONSTRAINT user_credentials_pkey PRIMARY KEY (id);

ALTER TABLE ONLY main.user_permissions
    ADD CONSTRAINT user_permissions_pkey PRIMARY KEY (id);


ALTER TABLE ONLY main.user_resources
    ADD CONSTRAINT user_resources_pkey PRIMARY KEY (id);


ALTER TABLE ONLY main.user_tenants
    ADD CONSTRAINT user_tenants_pkey PRIMARY KEY (id);

ALTER TABLE ONLY main.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);