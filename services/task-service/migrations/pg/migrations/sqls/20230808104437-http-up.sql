
CREATE TABLE "main".webhook_subscriptions
(
    id                   uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL,
    "key"              varchar NOT NULL,
    "url"                varchar NOT NULL,
    CONSTRAINT pk_webhook_subscriptions_id PRIMARY KEY (id)
);

CREATE TABLE "main".client_apps
(
    id                   uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL,
    "api_key"            varchar NOT NULL,
    "api_secret"         varchar NOT NULL,
    name                 varchar NOT NULL,
    CONSTRAINT pk_api_keys_id PRIMARY KEY (id)
);