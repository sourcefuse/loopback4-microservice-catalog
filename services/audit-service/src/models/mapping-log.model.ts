import {model, property} from '@loopback/repository';
import {CoreEntity} from '@sourceloop/core';
@model({
  name: 'mapping_logs',
})
export class MappingLog extends CoreEntity<MappingLog> {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    name: 'filter_used',
    type: 'object',
    required: true,
  })
  filterUsed: Object;

  @property({
    name: 'file_name',
    type: 'string',
    required: true,
  })
  fileName: string;

  @property({
    name: 'tenant_id',
    type: 'string',
    required: true,
  })
  tenantId: string;
}

export type MappingLogsWithRelations = MappingLog;
