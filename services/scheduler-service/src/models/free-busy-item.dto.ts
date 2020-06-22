import {property} from '@loopback/repository';

export class FreeBusyItemDTO {
  @property({
    type: 'string',
    required: true,
  })
  id: string;
}
