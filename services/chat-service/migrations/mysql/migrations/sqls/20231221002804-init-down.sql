-- Removing foreign keys
ALTER TABLE messages
DROP FOREIGN KEY fk_messages_messages;

ALTER TABLE message_recipients
DROP FOREIGN KEY fk_message_recipients_messages;

-- Deleting tables
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS message_recipients;
