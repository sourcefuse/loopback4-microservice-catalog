import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Channel extends Entity {
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
  name: string;

  @property({
    type: 'string',
    default: 'Send Messages Here',
  })
  description?: string;

  constructor(data?: Partial<Channel>) {
    super(data);
  }
}
