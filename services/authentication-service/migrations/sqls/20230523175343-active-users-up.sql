/* Replace with your SQL commands */

CREATE TABLE main.active_users (
		id 						uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL ,
		actor                   text NOT NULL,
		tenant_id				text NOT NULL,
		login_time				timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
		token_payload			text NULL,
		CONSTRAINT pk_active_users_id PRIMARY KEY ( id )
);