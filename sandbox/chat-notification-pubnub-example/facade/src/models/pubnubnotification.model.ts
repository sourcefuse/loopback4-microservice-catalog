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

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Pubnubnotification>) {
    super(data);
  }
}

export interface PubnubnotificationRelations {
  // describe navigational properties here
}

export type PubnubnotificationWithRelations = Pubnubnotification & PubnubnotificationRelations;
