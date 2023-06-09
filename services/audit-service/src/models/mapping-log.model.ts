import {Entity, model, property} from '@loopback/repository';
@model({
  name: 'mapping_logs',
})
export class MappingLog extends Entity {
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

  constructor(data?: Partial<MappingLog>) {
    super(data);
  }
}

export type MappingLogsWithRelations = MappingLog;
