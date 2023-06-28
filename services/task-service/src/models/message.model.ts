import {model, property} from '@loopback/repository';

@model()
export class Message {
  @property({
    type: 'string',
    required: true,
  })
  message: string;

  @property({
    type: 'string',
    required: true,
  })
  key: string;

  @property({
    type: 'any',
    required: false,
  })
  payload?: any;

  @property({
    type: 'string',
    required: true,
  })
  eventKey: string;

  @property({
    type: 'string',
    required: true,
  })
  taskKey: string;
}
