import {AnyObject, model, Model, property} from '@loopback/repository';
import {StatusType} from './enums';

@model()
export class EventAttendeeViewItemDTO extends Model {
  @property({
    type: 'string',
  })
  id: string;

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
    name: 'ext_id',
  })
  extId?: string;

  @property({
    type: 'object',
    name: 'ext_metadata',
  })
  extMetadata?: AnyObject;

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
  })
  meetingLink?: string;

  @property({
    type: 'string',
    jsonSchema: {
      maxLength: 200,
    },
  })
  identifier?: string;

  @property({
    type: 'date',
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
  })
  attendeeId?: string;

  @property({
    type: 'boolean',
  })
  isOptional?: boolean;

  @property({
    type: 'string',
  })
  attendeeIdentifier?: string;

  @property({
    type: 'boolean',
  })
  isOrganizer?: boolean;

  @property({
    type: 'string',
  })
  messages?: string;

  @property({
    type: 'string',
  })
  eventId: string;
}
