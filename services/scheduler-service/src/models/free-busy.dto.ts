import {property} from '@loopback/repository';

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
  items: IFreeBusyItem[];
}

export interface IStartEndTime {
  startDateTime: Date;
  endDateTime: Date;
}

export interface IFreeBusyItem {
  id: string;
}

