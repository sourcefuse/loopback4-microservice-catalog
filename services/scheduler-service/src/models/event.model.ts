import {
  AnyObject,
  belongsTo,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {
  ExternalIdentifierEnabledEntity,
  UserModifiableEntity,
} from '@sourceloop/core';
import {Attachment, Attendee} from '.';
import {Calendar} from './calendar.model';
import {StatusType} from './enums/status.enum';

@model({
  name: 'events',
})
export class Event
  extends UserModifiableEntity
  implements ExternalIdentifierEnabledEntity
{
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

  @belongsTo(
    () => Calendar,
    {keyFrom: 'calendarId', name: 'calendar'},
    {
      name: 'calendar_id',
      required: true,
    },
  )
  calendarId: string;

  @belongsTo(
    () => Event,
    {keyFrom: 'parentEventId', name: 'parentEvent'},
    {
      name: 'parent_event_id',
    },
  )
  parentEventId?: string;

  @hasMany(() => Attendee, {name: 'attendees', keyTo: 'eventId'})
  attendees: Attendee[];

  @hasMany(() => Attachment, {name: 'attachments', keyTo: 'eventId'})
  attachments: Attachment[];

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

  constructor(data?: Partial<Event>) {
    super(data);
  }
}

export interface EventRelations {
  calendar?: Calendar;
  event?: Event;
}

export type EventWithRelations = Event & EventRelations;
