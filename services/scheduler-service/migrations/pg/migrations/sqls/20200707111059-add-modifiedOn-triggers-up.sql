/* Replace with your SQL commands */
SET search_path TO logs, public;

CREATE OR REPLACE FUNCTION scheduler.moddatetime()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.modified_on = now();
    RETURN NEW;
END;
$function$;

CREATE TRIGGER mdt_calendars BEFORE UPDATE ON scheduler.calendars FOR EACH ROW EXECUTE PROCEDURE scheduler.moddatetime();
CREATE TRIGGER mdt_subscriptions BEFORE UPDATE ON scheduler.subscriptions FOR EACH ROW EXECUTE PROCEDURE scheduler.moddatetime();
CREATE TRIGGER mdt_working_hours BEFORE UPDATE ON scheduler.working_hours FOR EACH ROW EXECUTE PROCEDURE scheduler.moddatetime();
CREATE TRIGGER mdt_events BEFORE UPDATE ON scheduler.events FOR EACH ROW EXECUTE PROCEDURE scheduler.moddatetime();
CREATE TRIGGER mdt_attendees BEFORE UPDATE ON scheduler.attendees FOR EACH ROW EXECUTE PROCEDURE scheduler.moddatetime();
CREATE TRIGGER mdt_attachments BEFORE UPDATE ON scheduler.attachments FOR EACH ROW EXECUTE PROCEDURE scheduler.moddatetime();
CREATE TRIGGER mdt_themes BEFORE UPDATE ON scheduler.themes FOR EACH ROW EXECUTE PROCEDURE scheduler.moddatetime();
CREATE TRIGGER mdt_settings BEFORE UPDATE ON scheduler.settings FOR EACH ROW EXECUTE PROCEDURE scheduler.moddatetime();