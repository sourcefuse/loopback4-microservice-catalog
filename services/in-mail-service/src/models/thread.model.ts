import {model, property, hasMany, AnyObject} from '@loopback/repository';
import {Message} from './message.model';
import {Group} from './group.model';
import {
  UserModifiableEntity,
  ExternalIdentifierEnabledEntity,
} from '@sourceloop/core';

@model({
  name: 'thread',
})
export class Thread
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
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  subject: string;

  @property({
    type: 'number',
    default: 1,
    name: 'message_counts',
  })
  messageCounts: number;

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

  @hasMany(() => Message, {
    keyFrom: 'id',
    keyTo: 'thread_id',
    name: 'message',
  })
  messages: Message[];

  @hasMany(() => Group, {
    keyFrom: 'id',
    keyTo: 'thread_id',
    name: 'group',
  })
  groups: Group[];

  constructor(data?: Partial<Thread>) {
    super(data);
  }
}
