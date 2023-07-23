// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject, hasMany, model, property} from '@loopback/repository';
import {
  ExternalIdentifierEnabledEntity,
  UserModifiableEntity,
} from '@sourceloop/core';
import {Group} from './group.model';
import {Message} from './message.model';

@model({
  name: 'thread',
})
export class Thread
  extends UserModifiableEntity<Thread>
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
}
