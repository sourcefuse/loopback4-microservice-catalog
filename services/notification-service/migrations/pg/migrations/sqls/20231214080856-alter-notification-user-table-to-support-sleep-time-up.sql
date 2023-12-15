/* Replace with your SQL commands */
ALTER TABLE main.notification_users ADD COLUMN IF NOT EXISTS  is_draft boolean default FALSE;
