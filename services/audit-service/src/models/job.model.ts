import {Entity, model, property} from '@loopback/repository';
import {OperationKey} from '../enums/operation-key.enum';

@model({
  name: 'jobs',
  settings: {
    strict: false,
  },
})
export class Job extends Entity {
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

  constructor(data?: Partial<Job>) {
    super(data);
  }
}

export type JobWithRelations = Job;
