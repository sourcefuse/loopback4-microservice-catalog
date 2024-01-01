-- dropping all foreign keys
ALTER TABLE tasks 
DROP FOREIGN KEY fk_tasks_assignees;

ALTER TABLE task_assignements 
DROP FOREIGN KEY fk_tasks; 

ALTER TABLE task_assignements 
DROP FOREIGN KEY fk_tasks_assignements_to_assignees;

ALTER TABLE activities 
DROP FOREIGN KEY fk_activities_to_tasks; 

ALTER TABLE activities 
DROP FOREIGN KEY fk_activities_to_assignees;

ALTER TABLE activity_events 
DROP FOREIGN KEY fk_activities_events_to_activities;

-- dropping tables
DROP TABLE IF EXISTS assignees;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS task_assignements;
DROP TABLE IF EXISTS task_workflow_mappings;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS activity_events;
