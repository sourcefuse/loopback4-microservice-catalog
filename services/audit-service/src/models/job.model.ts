import {model, property} from '@loopback/repository';
import {CoreEntity} from '@sourceloop/core';
import {OperationKey} from '../enums/operation-key.enum';

@model({
  name: 'jobs',
  settings: {
    strict: false,
  },
})
export class Job extends CoreEntity<Job> {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  status: string;

  @property({
    type: 'string',
  })
  operation: OperationKey;

  @property({
    name: 'filter_used',
    type: 'object',
  })
  filterUsed: Object;

  @property({
    type: 'string',
  })
  result: string;
}

export type JobWithRelations = Job;
