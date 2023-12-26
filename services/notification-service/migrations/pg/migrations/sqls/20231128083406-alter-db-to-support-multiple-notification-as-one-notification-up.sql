ALTER TABLE main.notifications
ADD COLUMN IF NOT EXISTS  is_draft boolean default FALSE;

ALTER TABLE main.notifications
ADD COLUMN IF NOT EXISTS is_critical boolean default FALSE;

ALTER TABLE main.notifications
ADD COLUMN IF NOT EXISTS group_key varchar(256);


ALTER TABLE main.notification_users
ADD COLUMN IF NOT EXISTS is_read boolean default FALSE;

ALTER TABLE main.notification_users
ADD COLUMN IF NOT EXISTS is_sent boolean default FALSE;


-- Table: main.user_notification_settings
CREATE TABLE IF NOT EXISTS main.user_notification_settings
(
	id uuid NOT NULL DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid,
    notification_type integer NOT NULL,
    user_id varchar (250) NOT NULL,
    sleep_start_time timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sleep_end_time timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted boolean DEFAULT false,
    deleted_on timestamp with time zone,
    deleted_by uuid,
    created_on timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_on timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT notification_users_settings_pkey PRIMARY KEY (id)
);
