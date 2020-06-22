import {JSONObject} from '@loopback/core';
import {property} from '@loopback/repository';

export class FreeBusyResponseDTO {
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
  calendars: JSONObject[];
}
