import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class PubnubMessageRecipient extends Entity {
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
  channelId: string;

  @property({
    type: 'string',
    required: true,
  })
  recipientId: string;

  @property({
    type: 'string',
    required: true,
  })
  messageId: string;

  @property({
    type: 'boolean',
    default: false,
  })
  isRead?: boolean;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<PubnubMessageRecipient>) {
    super(data);
  }
}

export interface PubnubMessageRecipientRelations {
  // describe navigational properties here
}

export type PubnubMessageRecipientWithRelations = PubnubMessageRecipient & PubnubMessageRecipientRelations;
