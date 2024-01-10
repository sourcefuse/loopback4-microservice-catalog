/* Replace with your SQL commands */
ALTER TABLE main.notifications DROP COLUMN IF EXISTS is_draft;
ALTER TABLE main.notifications DROP COLUMN IF EXISTS is_critical;
ALTER TABLE main.notifications DROP COLUMN IF EXISTS group_key;
ALTER TABLE main.notification_users DROP COLUMN IF EXISTS is_read;
DROP TABLE IF EXISTS main.user_notification_settings;