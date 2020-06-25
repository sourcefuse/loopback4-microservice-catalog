/* Replace with your SQL commands */

SET search_path TO logs, public;

  CREATE TRIGGER calenders_audit_trigger
  AFTER UPDATE OR INSERT OR DELETE
  ON scheduler.calendars
  FOR EACH ROW
  EXECUTE PROCEDURE logs.audit_trigger('Calendar_logs');

  CREATE TRIGGER subscription_audit_trigger
  AFTER UPDATE OR INSERT OR DELETE
  ON scheduler.subscriptions
  FOR EACH ROW
  EXECUTE PROCEDURE logs.audit_trigger('Subscription_logs');

  CREATE TRIGGER working_hours_audit_trigger
  AFTER UPDATE OR INSERT OR DELETE
  ON scheduler.working_hours
  FOR EACH ROW
  EXECUTE PROCEDURE logs.audit_trigger('Working_hours_logs');

  CREATE TRIGGER events_audit_trigger
  AFTER UPDATE OR INSERT OR DELETE
  ON scheduler.events
  FOR EACH ROW
  EXECUTE PROCEDURE logs.audit_trigger('Events_logs');

  CREATE TRIGGER attendees_audit_trigger
  AFTER UPDATE OR INSERT OR DELETE
  ON scheduler.attendees
  FOR EACH ROW
  EXECUTE PROCEDURE logs.audit_trigger('Attendees_logs');

  CREATE TRIGGER attachments_audit_trigger
  AFTER UPDATE OR INSERT OR DELETE
  ON scheduler.attachments
  FOR EACH ROW
  EXECUTE PROCEDURE logs.audit_trigger('Attachments_logs');
