import {model, property} from '@loopback/repository';
import {Job as BaseJob} from '../job.model';
@model({
  name: 'jobs',
  settings: {
    strict: false,
  },
})
export class Job extends BaseJob {
  @property({
    name: 'tenant_id',
    type: 'string',
    required: true,
  })
  tenantId: string;
}
