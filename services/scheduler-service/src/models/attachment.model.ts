import {AnyObject, belongsTo, model, property} from '@loopback/repository';
import {
  ExternalIdentifierEnabledEntity,
  UserModifiableEntity,
} from '@sourceloop/core';
import {Event} from './event.model';

@model({
  name: 'attachments',
})
export class Attachment
  extends UserModifiableEntity
  implements ExternalIdentifierEnabledEntity
{
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    name: 'fileurl',
  })
  fileUrl: string;

  @property({
    type: 'string',
    name: 'iconlink',
  })
  iconLink?: string;

  @property({
    type: 'string',
    name: 'mimetype',
    jsonSchema: {
      maxLength: 200,
    },
  })
  mimeType?: string;

  @property({
    type: 'string',
    jsonSchema: {
      maxLength: 400,
    },
  })
  title?: string;

  @belongsTo(
    () => Event,
    {keyFrom: 'eventId', name: 'event'},
    {
      name: 'event_id',
      required: true,
    },
  )
  eventId: string;

  @property({
    type: 'string',
    name: 'ext_id',
  })
  extId?: string;

  @property({
    type: 'object',
    name: 'ext_metadata',
  })
  extMetadata?: AnyObject;

  constructor(data?: Partial<Attachment>) {
    super(data);
  }
}

export interface AttachmentRelations {
  event?: Event;
}

export type AttachmentWithRelations = Attachment & AttachmentRelations;
