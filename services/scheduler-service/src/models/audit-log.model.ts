
import {Entity, model, property} from '@loopback/repository';

@model({
  name: 'audit_logs',
})
export class AuditLog extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    name: 'action_by',
  })
  actionBy?: string;

  @property({
    type: 'object',
  })
  after?: object;

  @property({
    type: 'object',
  })
  before?: object;

  @property({
    type: 'string',
    name: 'entity_id',
  })
  entityId?: string;

  @property({
    type: 'string',
    default: 'APPLICATION_LOGS',
    name: 'log_type',
  })
  logType?: string;

  @property({
    type: 'string',
    required: true,
    name: 'operation_name',
  })
  operationName: string;

  @property({
    type: 'date',
    required: true,
    default: () => new Date(),
    name: 'operation_time',
  })
  operationTime: string;

  @property({
    type: 'string',
    required: true,
    name: 'table_name',
  })
  tableName: string;

  constructor(data?: Partial<AuditLog>) {
    super(data);
  }
}
