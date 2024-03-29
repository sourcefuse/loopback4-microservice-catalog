﻿// Copyright (c) 2023 Sourcefuse Technologies
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
  name: 'attachment',
})
export class Attachment
  extends UserModifiableEntity<Attachment>
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
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  path: string;

  @property({
    type: 'string',
    required: true,
  })
  thumbnail: string;

  @property({
    type: 'string',
    required: true,
  })
  mime: string;

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
