import {model, property} from '@loopback/repository';
import {
  ExternalIdentifierEnabledEntity,
  UserModifiableEntity,
} from '@sourceloop/core';
import {Attachment} from './attachment.model';
import {Group} from './group.model';

@model({
  name: 'v_thread',
})
export class ThreadView
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
  })
  subject?: string;

  @property({
    type: 'string',
    name: 'ext_id',
  })
  extId?: string;

  @property({
    type: 'object',
    name: 'thread_ext_metadata',
  })
  threadExtMetadata?: object;

  @property({
    type: 'string',
    name: 'message_id',
  })
  messageId?: string;

  @property({
    type: 'string',
  })
  sender?: string;

  @property({
    type: 'string',
  })
  body?: string;

  @property({
    type: 'string',
    name: 'message_ext_metadata',
  })
  messageExtMetaData?: string;

  @property({
    type: 'array',
    itemType: 'object',
  })
  attachment?: Attachment[];

  @property({
    type: 'array',
    itemType: 'object',
  })
  group?: Group[];

  constructor(data?: Partial<ThreadView>) {
    super(data);
  }
}
