import {belongsTo, model, property} from '@loopback/repository';
import {Event, EventWithRelations} from './event.model';
import {UserModifiableEntity} from './user-modifiable-entity.model';

@model({
  name: 'attachment',
})
export class Attachment extends UserModifiableEntity {
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

  constructor(data?: Partial<Attachment>) {
    super(data);
  }
}

export interface AttachmentRelations {
  // describe navigational properties here
  event: EventWithRelations;
}

export type AttachmentWithRelations = Attachment & AttachmentRelations;
