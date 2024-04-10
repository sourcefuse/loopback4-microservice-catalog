import {model, property} from '@loopback/repository';
import {MappingLog as BaseMappingLog} from '../mapping-log.model';
@model({
  name: 'mapping_logs',
})
export class MappingLog extends BaseMappingLog {
  @property({
    name: 'tenant_id',
    type: 'string',
    required: true,
  })
  tenantId: string;
}
