import {Entity, model, property} from '@loopback/repository';
import {ExternalIdentifierEnabledEntity} from '@sourceloop/core';

@model({
  name: 'audit_logs',
})
export class AuditLogs
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
  })
  action: string;

  @property({
    type: 'string',
    required: true,
    name: 'action_type',
  })
  actionType: string;

  @property({
    type: 'string',
  })
  actor?: string;

  @property({
    type: 'date',
    name: 'acted_at',
  })
  actedAt?: string;

  @property({
    type: 'string',
    name: 'acted_entity',
  })
  actedEntity: string;

  @property({
    type: 'object',
  })
  before?: object;

  @property({
    type: 'object',
  })
  after?: object;

  @property({
    type: 'string',
  })
  reference?: string;

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

  constructor(data?: Partial<AuditLogs>) {
    super(data);
  }
}
