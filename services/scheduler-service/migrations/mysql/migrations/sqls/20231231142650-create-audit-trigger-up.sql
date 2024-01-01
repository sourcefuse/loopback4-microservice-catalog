-- INSERT Audit Trigger
CREATE TRIGGER insert_calenders_audit_trigger
AFTER INSERT ON calendars
FOR EACH ROW
CALL generic_audit_procedure('INSERT', 'calendars', 'Calendar_logs',
  NEW.id, NEW.created_by, NULL, JSON_OBJECT(
    "id", NEW.id,
    "created_by", NEW.created_by,
    "created_on", NEW.created_on,
    "deleted", NEW.deleted,
    "source", NEW.source,
    "enable_working_hours", NEW.enable_working_hours,
    "location", NEW.location,
    "modified_on", NEW.modified_on,
    "modified_by", NEW.modified_by,
    "identifier", NEW.identifier,
    "summary", NEW.summary,
    "timezone", NEW.timezone,
    "ext_id", NEW.ext_id,
    "ext_metadata", NEW.ext_metadata
  ), NEW.ext_id, NEW.ext_metadata
);

CREATE TRIGGER insert_subscription_audit_trigger
AFTER INSERT ON subscriptions 
FOR EACH ROW
CALL generic_audit_procedure('INSERT', 'subscriptions', 'Subscription_logs',
  NEW.id, NEW.created_by, NULL, JSON_OBJECT(
    "id", NEW.id,
    "access_role", NEW.access_role,
    "bg_color", NEW.bg_color,
    "calendar_id", NEW.calendar_id,
    "created_by", NEW.created_by,
    "created_on", NEW.created_on,
    "default_reminders", NEW.default_reminders,
    "deleted", NEW.deleted,
    "fg_color", NEW.fg_color,
    "is_hidden", NEW.is_hidden,
    "is_primary", NEW.is_primary,
    "modified_on", NEW.modified_on,
    "modified_by", NEW.modified_by,
    "notification_settings", NEW.notification_settings,
    "identifier", NEW.identifier,
    "ext_id", NEW.ext_id,
    "ext_metadata", NEW.ext_metadata
  ), NEW.ext_id, NEW.ext_metadata
);

CREATE TRIGGER insert_working_hours_audit_trigger
AFTER INSERT ON working_hours
FOR EACH ROW
CALL generic_audit_procedure('INSERT', 'workings', 'Working_hours_logs',
  NEW.id, NEW.created_by, NULL, JSON_OBJECT(
    "id", NEW.id,
    "calendar_id", NEW.calendar_id,
    "created_by", NEW.created_by,
    "created_on", NEW.created_on,
    "day_of_week", NEW.day_of_week,
    "deleted", NEW.deleted,
    "end", NEW.end,
    "modified_on", NEW.modified_on,
    "modified_by", NEW.modified_by,
    "start", NEW.start,
    "ext_id", NEW.ext_id,
    "ext_metadata", NEW.ext_metadata
  ), NEW.ext_id, NEW.ext_metadata
);

CREATE TRIGGER insert_events_audit_trigger
AFTER INSERT ON events
FOR EACH ROW
CALL generic_audit_procedure('INSERT', 'events', 'Events_logs',
  NEW.id, NEW.created_by, NULL, JSON_OBJECT(
    "id", NEW.id,
    "bg_color", NEW.bg_color,
    "calendar_id", NEW.calendar_id,
    "created_by", NEW.created_by,
    "created_on", NEW.created_on,
    "deleted", NEW.deleted,
    "description", NEW.description,
    "end_datetime", NEW.end_datetime,
    "fg_color", NEW.fg_color,
    "icaluid", NEW.icaluid,
    "is_full_day_event", NEW.is_full_day_event,
    "is_locked", NEW.is_locked,
    "link", NEW.link,
    "location", NEW.location,
    "meeting_link", NEW.meeting_link,
    "modified_by", NEW.modified_by,
    "modified_on", NEW.modified_on,
    "identifier", NEW.identifier,
    "parent_event_id", NEW.parent_event_id,
    "start_datetime", NEW.start_datetime,
    "status", NEW.status,
    "summary", NEW.summary,
    "timezone", NEW.timezone,
    "ext_id", NEW.ext_id,
    "ext_metadata", NEW.ext_metadata
  ), NEW.ext_id, NEW.ext_metadata
);

CREATE TRIGGER insert_attendees_audit_trigger
AFTER INSERT ON attendees
FOR EACH ROW
CALL generic_audit_procedure('INSERT', 'attendees', 'Attendees_logs',
  NEW.id, NEW.created_by, NULL, JSON_OBJECT(
    "id", NEW.id,
    "created_by", NEW.created_by,
    "created_on", NEW.created_on,
    "deleted", NEW.deleted,
    "identifier", NEW.identifier,
    "event_id", NEW.event_id,
    "is_optional", NEW.is_optional,
    "is_organizer", NEW.is_organizer,
    "messages", NEW.messages,
    "modified_on", NEW.modified_on,
    "modified_by", NEW.modified_by,
    "response_status", NEW.response_status,
    "ext_id", NEW.ext_id,
    "ext_metadata", NEW.ext_metadata
  ), NEW.ext_id, NEW.ext_metadata
);

CREATE TRIGGER insert_attachments_audit_trigger
AFTER INSERT ON attachments
FOR EACH ROW
CALL generic_audit_procedure('INSERT', 'attachments', 'Attachments_logs',
  NEW.id, NEW.created_by, NULL, JSON_OBJECT(
    "id", NEW.id,
    "created_by", NEW.created_by,
    "created_on", NEW.created_on,
    "deleted", NEW.deleted,
    "event_id", NEW.event_id,
    "fileurl", NEW.fileurl,
    "iconlink", NEW.iconlink,
    "mimetype", NEW.mimetype,
    "modified_on", NEW.modified_on,
    "title", NEW.title,
    "modified_by", NEW.modified_by,
    "ext_id", NEW.ext_id,
    "ext_metadata", NEW.ext_metadata
  ), NEW.ext_id, NEW.ext_metadata
);


-- UPDATE Audit Trigger
CREATE TRIGGER update_calenders_audit_trigger
AFTER UPDATE ON calendars
FOR EACH ROW
CALL generic_audit_procedure('UPDATE', 'calendars', 'Calendar_logs',
  NEW.id, NEW.modified_by, JSON_OBJECT(
    "id", OLD.id,
    "created_by", OLD.created_by,
    "created_on", OLD.created_on,
    "deleted", OLD.deleted,
    "source", OLD.source,
    "enable_working_hours", OLD.enable_working_hours,
    "location", OLD.location,
    "modified_on", OLD.modified_on,
    "modified_by", OLD.modified_by,
    "identifier", OLD.identifier,
    "summary", OLD.summary,
    "timezone", OLD.timezone,
    "ext_id", OLD.ext_id,
    "ext_metadata", OLD.ext_metadata
  ), JSON_OBJECT(
    "id", NEW.id,
    "created_by", NEW.created_by,
    "created_on", NEW.created_on,
    "deleted", NEW.deleted,
    "source", NEW.source,
    "enable_working_hours", NEW.enable_working_hours,
    "location", NEW.location,
    "modified_on", NEW.modified_on,
    "modified_by", NEW.modified_by,
    "identifier", NEW.identifier,
    "summary", NEW.summary,
    "timezone", NEW.timezone,
    "ext_id", NEW.ext_id,
    "ext_metadata", NEW.ext_metadata
  ), NEW.ext_id, NEW.ext_metadata
);

CREATE TRIGGER update_subscription_audit_trigger
AFTER UPDATE ON subscriptions 
FOR EACH ROW
CALL generic_audit_procedure('UPDATE', 'subscriptions', 'Subscription_logs',
  NEW.id, NEW.modified_by, JSON_OBJECT(
    "id", OLD.id,
    "access_role", OLD.access_role,
    "bg_color", OLD.bg_color,
    "calendar_id", OLD.calendar_id,
    "created_by", OLD.created_by,
    "created_on", OLD.created_on,
    "default_reminders", OLD.default_reminders,
    "deleted", OLD.deleted,
    "fg_color", OLD.fg_color,
    "is_hidden", OLD.is_hidden,
    "is_primary", OLD.is_primary,
    "modified_on", OLD.modified_on,
    "modified_by", OLD.modified_by,
    "notification_settings", OLD.notification_settings,
    "identifier", OLD.identifier,
    "ext_id", OLD.ext_id,
    "ext_metadata", OLD.ext_metadata
  ), JSON_OBJECT(
    "id", NEW.id,
    "access_role", NEW.access_role,
    "bg_color", NEW.bg_color,
    "calendar_id", NEW.calendar_id,
    "created_by", NEW.created_by,
    "created_on", NEW.created_on,
    "default_reminders", NEW.default_reminders,
    "deleted", NEW.deleted,
    "fg_color", NEW.fg_color,
    "is_hidden", NEW.is_hidden,
    "is_primary", NEW.is_primary,
    "modified_on", NEW.modified_on,
    "modified_by", NEW.modified_by,
    "notification_settings", NEW.notification_settings,
    "identifier", NEW.identifier,
    "ext_id", NEW.ext_id,
    "ext_metadata", NEW.ext_metadata
  ), NEW.ext_id, NEW.ext_metadata
);

CREATE TRIGGER update_working_hours_audit_trigger
AFTER UPDATE ON working_hours
FOR EACH ROW
CALL generic_audit_procedure('UPDATE', 'workings', 'Working_hours_logs',
  NEW.id, NEW.modified_by, JSON_OBJECT(
    "id", OLD.id,
    "calendar_id", OLD.calendar_id,
    "created_by", OLD.created_by,
    "created_on", OLD.created_on,
    "day_of_week", OLD.day_of_week,
    "deleted", OLD.deleted,
    "end", OLD.end,
    "modified_on", OLD.modified_on,
    "modified_by", OLD.modified_by,
    "start", OLD.start,
    "ext_id", OLD.ext_id,
    "ext_metadata", OLD.ext_metadata
  ), JSON_OBJECT(
    "id", NEW.id,
    "calendar_id", NEW.calendar_id,
    "created_by", NEW.created_by,
    "created_on", NEW.created_on,
    "day_of_week", NEW.day_of_week,
    "deleted", NEW.deleted,
    "end", NEW.end,
    "modified_on", NEW.modified_on,
    "modified_by", NEW.modified_by,
    "start", NEW.start,
    "ext_id", NEW.ext_id,
    "ext_metadata", NEW.ext_metadata
  ), NEW.ext_id, NEW.ext_metadata
);

CREATE TRIGGER update_events_audit_trigger
AFTER UPDATE ON events
FOR EACH ROW
CALL generic_audit_procedure('UPDATE', 'events', 'Events_logs',
  NEW.id, NEW.modified_by, JSON_OBJECT(
    "id", OLD.id,
    "bg_color", OLD.bg_color,
    "calendar_id", OLD.calendar_id,
    "created_by", OLD.created_by,
    "created_on", OLD.created_on,
    "deleted", OLD.deleted,
    "description", OLD.description,
    "end_datetime", OLD.end_datetime,
    "fg_color", OLD.fg_color,
    "icaluid", OLD.icaluid,
    "is_full_day_event", OLD.is_full_day_event,
    "is_locked", OLD.is_locked,
    "link", OLD.link,
    "location", OLD.location,
    "meeting_link", OLD.meeting_link,
    "modified_by", OLD.modified_by,
    "modified_on", OLD.modified_on,
    "identifier", OLD.identifier,
    "parent_event_id", OLD.parent_event_id,
    "start_datetime", OLD.start_datetime,
    "status", OLD.status,
    "summary", OLD.summary,
    "timezone", OLD.timezone,
    "ext_id", OLD.ext_id,
    "ext_metadata", OLD.ext_metadata
  ), JSON_OBJECT(
    "id", NEW.id,
    "bg_color", NEW.bg_color,
    "calendar_id", NEW.calendar_id,
    "created_by", NEW.created_by,
    "created_on", NEW.created_on,
    "deleted", NEW.deleted,
    "description", NEW.description,
    "end_datetime", NEW.end_datetime,
    "fg_color", NEW.fg_color,
    "icaluid", NEW.icaluid,
    "is_full_day_event", NEW.is_full_day_event,
    "is_locked", NEW.is_locked,
    "link", NEW.link,
    "location", NEW.location,
    "meeting_link", NEW.meeting_link,
    "modified_by", NEW.modified_by,
    "modified_on", NEW.modified_on,
    "identifier", NEW.identifier,
    "parent_event_id", NEW.parent_event_id,
    "start_datetime", NEW.start_datetime,
    "status", NEW.status,
    "summary", NEW.summary,
    "timezone", NEW.timezone,
    "ext_id", NEW.ext_id,
    "ext_metadata", NEW.ext_metadata
  ), NEW.ext_id, NEW.ext_metadata
);

CREATE TRIGGER update_attendees_audit_trigger
AFTER UPDATE ON attendees
FOR EACH ROW
CALL generic_audit_procedure('UPDATE', 'attendees', 'Attendees_logs',
  NEW.id, NEW.modified_by, JSON_OBJECT(
    "id", OLD.id,
    "created_by", OLD.created_by,
    "created_on", OLD.created_on,
    "deleted", OLD.deleted,
    "identifier", OLD.identifier,
    "event_id", OLD.event_id,
    "is_optional", OLD.is_optional,
    "is_organizer", OLD.is_organizer,
    "messages", OLD.messages,
    "modified_on", OLD.modified_on,
    "modified_by", OLD.modified_by,
    "response_status", OLD.response_status,
    "ext_id", OLD.ext_id,
    "ext_metadata", OLD.ext_metadata
  ), JSON_OBJECT(
    "id", NEW.id,
    "created_by", NEW.created_by,
    "created_on", NEW.created_on,
    "deleted", NEW.deleted,
    "identifier", NEW.identifier,
    "event_id", NEW.event_id,
    "is_optional", NEW.is_optional,
    "is_organizer", NEW.is_organizer,
    "messages", NEW.messages,
    "modified_on", NEW.modified_on,
    "modified_by", NEW.modified_by,
    "response_status", NEW.response_status,
    "ext_id", NEW.ext_id,
    "ext_metadata", NEW.ext_metadata
  ), NEW.ext_id, NEW.ext_metadata
);

CREATE TRIGGER update_attachments_audit_trigger
AFTER UPDATE ON attachments
FOR EACH ROW
CALL generic_audit_procedure('UPDATE', 'attachments', 'Attachments_logs',
  NEW.id, NEW.modified_by, JSON_OBJECT(
    "id", OLD.id,
    "created_by", OLD.created_by,
    "created_on", OLD.created_on,
    "deleted", OLD.deleted,
    "event_id", OLD.event_id,
    "fileurl", OLD.fileurl,
    "iconlink", OLD.iconlink,
    "mimetype", OLD.mimetype,
    "modified_on", OLD.modified_on,
    "title", OLD.title,
    "modified_by", OLD.modified_by,
    "ext_id", OLD.ext_id,
    "ext_metadata", OLD.ext_metadata
  ), JSON_OBJECT(
    "id", NEW.id,
    "created_by", NEW.created_by,
    "created_on", NEW.created_on,
    "deleted", NEW.deleted,
    "event_id", NEW.event_id,
    "fileurl", NEW.fileurl,
    "iconlink", NEW.iconlink,
    "mimetype", NEW.mimetype,
    "modified_on", NEW.modified_on,
    "title", NEW.title,
    "modified_by", NEW.modified_by,
    "ext_id", NEW.ext_id,
    "ext_metadata", NEW.ext_metadata
  ), NEW.ext_id, NEW.ext_metadata
);


-- DELETE Audit Trigger
CREATE TRIGGER delete_calenders_audit_trigger
AFTER DELETE ON calendars
FOR EACH ROW
CALL generic_audit_procedure('DELETE', 'calendars', 'Calendar_logs',
  OLD.id, OLD.modified_by, JSON_OBJECT(
    "id", OLD.id,
    "created_by", OLD.created_by,
    "created_on", OLD.created_on,
    "deleted", OLD.deleted,
    "source", OLD.source,
    "enable_working_hours", OLD.enable_working_hours,
    "location", OLD.location,
    "modified_on", OLD.modified_on,
    "modified_by", OLD.modified_by,
    "identifier", OLD.identifier,
    "summary", OLD.summary,
    "timezone", OLD.timezone,
    "ext_id", OLD.ext_id,
    "ext_metadata", OLD.ext_metadata
  ), NULL, OLD.ext_id, OLD.ext_metadata
);

CREATE TRIGGER delete_subscription_audit_trigger
AFTER DELETE ON subscriptions 
FOR EACH ROW
CALL generic_audit_procedure('DELETE', 'subscriptions', 'Subscription_logs',
  OLD.id, OLD.modified_by, JSON_OBJECT(
    "id", OLD.id,
    "access_role", OLD.access_role,
    "bg_color", OLD.bg_color,
    "calendar_id", OLD.calendar_id,
    "created_by", OLD.created_by,
    "created_on", OLD.created_on,
    "default_reminders", OLD.default_reminders,
    "deleted", OLD.deleted,
    "fg_color", OLD.fg_color,
    "is_hidden", OLD.is_hidden,
    "is_primary", OLD.is_primary,
    "modified_on", OLD.modified_on,
    "modified_by", OLD.modified_by,
    "notification_settings", OLD.notification_settings,
    "identifier", OLD.identifier,
    "ext_id", OLD.ext_id,
    "ext_metadata", OLD.ext_metadata
  ), NULL, OLD.ext_id, OLD.ext_metadata
);

CREATE TRIGGER delete_working_hours_audit_trigger
AFTER DELETE ON working_hours
FOR EACH ROW
CALL generic_audit_procedure('DELETE', 'workings', 'Working_hours_logs',
  OLD.id, OLD.modified_by, JSON_OBJECT(
    "id", OLD.id,
    "calendar_id", OLD.calendar_id,
    "created_by", OLD.created_by,
    "created_on", OLD.created_on,
    "day_of_week", OLD.day_of_week,
    "deleted", OLD.deleted,
    "end", OLD.end,
    "modified_on", OLD.modified_on,
    "modified_by", OLD.modified_by,
    "start", OLD.start,
    "ext_id", OLD.ext_id,
    "ext_metadata", OLD.ext_metadata
  ), NULL, OLD.ext_id, OLD.ext_metadata
);

CREATE TRIGGER delete_events_audit_trigger
AFTER DELETE ON events
FOR EACH ROW
CALL generic_audit_procedure('DELETE', 'events', 'Events_logs',
  OLD.id, OLD.modified_by, JSON_OBJECT(
    "id", OLD.id,
    "bg_color", OLD.bg_color,
    "calendar_id", OLD.calendar_id,
    "created_by", OLD.created_by,
    "created_on", OLD.created_on,
    "deleted", OLD.deleted,
    "description", OLD.description,
    "end_datetime", OLD.end_datetime,
    "fg_color", OLD.fg_color,
    "icaluid", OLD.icaluid,
    "is_full_day_event", OLD.is_full_day_event,
    "is_locked", OLD.is_locked,
    "link", OLD.link,
    "location", OLD.location,
    "meeting_link", OLD.meeting_link,
    "modified_by", OLD.modified_by,
    "modified_on", OLD.modified_on,
    "identifier", OLD.identifier,
    "parent_event_id", OLD.parent_event_id,
    "start_datetime", OLD.start_datetime,
    "status", OLD.status,
    "summary", OLD.summary,
    "timezone", OLD.timezone,
    "ext_id", OLD.ext_id,
    "ext_metadata", OLD.ext_metadata
  ), NULL, OLD.ext_id, OLD.ext_metadata
);

CREATE TRIGGER delete_attendees_audit_trigger
AFTER DELETE ON attendees
FOR EACH ROW
CALL generic_audit_procedure('DELETE', 'attendees', 'Attendees_logs',
  OLD.id, OLD.modified_by, JSON_OBJECT(
    "id", OLD.id,
    "created_by", OLD.created_by,
    "created_on", OLD.created_on,
    "deleted", OLD.deleted,
    "identifier", OLD.identifier,
    "event_id", OLD.event_id,
    "is_optional", OLD.is_optional,
    "is_organizer", OLD.is_organizer,
    "messages", OLD.messages,
    "modified_on", OLD.modified_on,
    "modified_by", OLD.modified_by,
    "response_status", OLD.response_status,
    "ext_id", OLD.ext_id,
    "ext_metadata", OLD.ext_metadata
  ), NULL, OLD.ext_id, OLD.ext_metadata
);

CREATE TRIGGER delete_attachments_audit_trigger
AFTER DELETE ON attachments
FOR EACH ROW
CALL generic_audit_procedure('DELETE', 'attachments', 'Attachments_logs',
  OLD.id, OLD.modified_by, JSON_OBJECT(
    "id", OLD.id,
    "created_by", OLD.created_by,
    "created_on", OLD.created_on,
    "deleted", OLD.deleted,
    "event_id", OLD.event_id,
    "fileurl", OLD.fileurl,
    "iconlink", OLD.iconlink,
    "mimetype", OLD.mimetype,
    "modified_on", OLD.modified_on,
    "title", OLD.title,
    "modified_by", OLD.modified_by,
    "ext_id", OLD.ext_id,
    "ext_metadata", OLD.ext_metadata
  ), NULL, OLD.ext_id, OLD.ext_metadata
);

