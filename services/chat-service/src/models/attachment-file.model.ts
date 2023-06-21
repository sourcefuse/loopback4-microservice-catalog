import {belongsTo, model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {Message, MessageWithRelations} from './message.model';

@model({
  name: 'message_files',
})
export class AttachmentFile extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
    name: 'channel_id',
    generated: false,
  })
  channelId?: string;

  @property({
    type: 'string',
    name: 'file_key',
  })
  fileKey?: string;

  @belongsTo(
    () => Message,
    {},
    {
      name: 'message_id',
    },
  )
  messageId?: string;

  @property({
    type: 'object',
    required: false,
    name: 'meta_data',
  })
  metaData?: object;

  constructor(data?: Partial<AttachmentFile>) {
    super(data);
  }
}

export interface AttachmentFileRelations {
  message: MessageWithRelations;
}

export type AttachmentFilesWithRelations = AttachmentFile &
  AttachmentFileRelations;
