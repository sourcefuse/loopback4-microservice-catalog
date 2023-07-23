// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject, belongsTo, model, property} from '@loopback/repository';
import {
  ExternalIdentifierEnabledEntity,
  UserModifiableEntity,
} from '@sourceloop/core';
import {Message} from './message.model';

@model({
  name: 'meta',
})
export class Meta
  extends UserModifiableEntity<Meta>
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
  key: string;

  @property({
    type: 'string',
  })
  value?: string;

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
}
