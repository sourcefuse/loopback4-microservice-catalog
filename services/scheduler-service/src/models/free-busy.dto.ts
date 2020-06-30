import {property} from '@loopback/repository';
import {EventAttendeeView} from './event-attendee-view.model';

export class FreeBusyDTO {
  @property({
    type: 'date',
    required: true,
  })
  timeMax: Date;

  @property({
    type: 'date',
    required: true,
  })
  timeMin: Date;

  @property({
    type: 'object',
    id: true,
  })
  items: EventAttendeeView[];
}

export interface IStartEndTime {
  startDateTime: Date;
  endDateTime: Date;
}
