import {model, property, belongsTo} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {Message, MessageWithRelations} from './message.model';

@model({
  name: 'message_recipients',
})
export class MessageRecipient extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    name: 'channel_id',
    required: true,
  })
  channelId: string;

  @property({
    type: 'string',
    name: 'forwarded_by',
  })
  forwardedBy?: string;

  @property({
    type: 'boolean',
    name: 'is_favorite',
    default: false,
  })
  isFavorite?: boolean;

  @property({
    type: 'boolean',
    name: 'is_forwarded',
    default: false,
  })
  isForwarded?: boolean;

  @property({
    type: 'boolean',
    name: 'is_read',
    default: false,
  })
  isRead?: boolean;

  @property({
    type: 'string',
    name: 'recipient_id',
    required: true,
  })
  recipientId: string;

  @belongsTo(
    () => Message,
    {name: 'message'},
    {name: 'message_id', required: true},
  )
  messageId: string;

  constructor(data?: Partial<MessageRecipient>) {
    super(data);
  }
}

export interface MessageRecipientRelations {
  message: MessageWithRelations;
}

export type MessageRecipientWithRelations = MessageRecipient &
  MessageRecipientRelations;
