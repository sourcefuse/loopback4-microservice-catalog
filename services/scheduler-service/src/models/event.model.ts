import {belongsTo, hasMany, model, property} from '@loopback/repository';
import {
  ExternalIdentifierEnabledEntity,
  UserModifiableEntity,
} from '@sourcefuse-service-catalog/core';
import {Attachment, Attendee} from '.';
import {Calendar, CalendarWithRelations} from './calendar.model';
import {StatusType} from './enums/status.enum';

@model({
  name: 'events',
})
export class Event extends UserModifiableEntity
  implements ExternalIdentifierEnabledEntity {
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
  endDateTime?: string;

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
  })
  location?: string;

  @property({
    type: 'string',
    name: 'meeting_link',
  })
  meetingLink?: string;

  @property({
    type: 'string',
    name: 'organizer_display_name',
  })
  organizerDisplayName?: string;

  @property({
    type: 'string',
    name: 'organizer_email',
  })
  organizerEmail?: string;

  @property({
    type: 'date',
    name: 'start_datetime',
  })
  startDateTime?: string;

  @property({
    type: 'string',
    jsonSchema: {
      enum: [
        StatusType.Confirmed,
        StatusType.Tentative,
        StatusType.Cancelled,
        null,
      ],
      nullable: true,
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
    name: 'ext_meadata',
  })
  extMetadata?: object;

  constructor(data?: Partial<Event>) {
    super(data);
  }
}

export interface EventRelations {
  calendar: CalendarWithRelations;
  event: EventWithRelations;
}

export type EventWithRelations = Event & EventRelations;
