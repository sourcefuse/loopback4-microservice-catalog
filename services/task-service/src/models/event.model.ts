import {model, property} from '@loopback/repository';

@model()
export class Event {
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
