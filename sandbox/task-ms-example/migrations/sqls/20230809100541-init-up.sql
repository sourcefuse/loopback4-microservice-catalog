CREATE SCHEMA IF NOT EXISTS main;
GRANT ALL ON SCHEMA main TO public;

CREATE TABLE "main".tasks
(
    id                  uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL,
    key                 varchar                               NOT NULL,
    name                varchar,
    description         varchar,
    status              varchar,
    priority            varchar,
    severity            varchar,
    type                varchar,
    start_date          timestamptz,
    due_date            timestamptz,
    end_date            timestamptz,
    deleted_on          timestamptz,
    deleted_by          uuid,
    deleted             boolean,
    assignee_id         uuid,
    CONSTRAINT pk_tasks_id PRIMARY KEY (id)
);

CREATE TABLE "main".task_assignements
(
    id                   uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL,
    task_id              uuid,
    assignee_id          uuid    NOT NULL,
    assignment_date      timestamptz,
    status               varchar,
    CONSTRAINT pk_task_assignments_id PRIMARY KEY (id),
    CONSTRAINT fk_tasks FOREIGN KEY (task_id) REFERENCES "main".tasks (id)
);

CREATE TABLE "main".task_workflows
(
    id                   uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL,
    workflow_key         varchar,
    task_key             varchar,
    created_on          timestamptz DEFAULT current_timestamp NOT NULL,
    modified_on         timestamptz DEFAULT current_timestamp NOT NULL,
    deleted_on          timestamptz,
    created_by          uuid,
    modified_by         uuid,
    deleted_by          uuid,
    deleted             boolean,
    CONSTRAINT pk_task_workflows_id PRIMARY KEY (id)
);

CREATE TABLE "main".events
(
    id                   uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL,
    "key"                varchar,
    "description"        varchar,
    source               varchar,
    payload              json,
    created_on           timestamptz DEFAULT current_timestamp NOT NULL,
    CONSTRAINT pk_events_id PRIMARY KEY (id)
);

CREATE TABLE "main".event_workflows
(
    id                   uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL,
    event_key            varchar,
    workflow_key         varchar,
    created_on           timestamptz DEFAULT current_timestamp NOT NULL,
    modified_on         timestamptz DEFAULT current_timestamp NOT NULL,
    deleted_on          timestamptz,
    created_by          uuid,
    modified_by         uuid,
    deleted_by          uuid,
    deleted             boolean,
    CONSTRAINT pk_event_workflows_id PRIMARY KEY (id)
);

CREATE TABLE "main".webhook_subscriptions
(
    id                   uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL,
    "key"              varchar,
    "url"                varchar,
    CONSTRAINT pk_webhook_subscriptions_id PRIMARY KEY (id)
);

CREATE TABLE "main".api_keys
(
    id                   uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL,
    "api_key"            varchar,
    "api_secret"         varchar,
    CONSTRAINT pk_api_keys_id PRIMARY KEY (id)
);