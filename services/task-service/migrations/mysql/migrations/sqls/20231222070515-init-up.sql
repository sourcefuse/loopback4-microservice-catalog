-- creating table assignees
CREATE TABLE assignees (
    id                  VARCHAR(36) NOT NULL PRIMARY KEY,
    name                VARCHAR(255),
    type                VARCHAR(255),
    created_on          TIMESTAMP DEFAULT current_timestamp NOT NULL,
    modified_on         TIMESTAMP DEFAULT current_timestamp NOT NULL,
    deleted_on          TIMESTAMP,
    created_by          VARCHAR(36),
    modified_by         VARCHAR(36),
    deleted_by          VARCHAR(36),
    deleted             BOOLEAN
);

-- adding triggers
CREATE TRIGGER before_insert_trigger_assignees
BEFORE INSERT ON assignees 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- creating table tasks
CREATE TABLE tasks (
    id                  VARCHAR(36) NOT NULL PRIMARY KEY,
    `key`               VARCHAR(255) NOT NULL,
    name                TEXT,
    description         TEXT,
    status              TEXT,
    priority            TEXT,
    severity            TEXT,
    type                TEXT,
    start_date          TIMESTAMP,
    due_date            TIMESTAMP,
    end_date            TIMESTAMP,
    deleted_on          TIMESTAMP,
    deleted_by          VARCHAR(36),
    deleted             BOOLEAN,
    assignee_id         VARCHAR(36)
);

-- adding triggers
CREATE TRIGGER before_insert_trigger_tasks
BEFORE INSERT ON tasks 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- adding foreign keys
ALTER TABLE tasks 
ADD CONSTRAINT fk_tasks_assignees 
FOREIGN KEY (assignee_id) 
REFERENCES assignees(id);

-- creating table task_assignements
CREATE TABLE task_assignements (
    id                   VARCHAR(36) NOT NULL PRIMARY KEY,
    task_id              VARCHAR(36),
    assignee_id          VARCHAR(36) NOT NULL,
    assignment_date      TIMESTAMP,
    status               VARCHAR(255)
);

-- adding triggers
CREATE TRIGGER before_insert_trigger_task_assignements
BEFORE INSERT ON task_assignements 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- adding foreign keys
ALTER TABLE task_assignements 
ADD CONSTRAINT fk_tasks 
FOREIGN KEY (task_id) 
REFERENCES tasks(id);

ALTER TABLE task_assignements 
ADD CONSTRAINT fk_tasks_assignements_to_assignees 
FOREIGN KEY (assignee_id) 
REFERENCES assignees(id);

-- creating table task_workflow_mappings
CREATE TABLE task_workflow_mappings (
    id                   VARCHAR(36) NOT NULL PRIMARY KEY,
    task_id              VARCHAR(36),
    workflow_id          VARCHAR(36) NOT NULL
);

-- adding triggers
CREATE TRIGGER before_insert_trigger_task_workflow_mappings
BEFORE INSERT ON task_workflow_mappings 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- creating table activities
CREATE TABLE activities (
    id                   VARCHAR(36) NOT NULL PRIMARY KEY,
    task_id              VARCHAR(36),
    workflow_id          VARCHAR(36) NOT NULL,
    assignee_id          VARCHAR(36) NOT NULL,
    created_on           TIMESTAMP,
    comment              VARCHAR(255)
);

-- adding triggers
CREATE TRIGGER before_insert_trigger_activities
BEFORE INSERT ON activities 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- adding foreign keys
ALTER TABLE activities 
ADD CONSTRAINT fk_activities_to_tasks 
FOREIGN KEY (task_id) 
REFERENCES tasks(id);

ALTER TABLE activities 
ADD CONSTRAINT fk_activities_to_assignees 
FOREIGN KEY (assignee_id) 
REFERENCES assignees(id);

-- creating table activity_events
CREATE TABLE activity_events (
    id                   VARCHAR(36) NOT NULL PRIMARY KEY,
    activity_id          VARCHAR(36),
    event_type           VARCHAR(255),
    created_on           TIMESTAMP,
    event_data           JSON
);

-- adding triggers
CREATE TRIGGER before_insert_trigger_activity_events
BEFORE INSERT ON activity_events 
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- adding foreign keys
ALTER TABLE activity_events 
ADD CONSTRAINT fk_activities_events_to_activities 
FOREIGN KEY (activity_id) 
REFERENCES activities(id);
