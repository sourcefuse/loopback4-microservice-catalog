import {model, property} from '@loopback/repository';
import {Event} from './event.model';
import {ResponseStatusType} from './enums/response-status.enum';

@model({
  name: 'events_attendees_view',
})
export class EventAttendeeView extends Event {
  @property({
    type: 'string',
    name: 'attendee_id',
    id: true,
  })
  attendeeId: string;

  @property({
    type: 'boolean',
    default: false,
    name: 'is_optional',
  })
  isOptional?: boolean;

  @property({
    type: 'string',
    name: 'attendee_identifier',
    required: true,
  })
  attendeeIdentifier: string;

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
      ],
    },
  })
  responseStatus?: ResponseStatusType;

  @property({
    type: 'string',
    name: 'event_id',
  })
  eventId: string;

  constructor(data?: Partial<EventAttendeeView>) {
    super(data);
  }
}
