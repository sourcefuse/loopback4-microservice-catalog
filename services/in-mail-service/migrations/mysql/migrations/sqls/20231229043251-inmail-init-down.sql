-- dropping auditing procedure
DROP PROCEDURE IF EXISTS generic_audit_procedure;

-- dropping table 
DROP TABLE IF EXISTS thread;
DROP TABLE IF EXISTS message;
DROP TABLE IF EXISTS attachment;
DROP TABLE IF EXISTS `group`;
DROP TABLE IF EXISTS meta;
DROP TABLE IF EXISTS audit_logs;
