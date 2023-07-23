// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {belongsTo, hasMany, model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {
  AttachmentFile,
  AttachmentFilesWithRelations,
} from './attachment-file.model';
import {MessageRecipient} from './message-recipient.model';

@model({
  name: 'messages',
})
export class Message extends UserModifiableEntity<Message> {
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
  body: string;

  @property({
    type: 'string',
    name: 'channel_id',
    required: true,
  })
  channelId: string;

  @property({
    type: 'string',
    name: 'channel_type',
    required: true,
  })
  channelType: string;

  @property({
    type: 'number',
    default: 0,
  })
  status?: number;

  @property({
    type: 'string',
  })
  subject?: string;

  @property({
    type: 'string',
    name: 'to_user_id',
  })
  toUserId?: string;

  @hasMany(() => MessageRecipient, {keyTo: 'messageId'})
  messageRecipients: MessageRecipient[];
  @hasMany(() => AttachmentFile, {keyTo: 'messageId'})
  attachmentFiles: AttachmentFile[];
  @belongsTo(
    () => Message,
    {name: 'parentMessage'},
    {name: 'parent_message_id'},
  )
  parentMessageId: string;

  @hasMany(() => Message, {keyTo: 'parentMessageId'})
  messages: Message[];
}

export interface MessageRelations {
  messages: MessageWithRelations[];
  messageRecipients: MessageRecipient;
  parentMessage: MessageWithRelations;
  messageFiles: AttachmentFilesWithRelations[];
}

export type MessageWithRelations = Message & MessageRelations;
