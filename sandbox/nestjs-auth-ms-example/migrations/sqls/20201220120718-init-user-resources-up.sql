CREATE TABLE main.user_resources (
	id uuid NOT NULL DEFAULT md5(random()::text || clock_timestamp()::text)::uuid,
	user_tenant_id uuid NOT NULL,
	resource_name varchar(50) NOT NULL,
	resource_value varchar(50) NOT NULL,
	allowed bool NOT NULL,
	created_on timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	modified_on timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_by uuid NULL,
	modified_by uuid NULL,
	deleted bool NOT NULL DEFAULT false,
	deleted_on timestamptz NULL,
	deleted_by uuid NULL,
	CONSTRAINT pk_user_resources_id PRIMARY KEY (id)
);

CREATE trigger mdt_user_resources BEFORE UPDATE ON main.user_resources for each ROW EXECUTE PROCEDURE main.moddatetime('modified_on');
