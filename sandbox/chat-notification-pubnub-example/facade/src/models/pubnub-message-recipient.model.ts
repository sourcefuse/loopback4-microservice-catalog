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

  constructor(data?: Partial<PubnubMessageRecipient>) {
    super(data);
  }
}
