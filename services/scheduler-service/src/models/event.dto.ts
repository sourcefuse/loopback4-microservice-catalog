import {AnyObject, model, Model, property} from '@loopback/repository';
import {Attachment} from './attachment.model';
import {Attendee} from './attendee.model';
import {StatusType} from './enums/status.enum';

@model()
export class EventDTO extends Model {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    name: 'bg_color',
  })
  bgColor?: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'date',
    name: 'end_datetime',
  })
  endDateTime?: Date;

  @property({
    type: 'string',
    name: 'fg_color',
  })
  fgColor?: string;

  @property({
    type: 'string',
    name: 'icaluid',
  })
  iCalUid?: string;

  @property({
    type: 'boolean',
    default: false,
    name: 'is_full_day_event',
  })
  isFullDayEvent?: boolean;

  @property({
    type: 'boolean',
    default: false,
    name: 'is_locked',
  })
  isLocked?: boolean;

  @property({
    type: 'string',
  })
  link?: string;

  @property({
    type: 'string',
    jsonSchema: {
      maxLength: 300,
    },
  })
  location?: string;

  @property({
    type: 'string',
    name: 'meeting_link',
  })
  meetingLink?: string;

  @property({
    type: 'string',
    name: 'identifier',
    jsonSchema: {
      maxLength: 200,
    },
  })
  identifier?: string;

  @property({
    type: 'date',
    name: 'start_datetime',
  })
  startDateTime?: Date;

  @property({
    type: 'string',
    jsonSchema: {
      enum: [
        StatusType.Confirmed,
        StatusType.Tentative,
        StatusType.Cancelled,
        StatusType.Completed,
      ],
    },
  })
  status?: StatusType;

  @property({
    type: 'string',
  })
  summary?: string;

  @property({
    type: 'string',
  })
  timezone?: string;

  @property({
    type: 'string',
    required: true,
  })
  calendarId: string;

  @property({
    type: 'string',
  })
  parentEventId?: string;

  @property.array(Attachment)
  attachments?: Attachment[];

  @property.array(Attendee)
  attendees?: Attendee[];

  @property({
    type: 'string',
    name: 'ext_id',
  })
  extId?: string;

  @property({
    type: 'object',
    name: 'ext_metadata',
  })
  extMetadata?: AnyObject;

  constructor(data?: Partial<EventDTO>) {
    super(data);
  }
}
