import {belongsTo, model, property} from '@loopback/repository';
import {ResponseStatusType} from './enums/response-status.enum';
import {Event, EventWithRelations} from './event.model';
import {UserModifiableEntity} from './user-modifiable-entity.model';

@model({
  name: 'attendee',
})
export class Attendee extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'date',
    name: 'end_datetime',
  })
  endDateTime?: string;

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
  startDateTime?: string;

  @belongsTo(
    () => Event,
    {keyFrom: 'eventId', name: 'event'},
    {
      name: 'event_id',
      required: true,
    },
  )
  eventId: string;

  constructor(data?: Partial<Attendee>) {
    super(data);
  }
}

export interface AttendeeRelations {
  event: EventWithRelations;
}

export type AttendeeWithRelations = Attendee & AttendeeRelations;
