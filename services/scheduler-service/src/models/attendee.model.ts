import {belongsTo, model, property} from '@loopback/repository';
import {
  ExternalIdentifierEnabledEntity,
  UserModifiableEntity,
} from '@sourceloop/core';
import {ResponseStatusType} from './enums/response-status.enum';
import {Event} from './event.model';

@model({
  name: 'attendees',
})
export class Attendee extends UserModifiableEntity
  implements ExternalIdentifierEnabledEntity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      maxLength: 200,
    },
  })
  email: string;

  @property({
    type: 'date',
    name: 'end_datetime',
  })
  endDateTime?: Date;

  @property({
    type: 'boolean',
    default: false,
    name: 'is_optional',
  })
  isOptional?: boolean;

  @property({
    type: 'boolean',
    default: false,
    name: 'is_organizer',
  })
  isOrganizer?: boolean;

  @property({
    type: 'string',
  })
  messages?: string;

  @property({
    type: 'string',
    default: ResponseStatusType.NeedsAction,
    name: 'response_status',
    jsonSchema: {
      enum: [
        ResponseStatusType.NeedsAction,
        ResponseStatusType.Tentative,
        ResponseStatusType.Accepted,
        ResponseStatusType.Declined,
        null,
      ],
      nullable: true,
    },
  })
  responseStatus?: ResponseStatusType;

  @property({
    type: 'date',
    name: 'start_datetime',
  })
  startDateTime?: Date;

  @belongsTo(
    () => Event,
    {keyFrom: 'eventId', name: 'event'},
    {
      name: 'event_id',
      required: true,
    },
  )
  eventId: string;

  @property({
    type: 'string',
    name: 'ext_id',
  })
  extId?: string;

  @property({
    type: 'object',
    name: 'ext_metadata',
  })
  extMetadata?: object;

  constructor(data?: Partial<Attendee>) {
    super(data);
  }
}

export interface AttendeeRelations {
  event?: Event;
}

export type AttendeeWithRelations = Attendee & AttendeeRelations;
