import {
  AnyObject,
  belongsTo,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {
  ExternalIdentifierEnabledEntity,
  UserModifiableEntity,
} from '@sourceloop/core';
import {Attachment} from './attachment.model';
import {Group} from './group.model';
import {Meta} from './meta.model';
import {Thread} from './thread.model';

export enum StatusMarker {
  draft = 'draft',
  send = 'send',
}

@model({
  name: 'message',
})
export class Message
  extends UserModifiableEntity
  implements ExternalIdentifierEnabledEntity
{
  @property({
    type: 'string',
    id: true,
    generated: true,
    useDefaultIdType: false,
    postgresql: {dataType: 'uuid'},
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  sender: string;

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
    type: 'string',
    required: true,
    default: StatusMarker.draft,
    jsonSchema: {
      enum: Object.values(StatusMarker),
    },
  })
  status: string;

  @property({
    type: 'string',
    required: false,
    name: 'ext_id',
  })
  extId: string;

  @property({
    type: 'object',
    required: false,
    name: 'ext_metadata',
  })
  extMetadata?: AnyObject;

  @hasMany(() => Attachment, {
    keyFrom: 'id',
    keyTo: 'message_id',
    name: 'attachment',
  })
  attachments: Attachment[];

  @hasMany(() => Group, {
    keyFrom: 'id',
    keyTo: 'messageId',
    name: 'group',
  })
  group: Group[];

  @hasMany(() => Meta, {
    keyFrom: 'id',
    keyTo: 'messageId',
    name: 'meta',
  })
  meta: Meta[];

  @belongsTo(
    () => Thread,
    {
      keyFrom: 'threadId',
      keyTo: 'id',
      name: 'thread',
    },
    {name: 'thread_id'},
  )
  threadId: string;

  constructor(data?: Partial<Message>) {
    super(data);
  }
}

export interface MessageRelations {
  meta: Meta[];
  group: Group[];
  attachments: Attachment[];
}

export type MessageWithRelations = Message & MessageRelations;
