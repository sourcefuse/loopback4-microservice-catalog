// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject, model, property} from '@loopback/repository';
import {CoreEntity, ExternalIdentifierEnabledEntity} from '@sourceloop/core';

/* This TypeScript class represents an AuditLog entity with various properties for logging audit
information in an application. */
@model({
  name: 'audit_logs',
})
export class AuditLog
  extends CoreEntity<AuditLog>
  implements ExternalIdentifierEnabledEntity
{
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
    jsonSchema: {
      maxLength: 100,
    },
  })
  logType?: string;

  @property({
    type: 'string',
    required: true,
    name: 'operation_name',
    jsonSchema: {
      maxLength: 10,
    },
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
    jsonSchema: {
      maxLength: 60,
    },
  })
  tableName: string;

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
}
