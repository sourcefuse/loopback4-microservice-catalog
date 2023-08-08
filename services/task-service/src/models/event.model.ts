import {Entity, model, property} from '@loopback/repository';

@model()
export class EventModel extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  key: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'string',
    required: true,
  })
  source: string;

  @property({
    type: 'object',
    required: true,
  })
  payload: any;
}
