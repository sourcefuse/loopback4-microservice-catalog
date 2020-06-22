import {property} from '@loopback/repository';
import {FreeBusyItemDTO} from './free-busy-item.dto';

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
  items: FreeBusyItemDTO[];
}
