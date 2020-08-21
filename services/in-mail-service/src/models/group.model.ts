import {model, property, belongsTo, AnyObject} from '@loopback/repository';
import {Message} from './message.model';
import {Thread} from './thread.model';
import {
  UserModifiableEntity,
  ExternalIdentifierEnabledEntity,
} from '@sourceloop/core';

export enum VisibilityMarker {
  read = 'read',
  new = 'new',
  unread = 'unread',
}

export enum PartyTypeMarker {
  from = 'from',
  to = 'to',
  cc = 'cc',
  bcc = 'bcc',
}

export enum StorageMarker {
  draft = 'draft',
  send = 'send',
  inbox = 'inbox',
  trash = 'trash',
}

@model({
  name: 'group',
})
export class Group extends UserModifiableEntity
  implements ExternalIdentifierEnabledEntity {
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
  party: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(PartyTypeMarker),
    },
  })
  type: PartyTypeMarker;

  @property({
    type: 'string',
    default: StorageMarker.inbox,
    jsonSchema: {
      default: StorageMarker.inbox,
      enum: Object.values(StorageMarker),
    },
  })
  storage?: string;

  @property({
    type: 'string',
    default: VisibilityMarker.new,
    jsonSchema: {
      default: VisibilityMarker.new,
      enum: Object.values(VisibilityMarker),
    },
  })
  visibility?: string;

  @property({
    type: 'string',
    required: false,
    name: 'ext_id',
  })
  extId?: string;

  @property({
    type: 'object',
    required: false,
    name: 'ext_metadata',
  })
  extMetadata?: AnyObject;

  @belongsTo(
    () => Message,
    {
      keyFrom: 'messageId',
      keyTo: 'id',
      name: 'message',
    },
    {name: 'message_id'},
  )
  messageId: string;

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

  constructor(data?: Partial<Group>) {
    super(data);
  }
}
