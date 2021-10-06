import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class PubnubMessage extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  subject?: string;

  @property({
    type: 'string',
    required: true,
  })
  body: string;

  @property({
    type: 'string',
    required: true,
  })
  toUserId? : string;

  @property({
    type: 'string',
    required: true
  })
  channelId: string;

  @property({
    type: 'string',
    required: true
  })
  channelType: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<PubnubMessage>) {
    super(data);
  }
}

export interface PubnubMessageRelations {
  // describe navigational properties here
}

export type PubnubMessageWithRelations = PubnubMessage & PubnubMessageRelations;
