import {belongsTo, model, property} from '@loopback/repository';
import {
  UserModifiableEntity,
  ExternalIdentifierEnabledEntity,
} from '@sourceloop/core';
import {Event, EventWithRelations} from './event.model';

@model({
  name: 'attachments',
})
export class Attachment extends UserModifiableEntity
  implements ExternalIdentifierEnabledEntity {
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
  })
  mimeType?: string;

  @property({
    type: 'string',
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
    name: 'ext_meadata',
  })
  extMetadata?: object;

  constructor(data?: Partial<Attachment>) {
    super(data);
  }
}

export interface AttachmentRelations {
  // describe navigational properties here
  event: EventWithRelations;
}

export type AttachmentWithRelations = Attachment & AttachmentRelations;
