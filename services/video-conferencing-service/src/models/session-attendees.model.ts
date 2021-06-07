import {Entity, model, property} from '@loopback/repository';
import {ExternalIdentifierEnabledEntity} from '@sourceloop/core';
@model({
  name: 'session_attendees',
})
export class SessionAttendees
  extends Entity
  implements ExternalIdentifierEnabledEntity
{
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;
  @property({
    type: 'string',
    required: true,
    name: 'session_id',
  })
  sessionId: string;
  @property({
    type: 'string',
    required: true,
    name: 'attendee',
  })
  attendee: string;
  @property({
    type: 'Date',
    required: true,
    name: 'created_on',
  })
  createdOn: Date;
  @property({
    type: 'Date',
    name: 'modified_on',
  })
  modifiedOn?: Date;
  @property({
    type: 'boolean',
    name: 'is_deleted',
    required: true,
  })
  isDeleted: boolean;
  @property({
    type: 'string',
    name: 'ext_id',
  })
  extId?: string;
  @property({
    type: 'object',
    name: 'ext_metadata',
  })
  extMetadata?: object;
  constructor(data?: Partial<SessionAttendees>) {
    super(data);
  }
}
