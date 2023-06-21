import {Entity, model, property} from '@loopback/repository';
import {Action} from '@sourceloop/audit-log';

/**
 * Audit Logs Model to be Used for conditional audit log mixin.
 */
@model({
  name: 'audit_logs',
})
export class ConditionalAuditLog extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  action: Action;

  @property({
    name: 'acted_at',
    type: 'date',
    required: true,
  })
  actedAt: Date;

  @property({
    name: 'acted_on',
    type: 'string',
  })
  actedOn?: string;

  @property({
    name: 'action_key',
    type: 'string',
    required: true,
  })
  actionKey: string;

  @property({
    name: 'entity_id',
    type: 'string',
    required: true,
  })
  entityId: string;

  @property({
    type: 'string',
    required: true,
  })
  actor: string;

  @property({
    type: 'object',
  })
  before?: object;

  @property({
    type: 'object',
  })
  after?: object;

  constructor(data?: Partial<ConditionalAuditLog>) {
    super(data);
  }
}
