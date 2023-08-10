CREATE SCHEMA IF NOT EXISTS main;
GRANT ALL ON SCHEMA main TO public;

CREATE TABLE "main".assignees
(
    id                  uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL,
    name                varchar,
    type                varchar,
    created_on          timestamptz DEFAULT current_timestamp NOT NULL,
    modified_on         timestamptz DEFAULT current_timestamp NOT NULL,
    deleted_on          timestamptz,
    created_by          uuid,
    modified_by         uuid,
    deleted_by          uuid,
    deleted             boolean,
    CONSTRAINT pk_assignees_id PRIMARY KEY (id)
);

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
    CONSTRAINT pk_workflows_id PRIMARY KEY (id),
    CONSTRAINT fk_tasks_assignees FOREIGN KEY (assignee_id) REFERENCES "main".assignees (id)
);


CREATE TABLE "main".task_assignements
(
    id                   uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL,
    task_id              uuid,
    assignee_id          uuid    NOT NULL,
    assignment_date      timestamptz,
    status               varchar,
    CONSTRAINT pk_task_assignments_id PRIMARY KEY (id),
    CONSTRAINT fk_tasks FOREIGN KEY (task_id) REFERENCES "main".tasks (id),
    CONSTRAINT fk_tasks_assignements_to_assignees FOREIGN KEY (assignee_id) REFERENCES "main".assignees (id)
);

CREATE TABLE "main".task_workflow_mappings
(
    id                   uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL,
    workflow_key         varchar,
    task_key             varchar,
    CONSTRAINT pk_task_workflow_mappings_id PRIMARY KEY (id)
);

CREATE TABLE "main".activities
(
    id                   uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL,
    task_id              uuid,
    workflow_id          uuid    NOT NULL,
    assignee_id          uuid    NOT NULL,
    created_on           timestamptz,
    comment              varchar,
    CONSTRAINT pk_activities_id PRIMARY KEY (id),
    CONSTRAINT fk_activities_to_tasks FOREIGN KEY (task_id) REFERENCES "main".tasks (id),
    CONSTRAINT fk_activities_to_assignees FOREIGN KEY (assignee_id) REFERENCES "main".assignees (id)
);

CREATE TABLE "main".activity_events
(
    id                   uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL,
    activity_id          uuid,
    event_type           varchar,
    created_on           timestamptz,
    event_data           json,
    CONSTRAINT pk_activity_events_id PRIMARY KEY (id),
    CONSTRAINT fk_activities_events_to_activities FOREIGN KEY (activity_id) REFERENCES "main".activities (id)
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

CREATE TABLE "main".event_workflow_mapping
(
    id                   uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL,
    event_key            varchar,
    workflow_key         varchar,
    CONSTRAINT pk_event_workflow_mapping_id PRIMARY KEY (id)
);