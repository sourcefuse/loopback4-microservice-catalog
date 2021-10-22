import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Pubnubnotification extends Entity {
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
  subject: string;

  @property({
    type: 'string',
    required: true,
  })
  body: string;

  @property({
    type: 'object',
    required: true,
  })
  receiver: object;

  @property({
    type: 'number',
    required: true,
  })
  type: number;

  constructor(data?: Partial<Pubnubnotification>) {
    super(data);
  }
}
